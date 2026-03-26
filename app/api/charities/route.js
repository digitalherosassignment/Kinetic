import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";
import { createAdminClient } from "@/src/backend/lib/supabase/admin";

const charitySchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  category: z.string().trim().min(1),
  image_url: z.string().trim().optional().nullable(),
  impact_goal_percent: z.number().int().min(0).max(100).default(0),
  impact_metric: z.string().trim().optional().nullable(),
  impact_value: z.string().trim().optional().nullable(),
  is_featured: z.boolean().default(false),
  total_raised: z.number().min(0).default(0),
});

const updateSchema = charitySchema.extend({
  id: z.string().uuid(),
});

const deleteSchema = z.object({
  id: z.string().uuid(),
});

function normalizeCharity(payload) {
  return {
    ...payload,
    image_url: payload.image_url || null,
    impact_metric: payload.impact_metric || null,
    impact_value: payload.impact_value || null,
    updated_at: new Date().toISOString(),
  };
}

async function requireAdminJson() {
  const context = await getAuthenticatedContext();

  if (!context.user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!context.profile || context.profile.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { admin: context.admin };
}

export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("charities")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("total_raised", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ charities: data || [] });
}

export async function POST(request) {
  const auth = await requireAdminJson();
  if (auth.error) return auth.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = charitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { data, error } = await auth.admin
    .from("charities")
    .insert(normalizeCharity(parsed.data))
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ charity: data }, { status: 201 });
}

export async function PATCH(request) {
  const auth = await requireAdminJson();
  if (auth.error) return auth.error;

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

  const { id, ...rest } = parsed.data;
  const { data, error } = await auth.admin
    .from("charities")
    .update(normalizeCharity(rest))
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ charity: data });
}

export async function DELETE(request) {
  const auth = await requireAdminJson();
  if (auth.error) return auth.error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { error } = await auth.admin
    .from("charities")
    .delete()
    .eq("id", parsed.data.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
