import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const key = `paste:${id}`;
  const raw = await redis.get(key);

  if (!raw) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ content: raw });
}
