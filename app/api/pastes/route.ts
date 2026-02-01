import { redis } from "@/app/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  console.log("POST /api/pastes hit");

  let body;
  try {
    body = await req.json();
    console.log("Request body:", body);
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body;

  // content validation
  if (typeof content !== "string" || content.trim() === "") {
    return Response.json(
      { error: "content is required" },
      { status: 400 }
    );
  }

  // ttl_seconds validation
  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return Response.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  // max_views validation
  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return Response.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  const id = nanoid(8);

  const paste = {
    content,
    created_at: Date.now(),
    ttl_seconds: ttl_seconds ?? null,
    max_views: max_views ?? null,
    views: 0,
  };

  await redis.set(`paste:${id}`, JSON.stringify(paste));

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}
