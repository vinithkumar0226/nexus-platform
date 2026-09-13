import "server-only";

import { inMemoryNexusRepository } from "./inMemoryNexusRepository";
import { prismaNexusRepository } from "./prismaNexusRepository";
import type { NexusRepository } from "./nexusRepository";

export function getNexusRepository(): NexusRepository {
  return process.env.DATABASE_URL
    ? prismaNexusRepository
    : inMemoryNexusRepository;
}
