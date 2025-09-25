"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5); // start countdown from 5

  const handleRedirect = () => {
    setLoading(true);
    setCountdown(5); // reset countdown

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    // Start countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          // Redirect after countdown ends
          if (!user) {
            router.push("/");
          } else if (user.role === "admin") {
            router.push("/admin/dashboard");
          } else if (user.role === "employee") {
            router.push("/employee/dashboard");
          } else {
            router.push("/login");
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-6">
      {/* Logo */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src="/images/DNA-logo.svg"
          alt="HRMS Logo"
          width={120}
          height={40}
        />
      </motion.div>

      {/* 404 */}
      <motion.h1
        className="text-8xl font-extrabold text-darkblue-500"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      <motion.p
        className="mt-4 text-xl font-medium text-darkblue-800 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Sorry, the page you’re looking for doesn’t exist.
      </motion.p>

      {/* Smart Button with Countdown */}
      <motion.button
        onClick={handleRedirect}
        disabled={loading}
        className={`mt-6 px-6 py-3 rounded-lg bg-lightblue-400 text-white font-semibold shadow-md transition hover:bg-lightblue-800
          ${
            loading
              ? "cursor-not-allowed opacity-70 pointer-events-none bg-lightblue-800"
              : "cursor-pointer"
          }
        `}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {loading ? `Redirecting in ${countdown}` : "Back to Dashboard"}
      </motion.button>
    </div>
  );
}
