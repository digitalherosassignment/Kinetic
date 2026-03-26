import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureProfile, getAuthenticatedContext } from "@/src/backend/lib/auth";

const donationSchema = z.object({
  charity_id: z.string().uuid(),
  amount: z.number().positive(),
  source: z.enum(["independent"]).default("independent"),
});

export async function GET() {
  const { admin, user } = await getAuthenticatedContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await admin
    .from("donations")
    .select("*, charities(name, category)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ donations: data || [] });
}

export async function POST(request) {
  const { admin, user } = await getAuthenticatedContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureProfile(user, admin);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = donationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { charity_id, amount, source } = parsed.data;
  const { data: charity, error: charityError } = await admin
    .from("charities")
    .select("id, total_raised")
    .eq("id", charity_id)
    .single();

  if (charityError) {
    return NextResponse.json({ error: charityError.message }, { status: 400 });
  }

  const { data, error } = await admin
    .from("donations")
    .insert({
      user_id: user.id,
      charity_id,
      amount: Number(amount.toFixed(2)),
      source,
    })
    .select("*, charities(name, category)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: charityUpdateError } = await admin
    .from("charities")
    .update({
      total_raised: Number((Number(charity.total_raised || 0) + amount).toFixed(2)),
      updated_at: new Date().toISOString(),
    })
    .eq("id", charity_id);

  if (charityUpdateError) {
    return NextResponse.json(
      { error: charityUpdateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ donation: data }, { status: 201 });
}
