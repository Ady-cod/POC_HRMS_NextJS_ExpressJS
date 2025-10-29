"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
// import Image from "next/image";

function getPageName(path: string) {
  if (path === "/") return "Home";
  const segments = path.split("/").filter(Boolean);
  return segments[segments.length - 1]
    .replace(/-/g, " ")
    .toUpperCase();

  // return segments
  //   .map((seg) =>
  //     seg.replace(/-/g, "").replace(/\b\w/g, (char) => char.toUpperCase())
  //   )
  //   .join(" / ");
}

export default function AnimatedLoader() {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
      >
        {/* Spinner */}
        <motion.div
          className="w-24 h-24 border-[6px] border-lightblue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
        >
            {/* <Image
              src="/images/DNA-logo.svg" // replace with your logo path
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
            /> */}
        </motion.div>
        {/* Text */}
        <motion.p
          className="mt-6 text-lg text-gray-700 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading <span className="text-orange-500">{pageName}</span>
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
