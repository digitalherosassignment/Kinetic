import { NextResponse } from "next/server";
import { z } from "zod";
import { publishDraw } from "@/src/backend/lib/draw-service";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";

const publishSchema = z.object({
  draw_type: z.enum(["random", "algorithmic"]).optional(),
  jackpot_rollover: z.number().min(0).optional(),
  draw_date: z.string().optional(),
});

export async function POST(request) {
  const { admin, profile, user } = await getAuthenticatedContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  try {
    const result = await publishDraw(admin, {
      drawType: parsed.data.draw_type || "random",
      jackpotRollover: parsed.data.jackpot_rollover,
      drawDate: parsed.data.draw_date,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to publish draw." },
      { status: 500 }
    );
  }
}
