import { getNexusRepository } from "@/lib/server/repository";
import type { Artifact, AuditEvent } from "@/types";
import type { ApiError, ApiSuccess } from "@/types/api";

type ReviewAction = "approve" | "reject";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(
  code: string,
  message: string,
  status: number,
): Response {
  const body: ApiError = {
    error: { code, message },
    requestId: crypto.randomUUID(),
  };
  return Response.json(body, { status });
}

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id } = await context.params;
  const body = (await request.json()) as {
    action?: ReviewAction;
    reason?: string;
  };

  if (body.action !== "approve" && body.action !== "reject") {
    return errorResponse(
      "INVALID_REVIEW_ACTION",
      "Action must be approve or reject.",
      400,
    );
  }

  if (body.action === "reject" && !body.reason?.trim()) {
    return errorResponse(
      "REJECTION_REASON_REQUIRED",
      "A rejection reason is required.",
      400,
    );
  }

  try {
    const repository = getNexusRepository();
    const artifact = await repository.reviewArtifact(
      id,
      body.action,
      body.reason,
    );
    if (!artifact) {
      return errorResponse(
        "ARTIFACT_NOT_FOUND",
        "Artifact was not found.",
        404,
      );
    }

    const auditEvent: AuditEvent = {
      id: `audit-${crypto.randomUUID().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
      actor: "Operator",
      action:
        body.action === "approve" ? "artifact_approved" : "artifact_rejected",
      objectType: "artifact",
      objectId: artifact.id,
      objectName: artifact.title,
      result: body.action === "approve" ? "success" : "warning",
      metadata: body.reason ? { reason: body.reason } : {},
      description:
        body.action === "approve"
          ? "Artifact approved by operator."
          : `Artifact rejected: ${body.reason}`,
    };
    await repository.createAuditEvent(auditEvent);

    const response: ApiSuccess<Artifact> = {
      data: artifact,
      requestId: crypto.randomUUID(),
    };
    return Response.json(response);
  } catch (error) {
    console.error("Artifact review failed", error);
    return errorResponse(
      "REVIEW_FAILED",
      "The artifact review could not be saved.",
      500,
    );
  }
}
