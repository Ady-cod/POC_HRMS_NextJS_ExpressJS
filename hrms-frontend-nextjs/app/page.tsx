"use client";
import { useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import NavigateButton from "@/components/NavigateButton/NavigateButton";
import LoginModal from "@/components/LoginModal/LoginModal";

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <LayoutGroup>
      <header className="mt-12 bg-gray-300 mb-10">
        <h1 className="text-center text-5xl font-bold">
          Landing page in progress ...
        </h1>
      </header>

      <div className="flex flex-wrap justify-center gap-6 mt-10 font-semibold">
        <motion.button
          layoutId="login-cta"
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transform transition-transform hover:scale-110"
          style={{ borderRadius: 12 }}
        >
          Login
        </motion.button>

        <NavigateButton
          href="/admin"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transform transition-transform hover:scale-110"
        >
          Admin Home
        </NavigateButton>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </LayoutGroup>
  );
}
