"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

type Service = "slack" | "trello";

const defaultState: ConnectionState = {
  slack: "disconnected",
  trello: "disconnected",
};

const STORAGE_PREFIX = "hrms_connection_status_v2";

interface UseConnectionStatusOptions {
  userId?: string | null;
  scope?: string;
}

const isWindowAvailable = () => typeof window !== "undefined";

export const useConnectionStatus = (
  options: UseConnectionStatusOptions = {}
) => {
  const userId = options.userId ?? null;
  const scope = options.scope ?? "default";
  const normalizedScope = encodeURIComponent(scope);
  const normalizedUserId = userId ? encodeURIComponent(userId) : "";
  const storageKey = userId
    ? `${STORAGE_PREFIX}:user:${normalizedScope}:${normalizedUserId}`
    : `${STORAGE_PREFIX}:guest:${normalizedScope}`;
  const isPersistentUser = Boolean(userId);

  const getStorage = useCallback(() => {
    if (!isWindowAvailable()) {
      return null;
    }

    try {
      return isPersistentUser ? window.localStorage : window.sessionStorage;
    } catch (error) {
      console.warn("ConnectionStatus: Unable to access storage:", error);
      return null;
    }
  }, [isPersistentUser]);

  const readStoredState = useCallback((): ConnectionState | null => {
    if (!isWindowAvailable()) {
      return null;
    }

    const storage = getStorage();
    if (!storage) {
      return null;
    }

    try {
      const raw = storage.getItem(storageKey);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<ConnectionState>;
      return {
        ...defaultState,
        ...parsed,
      };
    } catch (error) {
      console.warn("ConnectionStatus: Failed to parse stored state:", error);
      return null;
    }
  }, [getStorage, storageKey]);

  const [connectionState, setConnectionState] = useState<ConnectionState>(
    () => {
      const stored = readStoredState();
      return stored ?? defaultState;
    }
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const clearStoredState = useCallback(() => {
    const storage = getStorage();
    if (!storage) {
      return;
    }

    try {
      storage.removeItem(storageKey);
    } catch (error) {
      console.warn("ConnectionStatus: Failed to clear stored state:", error);
    }
  }, [getStorage, storageKey]);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);
  const connectionStateRef = useRef(connectionState);
  const pendingDetectionRef = useRef<Record<Service, boolean>>({
    slack: false,
    trello: false,
  });
  const detectionTimeoutRef = useRef<
    Record<Service, ReturnType<typeof setTimeout> | null>
  >({
    slack: null,
    trello: null,
  });
  const lastTriggeredServiceRef = useRef<Service | null>(null);

  const log = (..._unused: unknown[]) => {
    void _unused;
    // Debug logging disabled. Uncomment for verbose diagnostics.
    // console.log("[ConnectionStatus]", ..._unused);
  };

  useEffect(() => {
    connectionStateRef.current = connectionState;
  }, [connectionState]);

  useEffect(() => {
    const stored = readStoredState();
    if (stored) {
      setConnectionState((prev) => {
        if (prev.slack === stored.slack && prev.trello === stored.trello) {
          return prev;
        }
        return stored;
      });
    } else {
      setConnectionState(defaultState);
    }
    setIsInitialized(true);
  }, [readStoredState]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) {
      return;
    }

    try {
      const isDefaultState =
        connectionState.slack === "disconnected" &&
        connectionState.trello === "disconnected";

      if (isDefaultState) {
        storage.removeItem(storageKey);
      } else {
        storage.setItem(storageKey, JSON.stringify(connectionState));
      }
    } catch (error) {
      console.warn("ConnectionStatus: Failed to persist state:", error);
    }
  }, [connectionState, getStorage, storageKey]);

  const isLoading = !isInitialized;

  const markServiceDetecting = useCallback((service: Service) => {
    log("markServiceDetecting:start", { service });
    pendingDetectionRef.current[service] = true;
    lastTriggeredServiceRef.current = service;

    // Clear any existing timeout before scheduling a new one
    const existingTimeout = detectionTimeoutRef.current[service];
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      log("markServiceDetecting:clearedExistingTimeout", { service });
    }

    detectionTimeoutRef.current[service] = setTimeout(() => {
      log("markServiceDetecting:timeoutTriggered", { service });
      setConnectionState((prev) => {
        if (prev[service] !== "detecting") {
          log("markServiceDetecting:timeoutIgnored", {
            service,
            state: prev[service],
          });
          return prev;
        }

        pendingDetectionRef.current[service] = false;
        detectionTimeoutRef.current[service] = null;
        if (lastTriggeredServiceRef.current === service) {
          lastTriggeredServiceRef.current = null;
        }

        log("markServiceDetecting:timeoutMarkConnected", { service });
        return {
          ...prev,
          [service]: "connected",
        };
      });
    }, 4000);
    log("markServiceDetecting:timeoutScheduled", { service });
  }, []);

  const clearServiceDetecting = useCallback((service: Service) => {
    log("clearServiceDetecting", { service });
    pendingDetectionRef.current[service] = false;
    const existingTimeout = detectionTimeoutRef.current[service];
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      log("clearServiceDetecting:clearedTimeout", { service });
      detectionTimeoutRef.current[service] = null;
    }
    if (lastTriggeredServiceRef.current === service) {
      lastTriggeredServiceRef.current = null;
    }
  }, []);

  type CompleteReason =
    | "focus"
    | "visibility"
    | "pageshow"
    | "manual"
    | "initial";

  const completePendingConnections = useCallback((reason: CompleteReason) => {
    log("completePendingConnections:invoked", {
      reason,
      pending: { ...pendingDetectionRef.current },
      visibility: document.visibilityState,
    });
    setConnectionState((prev) => {
      let updated = false;
      const nextState: ConnectionState = { ...prev };

      (["slack", "trello"] as Service[]).forEach((service) => {
        if (prev[service] === "detecting") {
          const shouldComplete =
            pendingDetectionRef.current[service] ||
            lastTriggeredServiceRef.current === service;
          if (shouldComplete) {
            pendingDetectionRef.current[service] = false;
            const existingTimeout = detectionTimeoutRef.current[service];
            if (existingTimeout) {
              clearTimeout(existingTimeout);
              log("completePendingConnections:clearedTimeout", {
                service,
                reason,
              });
              detectionTimeoutRef.current[service] = null;
            }
            nextState[service] = "connected";
            updated = true;
            lastTriggeredServiceRef.current = null;
            log("completePendingConnections:markedConnected", {
              service,
              reason,
            });
          } else {
            log("completePendingConnections:skipped", {
              service,
              reason,
              pending: pendingDetectionRef.current[service],
              lastTriggered: lastTriggeredServiceRef.current,
            });
          }
        }
      });

      return updated ? nextState : prev;
    });
  }, []);

  useEffect(() => {
    log("connectionState:update", connectionState);
  }, [connectionState]);

  useEffect(() => {
    const handleFocus = () => {
      log("window:focus");
      completePendingConnections("focus");
    };

    const handleVisibilityChange = () => {
      log("document:visibilitychange", {
        visibility: document.visibilityState,
      });
      if (document.visibilityState === "visible") {
        completePendingConnections("visibility");
      }
    };

    const handlePageShow = () => {
      log("window:pageshow");
      completePendingConnections("pageshow");
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [completePendingConnections]);

  useEffect(() => {
    (["slack", "trello"] as Service[]).forEach((service) => {
      if (
        connectionState[service] === "detecting" &&
        !pendingDetectionRef.current[service]
      ) {
        log("initialDetectingState:detected", { service });
        markServiceDetecting(service);
        completePendingConnections("initial");
      }
    });
  }, [connectionState, markServiceDetecting, completePendingConnections]);

  const updateConnectionStatus = (
    service: Service,
    status: ConnectionStatus
  ) => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: status,
    }));
    if (status === "detecting") {
      markServiceDetecting(service);
    } else {
      clearServiceDetecting(service);
    }
  };

  const connectService = async (service: Service) => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: "loading",
    }));
    clearServiceDetecting(service);

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
        clearServiceDetecting(service);
      } else {
        setConnectionState((prev) => ({
          ...prev,
          [service]: "error",
        }));
        clearServiceDetecting(service);
      }
    } catch (error) {
      console.error(error);
      setConnectionState((prev) => ({
        ...prev,
        [service]: "error",
      }));
      clearServiceDetecting(service);
    }
  };

  const disconnectService = (service: Service) => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: "disconnected",
    }));
    clearServiceDetecting(service);
  };

  const resetConnectionError = (service: Service) => {
    setConnectionState((prev) => ({
      ...prev,
      [service]: "disconnected",
    }));
    clearServiceDetecting(service);
  };

  // Handle popup connection flow
  const connectServiceViaPopup = async (service: Service, url: string) => {
    log("connectServiceViaPopup:start", { service, url });
    setConnectionState((prev) => {
      log("connectServiceViaPopup:setDetecting", {
        service,
        previous: prev[service],
      });
      return {
        ...prev,
        [service]: "detecting",
      };
    });
    markServiceDetecting(service);

    // Open popup window
    const popup = window.open(
      url,
      `${service}-connection`,
      "width=600,height=700,scrollbars=yes,resizable=yes"
    );

    if (!popup) {
      log("connectServiceViaPopup:popupBlocked", { service });
      // Popup blocked, fallback to error state
      setConnectionState((prev) => {
        clearServiceDetecting(service);
        return {
          ...prev,
          [service]: "error",
        };
      });
      return;
    }

    log("connectServiceViaPopup:popupOpened", { service });
    setPopupWindow(popup);

    // Listen for messages from popup
    const messageHandler = (event: MessageEvent) => {
      log("connectServiceViaPopup:messageReceived", {
        service,
        data: event.data,
        origin: event.origin,
      });

      // Handle explicit success/failure messages from our messenger
      if (event.data && event.data.type === "CONNECTION_SUCCESS") {
        const { service: connectedService } = event.data;
        if (connectedService === service) {
          log("connectServiceViaPopup:messageSuccess", { service });
          handleConnectionSuccess(service, popup, messageHandler);
        }
      } else if (event.data && event.data.type === "CONNECTION_FAILURE") {
        const { service: failedService } = event.data;
        if (failedService === service) {
          log("connectServiceViaPopup:messageFailure", { service });
          handleConnectionFailure(service, popup, messageHandler);
        }
      } else if (event.data && typeof event.data === "string") {
        // Handle simple string messages for debugging
        log("connectServiceViaPopup:messageString", {
          service,
          data: event.data,
        });
      }
    };

    window.addEventListener("message", messageHandler);

    // Fallback: check if popup is closed without message
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        log("connectServiceViaPopup:popupClosedDetected", { service });
        setPopupWindow(null);
        window.removeEventListener("message", messageHandler);
        clearInterval(checkClosed);

        // Note: The main polling logic will handle success/error detection when popup closes
        log("connectServiceViaPopup:popupCleanupComplete", { service });
      }
    }, 1000);

    // Polling mechanism as additional fallback
    startPollingForConnection(service, popup, messageHandler, checkClosed);
  };

  const handleConnectionSuccess = (
    service: Service,
    popup: Window,
    messageHandler: (event: MessageEvent) => void
  ) => {
    clearServiceDetecting(service);
    setConnectionState((prev) => ({
      ...prev,
      [service]: "connected",
    }));
    popup.close();
    setPopupWindow(null);
    window.removeEventListener("message", messageHandler);
  };

  const handleConnectionFailure = (
    service: Service,
    popup: Window,
    messageHandler: (event: MessageEvent) => void
  ) => {
    clearServiceDetecting(service);
    setConnectionState((prev) => ({
      ...prev,
      [service]: "error",
    }));
    popup.close();
    setPopupWindow(null);
    window.removeEventListener("message", messageHandler);
  };

  const startPollingForConnection = (
    service: Service,
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
        log("startPollingForConnection:polling", {
          service,
          pollCount,
          maxPolls,
          popupClosed: popup.closed,
        });

        // Try to detect user interaction (focus/blur events suggest user is interacting)
        try {
          if (
            popup.document &&
            popup.document.hasFocus &&
            popup.document.hasFocus()
          ) {
            log("startPollingForConnection:userInteractionDetected", {
              service,
              pollCount,
            });
          }
        } catch {
          // Cross-origin, expected
        }

        // Check if popup title has changed (indicates navigation)
        try {
          const currentTitle = popup.document?.title || "";
          if (currentTitle) {
            log("startPollingForConnection:title", {
              service,
              pollCount,
              title: currentTitle,
            });

            // Check for success indicators in title
            if (
              currentTitle.toLowerCase().includes("success") ||
              currentTitle.toLowerCase().includes("connected") ||
              currentTitle.toLowerCase().includes("authorized")
            ) {
              log("startPollingForConnection:titleSuccess", {
                service,
                title: currentTitle,
              });
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
          log("startPollingForConnection:durationDetection", {
            service,
            pollCount,
          });

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
            log("startPollingForConnection:url", {
              service,
              url: currentUrl,
            });

            // Check for OAuth completion indicators
            if (
              currentUrl.includes("/authorize") ||
              currentUrl.includes("/oauth") ||
              currentUrl.includes("code=") ||
              currentUrl.includes("token=")
            ) {
              log("startPollingForConnection:urlSuccess", {
                service,
                url: currentUrl,
              });
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
            log("startPollingForConnection:titleSuccessFallback", {
              service,
              title,
            });
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
          log("startPollingForConnection:stillOpen30s", {
            service,
            pollCount,
          });
        }
      }

      // Stop polling if max attempts reached or popup closed
      if (pollCount >= maxPolls || popup.closed) {
        log("startPollingForConnection:stopPolling", {
          service,
          pollCount,
          popupClosed: popup.closed,
        });

        if (popup.closed) {
          clearInterval(pollInterval);
          clearInterval(checkClosed);

          // Popup closed - immediately check if it was due to successful OAuth completion
          log("startPollingForConnection:popupClosedAnalyze", {
            service,
            pollCount,
          });

          // Check immediately without setTimeout to avoid race conditions
          const currentState = connectionStateRef.current[service];
          log("startPollingForConnection:stateAtClose", {
            service,
            currentState,
          });

          if (currentState === "loading" || currentState === "detecting") {
            // If popup was open for more than 10 seconds, likely OAuth was completed
            if (pollCount >= 10) {
              log("startPollingForConnection:markConnectedAfterClose", {
                service,
                pollCount,
                currentState,
              });
              setConnectionState((prev) => {
                clearServiceDetecting(service);
                return {
                  ...prev,
                  [service]: "connected",
                };
              });
            } else {
              const shouldAssumeSuccess =
                pendingDetectionRef.current[service] ||
                lastTriggeredServiceRef.current === service;
              if (shouldAssumeSuccess) {
                log("startPollingForConnection:assumeSuccessAfterQuickClose", {
                  service,
                  pollCount,
                  currentState,
                });
                setConnectionState((prev) => {
                  clearServiceDetecting(service);
                  return {
                    ...prev,
                    [service]: "connected",
                  };
                });
              } else {
                log("startPollingForConnection:markDisconnectedAfterClose", {
                  service,
                  pollCount,
                  currentState,
                });
                setConnectionState((prev) => {
                  clearServiceDetecting(service);
                  return {
                    ...prev,
                    [service]: "disconnected",
                  };
                });
              }
            }
          } else {
            log("startPollingForConnection:stateAlreadySet", {
              service,
              currentState,
            });
          }
        } else {
          // Max polls reached, popup still open
          log("startPollingForConnection:maxPollsReached", {
            service,
            pollCount,
          });

          clearInterval(pollInterval);
          clearInterval(checkClosed);

          // Force success if still loading or detecting after timeout
          setTimeout(() => {
            setConnectionState((prev) => {
              if (
                prev[service] === "loading" ||
                prev[service] === "detecting"
              ) {
                log("startPollingForConnection:forceSuccessTimeout", {
                  service,
                  pollCount,
                });
                clearServiceDetecting(service);
                return {
                  ...prev,
                  [service]: "connected",
                };
              }
              log("startPollingForConnection:noActionNeeded", {
                service,
                state: prev[service],
              });
              clearServiceDetecting(service);
              return prev;
            });
          }, 500);
        }
      }
    }, 1000);
  };

  // Initialize URL check on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const service = urlParams.get("service") as Service | null;
    const isValidService = service && ["slack", "trello"].includes(service);

    if (urlParams.has("connected") && isValidService) {
      setConnectionState((prev) => {
        clearServiceDetecting(service as Service);
        return {
          ...prev,
          [service as Service]: "connected",
        };
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.has("connection_error") && isValidService) {
      setConnectionState((prev) => {
        clearServiceDetecting(service as Service);
        return {
          ...prev,
          [service as Service]: "error",
        };
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [clearServiceDetecting]);

  // Manual success detection for cases where automatic detection fails
  const manuallyMarkConnected = (service: Service) => {
    log("manuallyMarkConnected", { service });
    clearServiceDetecting(service);
    setConnectionState((prev) => ({
      ...prev,
      [service]: "connected",
    }));
    if (lastTriggeredServiceRef.current === service) {
      lastTriggeredServiceRef.current = null;
    }
  };

  // Reset all connection states (useful for logout)
  const resetAllConnections = () => {
    log("resetAllConnections");
    setConnectionState({
      slack: "disconnected",
      trello: "disconnected",
    });
    pendingDetectionRef.current = {
      slack: false,
      trello: false,
    };
    lastTriggeredServiceRef.current = null;
    (["slack", "trello"] as Service[]).forEach((service) => {
      const existingTimeout = detectionTimeoutRef.current[service];
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        detectionTimeoutRef.current[service] = null;
      }
    });
    clearStoredState();
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
