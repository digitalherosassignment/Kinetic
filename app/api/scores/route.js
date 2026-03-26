import { createClient } from "@/src/backend/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const scoreSchema = z.object({
  score: z.number().int().min(1).max(45),
  played_at: z.string().optional(),
  course_name: z.string().optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: scores, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ scores });
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = scoreSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  const { score, played_at, course_name } = parseResult.data;

  // Check existing scores count
  const { data: existing } = await supabase
    .from("scores")
    .select("id, played_at")
    .eq("user_id", user.id)
    .order("played_at", { ascending: true });

  // If 5 scores exist, delete the oldest
  if (existing && existing.length >= 5) {
    await supabase.from("scores").delete().eq("id", existing[0].id);
  }

  // Insert new score
  const { data, error } = await supabase.from("scores").insert({
    user_id: user.id,
    score,
    played_at: played_at || new Date().toISOString().split("T")[0],
    course_name: course_name || null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ score: data }, { status: 201 });
}
