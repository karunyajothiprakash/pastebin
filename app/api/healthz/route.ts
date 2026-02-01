import { redis } from "@/app/lib/redis";

export async function GET() {
  try {
    const pong = await redis.ping();
    return Response.json({ ok: true, pong });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
