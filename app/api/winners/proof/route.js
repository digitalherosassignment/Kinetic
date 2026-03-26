import { NextResponse } from "next/server";
import { getAuthenticatedContext } from "@/src/backend/lib/auth";

const BUCKET_NAME = "winner-proofs";

function sanitizeName(fileName = "proof.png") {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function ensureBucket(admin) {
  const { data: buckets, error: bucketsError } = await admin.storage.listBuckets();
  if (bucketsError) {
    throw new Error(bucketsError.message);
  }

  const hasBucket = buckets.some((bucket) => bucket.name === BUCKET_NAME);
  if (!hasBucket) {
    const { error: createBucketError } = await admin.storage.createBucket(
      BUCKET_NAME,
      {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024,
        allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
      }
    );

    if (createBucketError && !createBucketError.message.includes("already exists")) {
      throw new Error(createBucketError.message);
    }
  }
}

export async function POST(request) {
  const { admin, user } = await getAuthenticatedContext();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const winnerId = formData.get("winner_id");
  const proof = formData.get("proof");

  if (!winnerId || typeof winnerId !== "string") {
    return NextResponse.json(
      { error: "winner_id is required" },
      { status: 400 }
    );
  }

  if (!(proof instanceof File)) {
    return NextResponse.json(
      { error: "A screenshot file is required" },
      { status: 400 }
    );
  }

  if (!proof.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are allowed" },
      { status: 400 }
    );
  }

  const { data: winner, error: winnerError } = await admin
    .from("winners")
    .select("*")
    .eq("id", winnerId)
    .eq("user_id", user.id)
    .single();

  if (winnerError) {
    return NextResponse.json({ error: winnerError.message }, { status: 404 });
  }

  if (winner.payment_status === "paid") {
    return NextResponse.json(
      { error: "Proof upload is closed for paid winners." },
      { status: 400 }
    );
  }

  try {
    await ensureBucket(admin);

    const filePath = `${user.id}/${winnerId}-${Date.now()}-${sanitizeName(
      proof.name
    )}`;
    const fileBuffer = Buffer.from(await proof.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: proof.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = admin.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    const { data, error } = await admin
      .from("winners")
      .update({
        proof_url: publicUrl,
        verification_status: "pending",
        verified_at: null,
      })
      .eq("id", winnerId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ winner: data });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to upload proof." },
      { status: 500 }
    );
  }
}
