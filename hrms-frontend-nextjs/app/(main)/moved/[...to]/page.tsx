"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function MovedPage() {
  const router = useRouter();
  const { to } = useParams<{ to?: string[] }>();
  const target = "/" + (to?.join("/") ?? "");
  const [countdown, setCountdown] = useState(15);

  // When this moved page mounts we set a short-lived flag so
  // global components (like the AnimatedLoader) can detect that
  // the app is rendering a moved page and suppress global loading UI.
  // The flag is removed when the component unmounts or when
  // redirect starts.
  useEffect(() => {
    try {
      localStorage.setItem("suppressLoader", "1");
    } catch {
      /* ignore when storage unavailable */
    }

    return () => {
      try {
        localStorage.removeItem("suppressLoader");
      } catch {
        /* ignore */
      }
    };
  }, []);

  // Auto-redirect with countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace(target);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router, target]);

  const handleRedirect = () => {
    router.replace(target);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-6 -mt-32">

      {/* Moved Icon/Text */}
      <motion.div
        className="mb-6 mt-6 flex items-center justify-center h-14 w-14 rounded-full border-4 border-lightblue-200 bg-lightblue-50 text-lightblue-600 shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <RefreshCw className="h-7 w-7" />
      </motion.div>

      <motion.h1
        className="text-4xl font-extrabold text-darkblue-500 mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Page Moved
      </motion.h1>

      <motion.p
        className="mt-2 text-xl font-medium text-darkblue-800 text-center max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        We&apos;ve renamed this section. Taking you to the new location...
      </motion.p>

      <motion.p
        className="mt-4 text-sm text-gray-600 text-center max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
      </motion.p>

      {/* Redirect Button */}
      <motion.button
        onClick={handleRedirect}
        className="mt-6 px-6 py-3 rounded-lg bg-lightblue-400 text-white font-semibold shadow-md transition hover:bg-lightblue-800 cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Go Now
      </motion.button>
    </div>
  );
}
