"use client";

import { useEffect } from "react";
import { useNexusStore } from "@/store/nexusStore";

export default function WorkspaceHydrator() {
  const hydrateWorkspace = useNexusStore((state) => state.hydrateWorkspace);

  useEffect(() => {
    void hydrateWorkspace();
  }, [hydrateWorkspace]);

  return null;
}
