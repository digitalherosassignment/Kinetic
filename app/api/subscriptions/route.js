import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureProfile, getRenewalDate } from "@/src/backend/lib/auth";
import { createAdminClient } from "@/src/backend/lib/supabase/admin";
import { createClient } from "@/src/backend/lib/supabase/server";
import { getSubscriptionAmount } from "@/src/backend/lib/utils";

const subscriptionSchema = z.object({
  plan: z.enum(["essential", "elite"]),
  billing_cycle: z.enum(["monthly", "yearly"]),
  charity_id: z.string().uuid(),
  charity_percentage: z.number().int().min(10).max(100),
});

const updateSchema = z.object({
  charity_id: z.string().uuid(),
  charity_percentage: z.number().int().min(10).max(100),
});

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function GET() {
  const { user } = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const [subscriptionResult, charitySelectionResult] = await Promise.all([
    admin
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    admin
      .from("user_charities")
      .select("charity_id, contribution_percentage, charities(id, name, category)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (subscriptionResult.error) {
    return NextResponse.json(
      { error: subscriptionResult.error.message },
      { status: 500 }
    );
  }

  if (charitySelectionResult.error) {
    return NextResponse.json(
      { error: charitySelectionResult.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    subscription: subscriptionResult.data || null,
    charitySelection: charitySelectionResult.data || null,
  });
}

export async function POST(request) {
  const { user } = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  await ensureProfile(user, admin);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = subscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { plan, billing_cycle, charity_id, charity_percentage } = parsed.data;
  const amount = getSubscriptionAmount(plan, billing_cycle);

  const { data: charity, error: charityError } = await admin
    .from("charities")
    .select("id, name")
    .eq("id", charity_id)
    .single();

  if (charityError) {
    return NextResponse.json({ error: charityError.message }, { status: 400 });
  }

  const { error: cancelError } = await admin
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("user_id", user.id)
    .eq("status", "active");

  if (cancelError) {
    return NextResponse.json({ error: cancelError.message }, { status: 500 });
  }

  const { data: subscription, error: subscriptionError } = await admin
    .from("subscriptions")
    .insert({
      user_id: user.id,
      plan,
      billing_cycle,
      amount,
      charity_percentage,
      renewal_date: getRenewalDate(billing_cycle),
    })
    .select()
    .single();

  if (subscriptionError) {
    return NextResponse.json(
      { error: subscriptionError.message },
      { status: 500 }
    );
  }

  const { error: deleteUserCharityError } = await admin
    .from("user_charities")
    .delete()
    .eq("user_id", user.id);

  if (deleteUserCharityError) {
    return NextResponse.json(
      { error: deleteUserCharityError.message },
      { status: 500 }
    );
  }

  const { error: userCharityError } = await admin.from("user_charities").insert({
    user_id: user.id,
    charity_id,
    contribution_percentage: charity_percentage,
  });

  if (userCharityError) {
    return NextResponse.json({ error: userCharityError.message }, { status: 500 });
  }

  const donationAmount = Number(
    ((amount * charity_percentage) / 100).toFixed(2)
  );

  const { error: donationError } = await admin.from("donations").insert({
    user_id: user.id,
    charity_id,
    amount: donationAmount,
    source: "subscription",
  });

  if (donationError) {
    return NextResponse.json({ error: donationError.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      subscription,
      charity,
      donationAmount,
    },
    { status: 201 }
  );
}

export async function PATCH(request) {
  const { user } = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  await ensureProfile(user, admin);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { charity_id, charity_percentage } = parsed.data;

  const { data: subscription, error: subscriptionError } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscriptionError) {
    return NextResponse.json(
      { error: subscriptionError.message },
      { status: 500 }
    );
  }

  if (!subscription) {
    return NextResponse.json(
      { error: "No subscription found for this user" },
      { status: 404 }
    );
  }

  const { error: updateSubscriptionError } = await admin
    .from("subscriptions")
    .update({ charity_percentage })
    .eq("id", subscription.id);

  if (updateSubscriptionError) {
    return NextResponse.json(
      { error: updateSubscriptionError.message },
      { status: 500 }
    );
  }

  const { error: deleteUserCharityError } = await admin
    .from("user_charities")
    .delete()
    .eq("user_id", user.id);

  if (deleteUserCharityError) {
    return NextResponse.json(
      { error: deleteUserCharityError.message },
      { status: 500 }
    );
  }

  const { error: userCharityError } = await admin.from("user_charities").insert({
    user_id: user.id,
    charity_id,
    contribution_percentage: charity_percentage,
  });

  if (userCharityError) {
    return NextResponse.json({ error: userCharityError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
