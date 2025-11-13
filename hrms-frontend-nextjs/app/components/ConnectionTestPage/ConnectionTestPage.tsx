"use client";

import React, { useState } from "react";
import ConnectionStatusIndicator from "@/components/ConnectionStatusIndicator/ConnectionStatusIndicator";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

const ConnectionTestPage: React.FC = () => {
  const {
    connectionState,
    connectServiceViaPopup,
    popupWindow,
    manuallyMarkConnected,
    resetAllConnections,
  } = useConnectionStatus();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testPopupConnection = async (service: "slack" | "trello") => {
    addTestResult(`Testing ${service} popup connection...`);

    // Create a test URL that simulates the real OAuth callback
    const testUrl = `/admin/connection-callback?service=${service}&success=true&code=test_auth_code_123`;

    try {
      addTestResult(`Opening popup with URL: ${testUrl}`);
      await connectServiceViaPopup(service, testUrl);
      addTestResult(`${service} popup test completed`);
    } catch (error) {
      addTestResult(`Error testing ${service}: ${error}`);
    }
  };

  const testRealOAuthFlow = async (service: "slack" | "trello") => {
    addTestResult(`Testing ${service} real OAuth flow simulation...`);

    // Simulate what happens in a real OAuth flow:
    // 1. User clicks connect
    // 2. Popup opens with external service
    // 3. User authenticates
    // 4. Service redirects to our callback with success parameters
    // 5. Callback page sends message to parent

    const callbackUrl = `${window.location.origin}/admin/connection-callback?service=${service}&success=true&code=real_oauth_code_456`;
    addTestResult(`Simulating redirect to: ${callbackUrl}`);

    // Simulate the redirect by opening our callback page in a popup
    const popup = window.open(
      callbackUrl,
      "test-oauth-popup",
      "width=600,height=700"
    );

    if (popup) {
      addTestResult(
        "Popup opened successfully, waiting for callback page to load..."
      );

      // The callback page should automatically send a message when it loads with success=true
      // But let's also simulate the message sending manually for testing
      setTimeout(() => {
        if (!popup.closed) {
          addTestResult("Manually triggering success message...");
          window.postMessage(
            {
              type: "CONNECTION_SUCCESS",
              service: service,
              code: "test_code_789",
            },
            "*"
          );
        }
      }, 2000);
    } else {
      addTestResult("Failed to open popup - might be blocked by browser");
    }
  };

  const testDirectMessage = (service: "slack" | "trello") => {
    addTestResult(`Sending direct success message for ${service}...`);

    // Simulate receiving a message
    window.postMessage(
      {
        type: "CONNECTION_SUCCESS",
        service: service,
      },
      "*"
    );

    addTestResult(`Direct message sent for ${service}`);
  };

  const testMessengerIntegration = () => {
    addTestResult("Testing messenger integration...");

    // Simulate what happens when the callback page loads
    const mockEvent = new MessageEvent("message", {
      data: {
        type: "CONNECTION_SUCCESS",
        service: "slack",
      },
      origin: window.location.origin,
    });

    window.dispatchEvent(mockEvent);
    addTestResult("Messenger integration test completed");
  };

  const testCallbackPageDirectly = (service: "slack" | "trello") => {
    addTestResult(`Testing callback page directly for ${service}...`);

    const callbackUrl = `${window.location.origin}/admin/connection-callback?service=${service}&success=true&code=test_callback_123`;
    addTestResult(`Opening callback URL: ${callbackUrl}`);

    const popup = window.open(
      callbackUrl,
      "callback-test",
      "width=600,height=700"
    );

    if (popup) {
      addTestResult(
        "Callback page opened in popup, should automatically send success message"
      );

      // Also manually trigger the success message after a delay
      setTimeout(() => {
        addTestResult("Manually sending success message from test page...");
        window.postMessage(
          {
            type: "CONNECTION_SUCCESS",
            service: service,
            code: "manual_test_123",
          },
          "*"
        );
      }, 3000);
    } else {
      addTestResult("Failed to open callback page - popup might be blocked");
    }
  };

  const forceConnectionSuccess = (service: "slack" | "trello") => {
    addTestResult(`Forcing connection success for ${service}...`);

    // Directly update the connection status without going through the normal flow
    // This is useful if the automatic detection isn't working
    window.postMessage(
      {
        type: "CONNECTION_SUCCESS",
        service: service,
        force: true,
      },
      "*"
    );

    addTestResult(`Forced success message sent for ${service}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Connection System Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connection Status</h2>

          <div className="flex gap-4">
            <ConnectionStatusIndicator
              service="slack"
              status={connectionState.slack}
            />
            <ConnectionStatusIndicator
              service="trello"
              status={connectionState.trello}
            />
          </div>

          <div className="text-sm text-gray-600">
            <p>Slack: {connectionState.slack}</p>
            <p>Trello: {connectionState.trello}</p>
            <p>Popup Open: {popupWindow ? "Yes" : "No"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Controls</h2>

          <div className="space-y-2">
            <button
              onClick={() => testPopupConnection("slack")}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Slack Popup
            </button>

            <button
              onClick={() => testPopupConnection("trello")}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Trello Popup
            </button>

            <button
              onClick={() => testDirectMessage("slack")}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Direct Slack Success
            </button>

            <button
              onClick={() => testDirectMessage("trello")}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Direct Trello Success
            </button>

            <button
              onClick={() => testRealOAuthFlow("slack")}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Test Real OAuth Flow (Slack)
            </button>

            <button
              onClick={() => testRealOAuthFlow("trello")}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Test Real OAuth Flow (Trello)
            </button>

            <button
              onClick={() => testCallbackPageDirectly("slack")}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Test Callback Page (Slack)
            </button>

            <button
              onClick={() => testCallbackPageDirectly("trello")}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Test Callback Page (Trello)
            </button>

            <button
              onClick={() => forceConnectionSuccess("slack")}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Force Slack Success
            </button>

            <button
              onClick={() => forceConnectionSuccess("trello")}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Force Trello Success
            </button>

            <button
              onClick={() => manuallyMarkConnected("slack")}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Manual Slack Success
            </button>

            <button
              onClick={() => manuallyMarkConnected("trello")}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Manual Trello Success
            </button>

            <button
              onClick={resetAllConnections}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Reset All Connections
            </button>

            <button
              onClick={testMessengerIntegration}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Test Messenger
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1 text-sm font-mono">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">
          Debugging Instructions
        </h3>
        <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
          <li>Open browser developer tools (F12)</li>
          <li>Go to the Console tab</li>
          <li>Run the tests above and watch for console messages</li>
          <li>Check if popup windows are opening and sending messages</li>
          <li>
            Verify that the connection status updates when messages are received
          </li>
        </ol>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">
          Real OAuth Flow Simulation
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>What should happen in a real OAuth flow:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>You click &apos;Connect to Trello&apos; on the admin page</li>
            <li>A popup opens with Trello login page</li>
            <li>You complete authentication with Trello</li>
            <li>Our system detects completion using multiple methods</li>
            <li>Green checkmark appears (30-60 seconds typically)</li>
          </ol>

          <p>
            <strong>Multiple Detection Methods (in order of priority):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>🎯 Duration-based:</strong> If popup stays open 45+
              seconds, assume success
            </li>
            <li>
              <strong>🔗 URL-based:</strong> Detect OAuth completion patterns in
              URL (code=, token=, /authorize, /oauth)
            </li>
            <li>
              <strong>📋 Title-based:</strong> Look for success keywords in
              popup title (success, connected, authorized, welcome, dashboard)
            </li>
            <li>
              <strong>🚪 Closure-based:</strong> If popup closes after 15+
              seconds, assume success
            </li>
            <li>
              <strong>⏰ Fallback timeout:</strong> Force success after 60
              seconds
            </li>
          </ul>

          <p>
            <strong>Expected Console Output:</strong>
          </p>
          <div className="bg-gray-100 p-2 rounded text-xs font-mono">
            🎯 DURATION DETECTION: Popup for trello has been open for 45+
            seconds
            <br />✅ SUCCESS: Popup for trello closed after 47 seconds - marking
            as connected
          </div>

          <p>
            <strong>If auto-detection fails:</strong>
          </p>
          <ul className="list-disc list-inside">
            <li>Use &apos;Manual Success&apos; buttons (immediate)</li>
            <li>Use &apos;Force Success&apos; buttons (instant)</li>
            <li>Use &apos;Reset All Connections&apos; to clear states</li>
            <li>Check browser console for detailed logs</li>
          </ul>

          <p>
            <strong>Logout Reset:</strong> Connection states automatically reset
            when you log out
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTestPage;
