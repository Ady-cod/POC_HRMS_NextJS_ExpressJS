"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface ConnectionMessengerProps {
  service: "slack" | "trello";
}

/**
 * Utility component to send connection success/failure messages to parent window
 * This should be included in external OAuth callback pages
 */
const ConnectionMessenger: React.FC<ConnectionMessengerProps> = ({
  service,
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sendMessageToParent = () => {
      console.log(
        "ConnectionMessenger: Component mounted, checking URL parameters",
        window.location.search
      );
      console.log("ConnectionMessenger: Full URL:", window.location.href);
      console.log("ConnectionMessenger: Referrer:", document.referrer);

      // Check URL for success/failure indicators
      const success = searchParams.get("success") === "true";
      const error = searchParams.get("error");
      const connected = searchParams.get("connected") === "true";
      const authorized = searchParams.get("authorized") === "true";
      const state = searchParams.get("state");
      const code = searchParams.get("code");

      console.log("ConnectionMessenger: Detected params:", {
        success,
        error,
        connected,
        authorized,
        state,
        code,
      });

      if (success || connected || authorized || code) {
        console.log(
          `ConnectionMessenger: Sending success message for ${service}`
        );
        // Send success message to parent
        window.parent.postMessage(
          {
            type: "CONNECTION_SUCCESS",
            service: service,
            state: state,
          },
          "*"
        );
      } else if (error) {
        console.log(
          `ConnectionMessenger: Sending failure message for ${service}`,
          error
        );
        // Send failure message to parent
        window.parent.postMessage(
          {
            type: "CONNECTION_FAILURE",
            service: service,
            error: error,
            state: state,
          },
          "*"
        );
      } else {
        // If no clear success/failure indicators, check the URL path
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        console.log("ConnectionMessenger: Path analysis:", {
          currentPath,
          currentHash,
        });

        if (
          currentPath.includes("success") ||
          currentPath.includes("connected") ||
          currentPath.includes("authorized") ||
          currentHash.includes("success")
        ) {
          console.log(
            `ConnectionMessenger: Path indicates success for ${service}`
          );
          window.parent.postMessage(
            {
              type: "CONNECTION_SUCCESS",
              service: service,
            },
            "*"
          );
        }
      }
    };

    // Send message after a short delay to ensure parent is ready
    const timeoutId = setTimeout(sendMessageToParent, 1000);

    return () => clearTimeout(timeoutId);
  }, [service, searchParams]);

  // This component doesn't render anything visible
  return null;
};

export default ConnectionMessenger;
