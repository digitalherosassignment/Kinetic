import { redirect } from "next/navigation";
import { createAdminClient } from "@/src/backend/lib/supabase/admin";
import { createClient } from "@/src/backend/lib/supabase/server";

function getProfilePayload(user) {
  const fallbackName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Member";

  return {
    id: user.id,
    full_name: fallbackName,
    email: user.email,
    updated_at: new Date().toISOString(),
  };
}

export function isSubscriptionActive(subscription) {
  if (!subscription) return false;
  return (
    subscription.status === "active" &&
    new Date(subscription.renewal_date).getTime() >= Date.now()
  );
}

export function getRenewalDate(billingCycle) {
  const renewal = new Date();
  if (billingCycle === "yearly") {
    renewal.setFullYear(renewal.getFullYear() + 1);
  } else {
    renewal.setMonth(renewal.getMonth() + 1);
  }
  return renewal.toISOString();
}

export async function ensureProfile(user, adminClient = createAdminClient()) {
  if (!user) return null;

  const { data, error } = await adminClient
    .from("profiles")
    .upsert(getProfilePayload(user), { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAuthenticatedContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null, admin: null };
  }

  const admin = createAdminClient();
  const profile = await ensureProfile(user, admin);

  return { supabase, user, profile, admin };
}

export async function requireUser(redirectTo = "/login") {
  const context = await getAuthenticatedContext();
  if (!context.user) {
    redirect(redirectTo);
  }
  return context;
}

export async function requireAdmin() {
  const context = await requireUser();
  if (!context.profile || context.profile.role !== "admin") {
    redirect("/dashboard");
  }
  return context;
}
