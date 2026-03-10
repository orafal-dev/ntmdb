"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POLL_INTERVAL_SECONDS = Number(
  process.env.NEXT_PUBLIC_VERSION_POLL_INTERVAL_SECONDS ?? "60",
);
const POLL_INTERVAL_MS = POLL_INTERVAL_SECONDS * 1000;

export function useVersionUpdater(): boolean {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const initialVersionRef = useRef<string | null>(null);

  const checkVersion = useCallback(async () => {
    try {
      const res = await fetch("/api/version");
      if (!res.ok) return;
      const version = await res.text();
      if (initialVersionRef.current === null) {
        initialVersionRef.current = version;
        return;
      }
      if (version !== initialVersionRef.current) {
        setUpdateAvailable(true);
      }
    } catch {
      // Ignore fetch errors (e.g. offline)
    }
  }, []);

  useEffect(() => {
    checkVersion();
    const intervalId = setInterval(checkVersion, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [checkVersion]);

  return updateAvailable;
}
