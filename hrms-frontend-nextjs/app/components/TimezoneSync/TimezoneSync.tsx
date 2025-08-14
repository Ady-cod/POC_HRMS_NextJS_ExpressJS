"use client";
import { useEffect } from "react";

export default function TimezoneSync() {
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz)
        document.cookie = `tz=${tz}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
    } catch {}
  }, []);
  return null;
}
