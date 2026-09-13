import { inMemoryNexusRepository } from "@/lib/server/inMemoryNexusRepository";
import type { ApiSuccess, WorkspaceSnapshot } from "@/types/api";

export async function GET(): Promise<Response> {
  const response: ApiSuccess<WorkspaceSnapshot> = {
    data: await inMemoryNexusRepository.getWorkspaceSnapshot(),
    requestId: crypto.randomUUID(),
  };

  return Response.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
