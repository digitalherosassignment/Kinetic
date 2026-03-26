import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";

const verifySchema = z.object({
  winner_id: z.string().uuid(),
  action: z.enum(["approve", "reject", "mark_paid"]),
});

export async function POST(request) {
  const { admin, profile, user } = await getAuthenticatedContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { winner_id, action } = parsed.data;
  const { data: winner, error: winnerError } = await admin
    .from("winners")
    .select("*")
    .eq("id", winner_id)
    .single();

  if (winnerError) {
    return NextResponse.json({ error: winnerError.message }, { status: 404 });
  }

  if (action === "mark_paid" && winner.verification_status !== "approved") {
    return NextResponse.json(
      { error: "Winner must be approved before marking as paid." },
      { status: 400 }
    );
  }

  let updateData = {};
  if (action === "approve") {
    updateData = {
      verification_status: "approved",
      verified_at: new Date().toISOString(),
    };
  } else if (action === "reject") {
    updateData = {
      verification_status: "rejected",
      verified_at: new Date().toISOString(),
      payment_status: "pending",
    };
  } else if (action === "mark_paid") {
    updateData = { payment_status: "paid" };
  }

  const { data, error } = await admin
    .from("winners")
    .update(updateData)
    .eq("id", winner_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ winner: data });
}
