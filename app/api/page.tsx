import { redis } from "@/app/lib/redis";
import { nowMs } from "@/app/lib/time";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const key = `paste:${id}`;
  const raw = await redis.get(key);

  if (!raw) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const paste = JSON.parse(raw as string);
  const now = nowMs(req);

  // TTL check
  if (paste.ttl_seconds !== null) {
    const expiresAt = paste.created_at + paste.ttl_seconds * 1000;
    if (now >= expiresAt) {
      await redis.del(key);
      return Response.json({ error: "Expired" }, { status: 404 });
    }
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // Increment views
  paste.views += 1;
  await redis.set(key, JSON.stringify(paste));

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - paste.views, 0),
    expires_at:
      paste.ttl_seconds === null
        ? null
        : new Date(
            paste.created_at + paste.ttl_seconds * 1000
          ).toISOString(),
  });
}
