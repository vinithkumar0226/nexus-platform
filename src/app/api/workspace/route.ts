import { getNexusRepository } from "@/lib/server/repository";
import type { ApiSuccess, WorkspaceSnapshot } from "@/types/api";

export async function GET(): Promise<Response> {
  const repository = getNexusRepository();
  const response: ApiSuccess<WorkspaceSnapshot> = {
    data: await repository.getWorkspaceSnapshot(),
    requestId: crypto.randomUUID(),
  };

  return Response.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
