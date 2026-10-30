export function requireUser(req) {
  if (!req.user) return { status: 401, body: { error: "unauthenticated" } };
  return null;
}
