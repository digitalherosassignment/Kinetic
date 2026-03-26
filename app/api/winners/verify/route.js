import { createClient } from "@/src/backend/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { winner_id, action } = body; // action: 'approve' | 'reject' | 'mark_paid'

  if (!winner_id || !action) {
    return NextResponse.json({ error: "winner_id and action required" }, { status: 400 });
  }

  let updateData = {};
  if (action === "approve") {
    updateData = { verification_status: "approved", verified_at: new Date().toISOString() };
  } else if (action === "reject") {
    updateData = { verification_status: "rejected", verified_at: new Date().toISOString() };
  } else if (action === "mark_paid") {
    updateData = { payment_status: "paid" };
  }

  const { data, error } = await supabase
    .from("winners")
    .update(updateData)
    .eq("id", winner_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ winner: data });
}
