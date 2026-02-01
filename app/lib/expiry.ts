export function isExpired(
  createdAt: number,
  ttlSeconds: number | null,
  now: number
): boolean {
  if (ttlSeconds === null) return false;

  const expiresAt = createdAt + ttlSeconds * 1000;
  return now >= expiresAt;
}
