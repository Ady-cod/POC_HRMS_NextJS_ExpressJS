"use client";

import { useRef, useEffect } from "react";
import { showToast } from "@/utils/toastHelper";

interface ErrorToastProps {
  hasError: boolean;
  title?: string;
  message?: string;
}

const ErrorToast = ({ hasError, title, message }: ErrorToastProps) => {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasError && !hasShown.current) {
      hasShown.current = true;

      // Show the error toast with provided title and message
      // If no title or message is provided, use default values
      const defaultMessage = 
        "We're experiencing technical difficulties. Please refresh the page or try again later.";
      const defaultTitle =
        "Unable to perform the required task";

      showToast("error", title || defaultTitle, [message || defaultMessage]);
    }
  }, [hasError, title, message]);

  // This component doesn't render anything visible
  return null;
};

export default ErrorToast; 