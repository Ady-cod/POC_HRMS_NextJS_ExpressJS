"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedLoader({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
        >
          <motion.div
            className="w-24 h-24 border-[6px] border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "linear",
            }}
          />
          <motion.p
            className="mt-6 text-lg text-gray-700 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading My Profile...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
