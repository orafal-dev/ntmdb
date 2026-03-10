"use client";

import { useEffect, useRef } from "react";
import { toastManager } from "@/components/ui/toast";
import { useVersionUpdater } from "@/hooks/use-version-updater";

export function VersionUpdater() {
  const updateAvailable = useVersionUpdater();
  const hasShownToastRef = useRef(false);

  useEffect(() => {
    if (!updateAvailable || hasShownToastRef.current) return;
    hasShownToastRef.current = true;
    toastManager.add({
      title: "Update available",
      description:
        "Reload to get the latest features and fixes.",
      type: "info",
      timeout: 0,
      actionProps: {
        children: "Reload",
        onClick: () => window.location.reload(),
      },
    });
  }, [updateAvailable]);

  return null;
}
