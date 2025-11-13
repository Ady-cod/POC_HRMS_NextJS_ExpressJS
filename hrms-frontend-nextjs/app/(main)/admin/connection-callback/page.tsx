"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import ConnectionStatusIndicator from "@/components/ConnectionStatusIndicator/ConnectionStatusIndicator";
import ConnectionMessenger from "@/components/ConnectionMessenger/ConnectionMessenger";

const ConnectionCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connectionState, updateConnectionStatus } = useConnectionStatus();

  console.log("ConnectionCallbackPage: Component loaded");
  console.log("ConnectionCallbackPage: Current URL:", window.location.href);
  console.log(
    "ConnectionCallbackPage: Search params:",
    Object.fromEntries(searchParams.entries())
  );

  useEffect(() => {
    const service = searchParams.get("service") as "slack" | "trello";
    const success = searchParams.get("success") === "true";
    const error = searchParams.get("error");
    const code = searchParams.get("code");
    const connected = searchParams.get("connected") === "true";
    const authorized = searchParams.get("authorized") === "true";

    console.log("Callback page loaded with params:", {
      service,
      success,
      error,
      code,
      connected,
      authorized,
    });

    if (service && (success || error || connected || authorized || code)) {
      if (success || connected || authorized || code) {
        console.log(`Updating ${service} to connected`);
        updateConnectionStatus(service, "connected");

        // Show success message for 3 seconds then redirect
        setTimeout(() => {
          router.push("/admin");
        }, 3000);
      } else {
        console.log(`Updating ${service} to error: ${error}`);
        updateConnectionStatus(service, "error");

        // Show error message for 5 seconds then redirect
        setTimeout(() => {
          router.push("/admin");
        }, 5000);
      }
    } else {
      console.log("Invalid callback parameters, redirecting");
      // Invalid callback, redirect immediately
      router.push("/admin");
    }
  }, [searchParams, updateConnectionStatus, router]);

  const service = searchParams.get("service") as "slack" | "trello";
  const success = searchParams.get("success") === "true";

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Connection Callback
          </h1>
          <p className="text-gray-600 mb-8">Redirecting back to admin...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Messenger component to communicate with parent window */}
      <ConnectionMessenger service={service} />

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <ConnectionStatusIndicator
              service={service}
              status={success ? "connected" : "error"}
              className="mx-auto mb-4"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {success ? "Connection Successful!" : "Connection Failed"}
          </h1>

          <p className="text-gray-600 mb-6">
            {success
              ? `Your ${
                  service.charAt(0).toUpperCase() + service.slice(1)
                } account has been successfully connected.`
              : `We couldn't connect your ${
                  service.charAt(0).toUpperCase() + service.slice(1)
                } account. Please try again.`}
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => router.push("/admin")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Admin
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Redirecting automatically in {success ? "3" : "5"} seconds...
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectionCallbackPage;
