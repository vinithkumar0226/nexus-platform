import { createHash } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditEvent, FileType, Source } from "@/types";
import type { ApiError, ApiSuccess } from "@/types/api";
import { getNexusRepository } from "@/lib/server/repository";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_EXTENSIONS: FileType[] = ["pdf", "docx", "txt"];

function jsonError(code: string, message: string, status: number): Response {
  const body: ApiError = {
    error: { code, message },
    requestId: crypto.randomUUID(),
  };
  return Response.json(body, { status });
}

function getExtension(filename: string): FileType | null {
  const extension = filename.toLowerCase().split(".").pop();
  return extension && ALLOWED_EXTENSIONS.includes(extension as FileType)
    ? (extension as FileType)
    : null;
}

function countWords(buffer: Buffer, fileType: FileType): number {
  if (fileType !== "txt") return 0;
  const text = buffer.toString("utf8").trim();
  return text ? text.split(/\s+/).length : 0;
}

function countPdfPages(buffer: Buffer, fileType: FileType): number {
  if (fileType !== "pdf") return 0;
  return (buffer.toString("latin1").match(/\/Type\s*\/Page\b/g) ?? []).length;
}

export async function POST(request: Request): Promise<Response> {
  let storagePath: string | undefined;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError(
        "FILE_REQUIRED",
        "Attach a PDF, DOCX, or TXT file.",
        400,
      );
    }

    const fileType = getExtension(file.name);
    if (!fileType) {
      return jsonError(
        "UNSUPPORTED_FILE_TYPE",
        "Only PDF, DOCX, and TXT files are supported.",
        415,
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return jsonError(
        "INVALID_FILE_SIZE",
        "Files must be between 1 byte and 25 MB.",
        413,
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = `src-${crypto.randomUUID().slice(0, 8)}`;
    const storageKey = `storage/uploads/${id}.${fileType}`;
    storagePath = path.join(process.cwd(), storageKey);

    await mkdir(path.dirname(storagePath), { recursive: true });
    await writeFile(storagePath, buffer, { flag: "wx" });

    const uploadedAt = new Date().toISOString();
    const source: Source = {
      id,
      filename: file.name,
      fileType,
      fileSize: file.size,
      sha256: createHash("sha256").update(buffer).digest("hex"),
      pageCount: countPdfPages(buffer, fileType),
      wordCount: countWords(buffer, fileType),
      status: "processed",
      securityFlags: [],
      uploadedAt,
      processedAt: uploadedAt,
      storageKey,
    };

    const repository = getNexusRepository();
    const createdSource = await repository.createSource(source);
    const auditEvent: AuditEvent = {
      id: `audit-${crypto.randomUUID().slice(0, 8)}`,
      timestamp: uploadedAt,
      actor: "Operator",
      action: "source_uploaded",
      objectType: "source",
      objectId: createdSource.id,
      objectName: createdSource.filename,
      result: "success",
      metadata: {
        fileType: createdSource.fileType,
        fileSize: createdSource.fileSize,
        sha256: createdSource.sha256,
      },
      description: "Source document uploaded, fingerprinted, and persisted.",
    };
    await repository.createAuditEvent(auditEvent);

    const response: ApiSuccess<Source> = {
      data: createdSource,
      requestId: crypto.randomUUID(),
    };
    return Response.json(response, { status: 201 });
  } catch (error) {
    if (storagePath) {
      await unlink(storagePath).catch(() => undefined);
    }

    console.error("Source upload failed", error);
    return jsonError(
      "UPLOAD_FAILED",
      "The source could not be persisted.",
      500,
    );
  }
}
