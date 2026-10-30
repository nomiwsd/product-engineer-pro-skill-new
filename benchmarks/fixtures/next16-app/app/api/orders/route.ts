export async function GET() {
  return Response.json([
    { id: "o1", label: "Desk" },
    { id: "o2", label: "Lamp" }
  ]);
}
