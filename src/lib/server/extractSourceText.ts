import "server-only";

import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import type { FileType } from "@/types";

export interface ExtractedSourceText {
  text: string;
  pageCount: number;
  wordCount: number;
}

export async function extractSourceText(
  buffer: Buffer,
  fileType: FileType,
): Promise<ExtractedSourceText> {
  if (fileType === "txt") {
    const text = buffer.toString("utf8").trim();
    return {
      text,
      pageCount: 1,
      wordCount: text ? text.split(/\s+/).length : 0,
    };
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    return {
      text,
      pageCount: 0,
      wordCount: text ? text.split(/\s+/).length : 0,
    };
  }

  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const text = result.text.trim();
    return {
      text,
      pageCount: result.total,
      wordCount: text ? text.split(/\s+/).length : 0,
    };
  } finally {
    await parser.destroy();
  }
}
