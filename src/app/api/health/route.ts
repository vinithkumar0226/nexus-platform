import type { HealthResponse } from "@/types/api";

export async function GET(): Promise<Response> {
  const response: HealthResponse = {
    service: "nexus-api",
    status: "ok",
    persistence: "in-memory",
    timestamp: new Date().toISOString(),
  };

  return Response.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
