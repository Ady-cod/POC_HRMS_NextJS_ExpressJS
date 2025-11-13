"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import "./ConnectionStatusIndicator.css";

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "loading"
  | "error"
  | "detecting";

interface ConnectionStatusIndicatorProps {
  service: "slack" | "trello";
  status: ConnectionStatus;
  href?: string;
  onClick?: () => void;
  className?: string;
  showLabel?: boolean;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  service,
  status,
  href,
  onClick,
  className,
  showLabel = false,
}) => {
  const getIconPath = () => {
    return `/images/${service}.png`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg
              className="w-2 h-2 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "disconnected":
        return (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg
              className="w-2 h-2 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "loading":
        return (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
          </div>
        );
      case "detecting":
        return (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
          </div>
        );
      case "error":
        return (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg
              className="w-2 h-2 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "border-green-500 bg-green-50 hover:bg-green-100";
      case "disconnected":
        return "border-red-500 bg-red-50 hover:bg-red-100";
      case "loading":
        return "border-yellow-500 bg-yellow-50 hover:bg-yellow-100";
      case "detecting":
        return "border-blue-500 bg-blue-50 hover:bg-blue-100";
      case "error":
        return "border-orange-500 bg-orange-50 hover:bg-orange-100";
      default:
        return "border-gray-300 bg-gray-50 hover:bg-gray-100";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "connected":
        return "Connected";
      case "disconnected":
        return "Not Connected";
      case "loading":
        return "Connecting...";
      case "detecting":
        return "Detecting...";
      case "error":
        return "Connection Error";
      default:
        return "";
    }
  };

  const content = (
    <div
      className={cn(
        "connection-indicator relative inline-flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-sm hover:shadow-md",
        getStatusColor(),
        className
      )}
      onClick={onClick}
    >
      <Image
        src={getIconPath()}
        alt={`${service} logo`}
        width={32}
        height={32}
        className="rounded transition-transform duration-200 hover:scale-110"
      />
      {getStatusIcon()}

      {/* Pulse animation for loading state */}
      {status === "loading" && (
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-500 animate-pulse opacity-75" />
      )}

      {/* Shake animation for error state */}
      {status === "error" && (
        <div className="absolute inset-0 rounded-lg border-2 border-orange-500 animate-shake" />
      )}

      {/* Success pulse for connected state */}
      {status === "connected" && (
        <div className="absolute inset-0 rounded-lg border-2 border-green-500 animate-pulse-slow opacity-30" />
      )}
    </div>
  );

  if (href && status !== "loading") {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <div className="inline-block">
          {content}
          {showLabel && (
            <div className="text-center mt-1 text-sm font-medium">
              {getStatusLabel()}
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <>
      {content}
      {showLabel && (
        <div className="text-center mt-1 text-sm font-medium">
          {getStatusLabel()}
        </div>
      )}
    </>
  );
};

export default ConnectionStatusIndicator;
