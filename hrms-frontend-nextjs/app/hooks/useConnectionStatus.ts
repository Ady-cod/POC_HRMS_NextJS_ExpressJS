"use client";

import { useState, useEffect } from "react";

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "loading"
  | "error"
  | "detecting";

interface ConnectionState {
  slack: ConnectionStatus;
  trello: ConnectionStatus;
}

// For now, we'll use localStorage to persist connection states
// In a real application, this would come from an API or user settings
const STORAGE_KEY = "hrms_connection_status";

const defaultState: ConnectionState = {
  slack: "disconnected",
  trello: "disconnected",
};

export const useConnectionStatus = () => {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  // Load connection state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        setConnectionState({ ...defaultState, ...parsedState });
      }
    } catch (error) {
      console.warn(
        "Failed to load connection status from localStorage:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save connection state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(connectionState));
      } catch (error) {
        console.warn(
          "Failed to save connection status to localStorage:",
          error
        );
      }
    }
  }, [connectionState, isLoading]);

  const updateConnectionStatus = (
    service: "slack" | "trello",
    status: ConnectionStatus
  ) => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: status,
    }));
  };

  const connectService = async (service: "slack" | "trello") => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: "loading",
    }));

    try {
      // Simulate connection process
      // In a real app, this would make an API call to establish connection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demonstration, we'll randomly succeed or fail
      const success = Math.random() > 0.3; // 70% success rate

      if (success) {
        setConnectionState((prev) => ({
          ...prev,
          [service]: "connected",
        }));
      } else {
        setConnectionState((prev) => ({
          ...prev,
          [service]: "error",
        }));
      }
    } catch (error) {
      console.error(error);
      setConnectionState((prev) => ({
        ...prev,
        [service]: "error",
      }));
    }
  };

  const disconnectService = (service: "slack" | "trello") => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: "disconnected",
    }));
  };

  const resetConnectionError = (service: "slack" | "trello") => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: "disconnected",
    }));
  };

  // Handle popup connection flow
  const connectServiceViaPopup = async (
    service: "slack" | "trello",
    url: string
  ) => {
    console.log(`🔄 Setting ${service} state to detecting...`);
    setConnectionState((prev) => {
      console.log(
        `🔄 State change for ${service}: ${prev[service]} -> detecting`
      );
      return {
        ...prev,
        [service]: "detecting",
      };
    });

    // Open popup window
    const popup = window.open(
      url,
      `${service}-connection`,
      "width=600,height=700,scrollbars=yes,resizable=yes"
    );

    if (!popup) {
      console.log(`❌ Popup blocked for ${service}, setting to error`);
      // Popup blocked, fallback to error state
      setConnectionState((prev) => ({
        ...prev,
        [service]: "error",
      }));
      return;
    }

    console.log(`✅ Popup opened successfully for ${service}`);
    setPopupWindow(popup);

    // Listen for messages from popup
    const messageHandler = (event: MessageEvent) => {
      console.log(
        "Received message in parent:",
        event.data,
        "from origin:",
        event.origin
      );

      // Handle explicit success/failure messages from our messenger
      if (event.data && event.data.type === "CONNECTION_SUCCESS") {
        const { service: connectedService } = event.data;
        if (connectedService === service) {
          console.log(`Connection success detected for ${service}`);
          handleConnectionSuccess(service, popup, messageHandler);
        }
      } else if (event.data && event.data.type === "CONNECTION_FAILURE") {
        const { service: failedService } = event.data;
        if (failedService === service) {
          console.log(`Connection failure detected for ${service}`);
          handleConnectionFailure(service, popup, messageHandler);
        }
      } else if (event.data && typeof event.data === "string") {
        // Handle simple string messages for debugging
        console.log("String message received:", event.data);
      }
    };

    window.addEventListener("message", messageHandler);

    // Fallback: check if popup is closed without message
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        console.log(`🚪 Popup for ${service} closed, cleaning up...`);
        setPopupWindow(null);
        window.removeEventListener("message", messageHandler);
        clearInterval(checkClosed);

        // Note: The main polling logic will handle success/error detection when popup closes
        console.log(`🚪 Cleanup completed for ${service} popup closure`);
      }
    }, 1000);

    // Polling mechanism as additional fallback
    startPollingForConnection(service, popup, messageHandler, checkClosed);
  };

  const handleConnectionSuccess = (
    service: "slack" | "trello",
    popup: Window,
    messageHandler: (event: MessageEvent) => void
  ) => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: "connected",
    }));
    popup.close();
    setPopupWindow(null);
    window.removeEventListener("message", messageHandler);
  };

  const handleConnectionFailure = (
    service: "slack" | "trello",
    popup: Window,
    messageHandler: (event: MessageEvent) => void
  ) => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: "error",
    }));
    popup.close();
    setPopupWindow(null);
    window.removeEventListener("message", messageHandler);
  };

  const startPollingForConnection = (
    service: "slack" | "trello",
    popup: Window,
    messageHandler: (event: MessageEvent) => void,
    checkClosed: NodeJS.Timeout
  ) => {
    let pollCount = 0;
    const maxPolls = 60; // 60 seconds max

    const pollInterval = setInterval(() => {
      pollCount++;

      // Check if popup is still open and loading
      if (!popup.closed) {
        console.log(
          `Polling ${service} popup - attempt ${pollCount}/${maxPolls}, popup still open: ${!popup.closed}`
        );

        // Try to detect user interaction (focus/blur events suggest user is interacting)
        try {
          if (
            popup.document &&
            popup.document.hasFocus &&
            popup.document.hasFocus()
          ) {
            console.log(
              `User interaction detected for ${service} popup - likely completing OAuth`
            );
          }
        } catch {
          // Cross-origin, expected
        }

        // Check if popup title has changed (indicates navigation)
        try {
          const currentTitle = popup.document?.title || "";
          if (currentTitle) {
            console.log(`Popup title for ${service}: "${currentTitle}"`);

            // Check for success indicators in title
            if (
              currentTitle.toLowerCase().includes("success") ||
              currentTitle.toLowerCase().includes("connected") ||
              currentTitle.toLowerCase().includes("authorized")
            ) {
              console.log(`Detected success in popup title for ${service}`);
              handleConnectionSuccess(service, popup, messageHandler);
              clearInterval(pollInterval);
              clearInterval(checkClosed);
              return;
            }
          }
        } catch {
          // Cross-origin, expected
        }

        // Multiple detection methods for OAuth completion

        // Method 1: Duration-based (if popup stays open 45+ seconds, assume success)
        if (pollCount >= 45) {
          console.log(
            `🎯 DURATION DETECTION: Popup for ${service} has been open for 45+ seconds - likely OAuth completed`
          );

          // Assume success and close popup
          handleConnectionSuccess(service, popup, messageHandler);
          clearInterval(pollInterval);
          clearInterval(checkClosed);
          return;
        }

        // Method 2: Check for OAuth completion patterns in URL (if accessible)
        // Note: This might fail due to cross-origin, but worth trying
        try {
          if (popup.location && popup.location.href) {
            const currentUrl = popup.location.href;
            console.log(`Popup URL for ${service}: ${currentUrl}`);

            // Check for OAuth completion indicators
            if (
              currentUrl.includes("/authorize") ||
              currentUrl.includes("/oauth") ||
              currentUrl.includes("code=") ||
              currentUrl.includes("token=")
            ) {
              console.log(
                `🔗 URL DETECTION: OAuth completion detected in URL for ${service}`
              );
              handleConnectionSuccess(service, popup, messageHandler);
              clearInterval(pollInterval);
              clearInterval(checkClosed);
              return;
            }
          }
        } catch {
          // Cross-origin error expected, continue with other methods
        }

        // Method 3: Title-based detection (check if title indicates completion)
        try {
          const title = popup.document?.title || "";
          if (
            title &&
            (title.toLowerCase().includes("success") ||
              title.toLowerCase().includes("connected") ||
              title.toLowerCase().includes("authorized") ||
              title.toLowerCase().includes("welcome") ||
              title.toLowerCase().includes("dashboard"))
          ) {
            console.log(
              `📋 TITLE DETECTION: Success detected in title "${title}" for ${service}`
            );
            handleConnectionSuccess(service, popup, messageHandler);
            clearInterval(pollInterval);
            clearInterval(checkClosed);
            return;
          }
        } catch {
          // Cross-origin error expected
        }

        // If popup is still open after 30 seconds, it's likely waiting for user interaction
        if (pollCount === 30) {
          console.log(
            `Popup for ${service} is still open after 30 seconds - user may be completing OAuth flow`
          );
        }
      }

      // Stop polling if max attempts reached or popup closed
      if (pollCount >= maxPolls || popup.closed) {
        console.log(
          `Stopping polling for ${service} after ${pollCount} attempts, popup closed: ${popup.closed}`
        );

        if (popup.closed) {
          clearInterval(pollInterval);
          clearInterval(checkClosed);

          // Popup closed - immediately check if it was due to successful OAuth completion
          console.log(
            `🚪 POPUP CLOSED: Popup for ${service} closed after ${pollCount} seconds - analyzing...`
          );

          // Check immediately without setTimeout to avoid race conditions
          const currentState = connectionState[service];
          console.log(`Current state when popup closed: ${currentState}`);

          if (currentState === "loading" || currentState === "detecting") {
            // If popup was open for more than 10 seconds, likely OAuth was completed
            if (pollCount >= 10) {
              console.log(
                `✅ SUCCESS: Popup for ${service} closed after ${pollCount} seconds with ${currentState} state - marking as connected`
              );
              setConnectionState((prev) => ({
                ...prev,
                [service]: "connected",
              }));
            } else {
              console.log(
                `❌ CANCELLED: Popup for ${service} closed after ${pollCount} seconds - likely cancelled by user, resetting to disconnected`
              );
              setConnectionState((prev) => ({
                ...prev,
                [service]: "disconnected",
              }));
            }
          } else {
            console.log(
              `ℹ️ STATE ALREADY SET: Popup for ${service} closed but state was already: ${currentState} (no change needed)`
            );
          }
        } else {
          // Max polls reached, popup still open
          console.log(
            `⏰ MAX POLLS REACHED: Popup for ${service} still open after ${maxPolls} attempts`
          );

          clearInterval(pollInterval);
          clearInterval(checkClosed);

          // Force success if still loading or detecting after timeout
          setTimeout(() => {
            setConnectionState((prev) => {
              if (
                prev[service] === "loading" ||
                prev[service] === "detecting"
              ) {
                console.log(
                  `⏰ FORCE SUCCESS: Popup for ${service} still open after ${maxPolls} seconds - forcing success due to timeout`
                );
                return {
                  ...prev,
                  [service]: "connected",
                };
              }
              console.log(
                `⏰ NO ACTION NEEDED: Popup for ${service} reached timeout but state was already: ${prev[service]}`
              );
              return prev;
            });
          }, 500);
        }
      }
    }, 1000);
  };

  // Check URL parameters for connection success (for callback flow)
  const checkUrlForConnectionStatus = () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("connected")) {
      const service = urlParams.get("service") as "slack" | "trello";
      if (service && ["slack", "trello"].includes(service)) {
        setConnectionState((prev) => ({
          ...prev,
          [service]: "connected",
        }));

        // Clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    } else if (urlParams.has("connection_error")) {
      const service = urlParams.get("service") as "slack" | "trello";
      if (service && ["slack", "trello"].includes(service)) {
        setConnectionState((prev) => ({
          ...prev,
          [service]: "error",
        }));

        // Clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  };

  // Initialize URL check on mount
  useEffect(() => {
    checkUrlForConnectionStatus();
  }, []);

  // Manual success detection for cases where automatic detection fails
  const manuallyMarkConnected = (service: "slack" | "trello") => {
    console.log(`Manually marking ${service} as connected`);
    setConnectionState((prev) => ({
      ...prev,
      [service]: "connected",
    }));
  };

  // Reset all connection states (useful for logout)
  const resetAllConnections = () => {
    console.log("🔄 Resetting all connection states to disconnected");
    setConnectionState({
      slack: "disconnected",
      trello: "disconnected",
    });
    // Also clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    connectionState,
    isLoading,
    updateConnectionStatus,
    connectService,
    disconnectService,
    resetConnectionError,
    connectServiceViaPopup,
    popupWindow,
    manuallyMarkConnected,
    resetAllConnections,
  };
};
