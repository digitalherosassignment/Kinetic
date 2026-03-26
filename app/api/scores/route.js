import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureProfile } from "@/src/backend/lib/auth";
import { createAdminClient } from "@/src/backend/lib/supabase/admin";
import { createClient } from "@/src/backend/lib/supabase/server";

const scoreSchema = z.object({
  score: z.number().int().min(1).max(45),
  played_at: z.string().min(1),
  course_name: z.string().trim().min(1).optional(),
});

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: scores, error } = await admin
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ scores });
}

export async function POST(request) {
  const user = await getAuthenticatedUser();

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

  const parseResult = scoreSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  const { score, played_at, course_name } = parseResult.data;

  const { data: existing, error: existingError } = await admin
    .from("scores")
    .select("id, played_at, created_at")
    .eq("user_id", user.id)
    .order("played_at", { ascending: true })
    .order("created_at", { ascending: true });

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing && existing.length >= 5) {
    const { error: deleteError } = await admin
      .from("scores")
      .delete()
      .eq("id", existing[0].id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  }

  const { data, error } = await admin
    .from("scores")
    .insert({
      user_id: user.id,
      score,
      played_at,
      course_name: course_name || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ score: data }, { status: 201 });
}
