"use client";

import React from "react";
import ConnectionStatusIndicator from "@/components/ConnectionStatusIndicator/ConnectionStatusIndicator";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

interface ConnectionStatusSectionProps {
  slackUrl: string;
  trelloUrl: string;
  showLabels?: boolean;
  className?: string;
  usePopup?: boolean;
  userId?: string | null;
  scope?: string;
}

const ConnectionStatusSection: React.FC<ConnectionStatusSectionProps> = ({
  slackUrl,
  trelloUrl,
  showLabels = false,
  className = "",
  usePopup = true,
  userId = null,
  scope = "default",
}) => {
  const { connectionState, isLoading, connectService, connectServiceViaPopup } =
    useConnectionStatus({ userId, scope });

  const handleConnectionClick = async (service: "slack" | "trello") => {
    const currentStatus = connectionState[service];

    if (currentStatus === "disconnected" || currentStatus === "error") {
      if (usePopup) {
        // Use popup flow for better UX
        // Note: External services may not use callback parameters, so we'll use URL monitoring instead
        const baseUrl = service === "slack" ? slackUrl : trelloUrl;

        try {
          await connectServiceViaPopup(service, baseUrl);
        } catch (error) {
          console.error(
            `❌ Error during popup connection for ${service}:`,
            error
          );
        }
      } else {
        // Fallback to regular connection process
        connectService(service);
      }
    } else if (currentStatus === "connected") {
      // Open the service in a new tab
      window.open(
        service === "slack" ? slackUrl : trelloUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  if (isLoading) {
    return (
      <div className={`flex gap-5 items-center ${className}`}>
        <span className="text-[20px] mr-2">Connect to</span>
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-5 items-center ${className}`}>
      <span className="text-[20px] mr-2">Connect to</span>
      <div className="flex gap-4">
        <ConnectionStatusIndicator
          service="slack"
          status={connectionState.slack}
          href={slackUrl}
          onClick={() => handleConnectionClick("slack")}
          showLabel={showLabels}
        />
        <ConnectionStatusIndicator
          service="trello"
          status={connectionState.trello}
          href={trelloUrl}
          onClick={() => handleConnectionClick("trello")}
          showLabel={showLabels}
        />
      </div>
    </div>
  );
};

export default ConnectionStatusSection;
