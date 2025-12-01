"use client";

import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

export default function LastLogin() {
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const current = await res.json();
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const rawLastLogins =
          (current as any).lastLogins || (current as any).last_logins || null;
        const rawLastLogin = rawLastLogins?.length
          ? rawLastLogins[rawLastLogins.length - 1]
          : (current as any).lastLogin || (current as any).last_login || null;
        /* eslint-enable @typescript-eslint/no-explicit-any */

        let ts: string | null = null;
        if (
          rawLastLogins &&
          Array.isArray(rawLastLogins) &&
          rawLastLogins.length >= 2
        ) {
          ts = rawLastLogins[rawLastLogins.length - 2];
        } else if (
          rawLastLogins &&
          Array.isArray(rawLastLogins) &&
          rawLastLogins.length === 1
        ) {
          ts = rawLastLogins[0];
        } else if (rawLastLogin) {
          ts = rawLastLogin;
        }

        if (!ts) {
          if (mounted) setDisplay(null);
          return;
        }

        try {
          const localTz = moment.tz.guess();
          const m = moment(ts).tz(localTz);
          const formatted = m.format("Do MMM, YYYY. h:mm A");
          const tzAbbr = m.format("z") || String(localTz).split("/").pop();
          if (mounted) setDisplay(`${formatted} (${tzAbbr})`);
        } catch {
          if (mounted) setDisplay(String(ts));
        }
      } catch {
        // network or auth error; leave display null
      }
    };

    fetchMe();

    return () => {
      mounted = false;
    };
  }, []);

  if (!display) return null;
  return (
    <div className="text-sm text-lightblue-500 text-center md:text-right md:ml-auto md:self-end pt-2">
      <div className="inline-flex flex-col items-center md:items-end gap-1">
        <span className="inline-flex items-center justify-center gap-1 rounded-full border-2 border-orange-300 bg-lightblue-50 px-4 py-1 font-semibold text-lightblue-700 shadow-sm">
          Last login: {display}
        </span>
      </div>
    </div>
  );
}
