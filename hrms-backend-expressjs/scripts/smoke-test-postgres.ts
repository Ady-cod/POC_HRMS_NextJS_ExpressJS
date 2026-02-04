import "dotenv/config";

type SmokeTest = {
  name: string;
  method: "GET" | "POST";
  path: string;
  body?: unknown;
};

const baseUrl = process.env.SMOKE_TEST_BASE_URL || "http://localhost:5000";
const authToken = process.env.SMOKE_TEST_AUTH_TOKEN;

const tests: SmokeTest[] = [
  { name: "Root health", method: "GET", path: "/" },
  { name: "Employees list", method: "GET", path: "/api/v1/employee" },
  { name: "Departments list", method: "GET", path: "/api/v1/department" },
  { name: "Learning paths list", method: "GET", path: "/api/v1/learningPath" },
];

const runTest = async (test: SmokeTest): Promise<void> => {
  const url = `${baseUrl}${test.path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method: test.method,
    headers,
    body: test.body ? JSON.stringify(test.body) : undefined,
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(
      `${test.name} failed (${response.status}): ${bodyText.slice(0, 300)}`
    );
  }

  console.log(`${test.name}: OK (${response.status})`);
};

const run = async (): Promise<void> => {
  console.log(`Running smoke tests against ${baseUrl}`);
  for (const test of tests) {
    await runTest(test);
  }
  console.log("Smoke tests completed.");
};

run().catch((error) => {
  console.error("Smoke tests failed:", error);
  process.exit(1);
});
