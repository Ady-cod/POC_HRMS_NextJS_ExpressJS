"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  onClose: () => void;
};

const TermsModal: React.FC<Props> = ({ onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // focus close button on mount
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // initiate animated close
        setIsClosing(true);
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleCloseRequest = () => setIsClosing(true);

  useEffect(() => {
    let t: number | undefined;
    if (isClosing) {
      // match the exit animation duration (approx 220ms)
      t = window.setTimeout(() => onClose(), 240);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isClosing, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 0.5 }}
        transition={{ duration: 0.18 }}
      />

      <motion.div
        className="relative w-full max-w-2xl max-h-[80vh] overflow-auto bg-darkblue-50 rounded-md shadow-lg"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={
          isClosing
            ? { opacity: 0, y: 12, scale: 0.98 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.22 }}
        // onAnimationComplete may fire for multiple child animations;
        // we rely on the timeout-based close above to reliably unmount
      >
        <div className="sticky top-0 z-20 bg-darkblue-50 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Terms &amp; Conditions</h2>
            <button
              ref={closeButtonRef}
              onClick={handleCloseRequest}
              aria-label="Close terms and conditions"
              className="text-sm text-darkblue-600 hover:text-darkblue-900 p-1 rounded"
            >
              <span className="sr-only">Close</span>
              <X size={18} aria-hidden />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 text-sm leading-relaxed space-y-4 text-darkblue-900">
          <p>
            <strong>Effective Date: 28 May 2024</strong>
          </p>

          <p>
            Welcome to Digital Nexus AI! These Terms and Conditions govern your
            use of our website, platform, and services. By accessing or using
            our Services, you agree to comply with and be bound by these Terms.
            Please read them carefully.
          </p>

          <h3 className="font-semibold">1. Acceptance of Terms</h3>
          <p>
            By accessing and using Digital Nexus AI, you accept and agree to be
            bound by these Terms, as well as our Privacy Policy. If you do not
            agree with these Terms, you must not use our Services.
          </p>

          <h3 className="font-semibold">2. Changes to Terms</h3>
          <p>
            We reserve the right to modify these Terms at any time. Any changes
            will be effective immediately upon posting on our platform. Your
            continued use of the Services after such modifications constitutes
            your acceptance of the revised Terms.
          </p>

          <h3 className="font-semibold">3. Eligibility</h3>
          <p>
            You must be at least 18 years old to use our Services. By using our
            platform, you represent and warrant that you meet this age
            requirement.
          </p>

          <h3 className="font-semibold">4. Account Registration</h3>
          <p>
            <strong>Account Creation:</strong> You agree to provide accurate,
            current, and complete information during the registration process
            and to update such information as needed.
            <br />
            <strong>Account Security:</strong> You are responsible for
            maintaining the confidentiality of your account credentials and for
            all activities that occur under your account.
          </p>

          <h3 className="font-semibold">5. Use of Services</h3>
          <p>
            <strong>License:</strong> We grant you a limited, non-exclusive,
            non-transferable, and revocable license to use our Services for
            personal, non-commercial purposes.
            <br />
            <strong>Prohibited Conduct:</strong> You agree not to use the
            Services for illegal purposes, interfere with the platform, attempt
            unauthorized access, use automated scripts, or misrepresent your
            identity.
          </p>

          <h3 className="font-semibold">6. Content</h3>
          <p>
            <strong>Your Content:</strong> You retain ownership of content you
            submit. By posting, you grant us a worldwide, non-exclusive,
            royalty-free, sublicensable, and transferable license to use it in
            connection with our Services.
            <br />
            <strong>Our Content:</strong> All platform content is owned by
            Digital Nexus AI or its licensors and protected by intellectual
            property laws. Unauthorized use is prohibited.
          </p>

          <h3 className="font-semibold">7. Payments</h3>
          <p>
            If you purchase any Services, you agree to pay all applicable fees
            and taxes. Payments are non-refundable unless stated otherwise in
            our refund policy.
          </p>

          <h3 className="font-semibold">8. Termination</h3>
          <p>
            <strong>By You:</strong> You may terminate your account at any time.
            <br />
            <strong>By Us:</strong> We may suspend or terminate your account
            without notice for violations of these Terms or actions harmful to
            users or our business.
          </p>

          <h3 className="font-semibold">
            9. Disclaimers & Limitation of Liability
          </h3>
          <p>
            The Services are provided “as is” and without warranties. Digital
            Nexus AI is not liable for indirect, incidental, or consequential
            damages, including loss of profits, data, goodwill, or unauthorized
            access to your information.
          </p>

          <h3 className="font-semibold">10. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless Digital Nexus AI and its
            affiliates from claims, damages, or expenses arising from your use
            of the Services or violation of these Terms.
          </p>

          <h3 className="font-semibold">11. Governing Law</h3>
          <p>
            These Terms are governed by the laws of the USA. You agree to the
            exclusive jurisdiction of U.S. courts for any disputes.
          </p>

          <h3 className="font-semibold">12. Severability</h3>
          <p>
            If any provision of these Terms is deemed invalid, the remaining
            provisions will continue in full effect.
          </p>

          <h3 className="font-semibold">13. Entire Agreement</h3>
          <p>
            These Terms constitute the entire agreement between you and Digital
            Nexus AI and supersede all prior agreements.
          </p>

          <h3 className="font-semibold">14. Contact Information</h3>
          <p>
            If you have questions, contact us at:{" "}
            <strong>info@digitalnexusai.com</strong>.
          </p>

          <p className="text-xs text-gray-500">Last updated: 28 May 2024</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TermsModal;
