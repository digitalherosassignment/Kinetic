import { createClient } from "@/src/backend/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscription: data?.[0] || null });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { plan, billing_cycle, amount, charity_percentage } = body;

  // Cancel existing active subscriptions
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("user_id", user.id)
    .eq("status", "active");

  const renewal = new Date();
  renewal.setMonth(renewal.getMonth() + (billing_cycle === "yearly" ? 12 : 1));

  const { data, error } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan,
    billing_cycle,
    amount,
    charity_percentage: charity_percentage || 10,
    renewal_date: renewal.toISOString(),
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscription: data }, { status: 201 });
}
