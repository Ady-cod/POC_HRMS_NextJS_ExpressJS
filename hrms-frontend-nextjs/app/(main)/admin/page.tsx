import React from "react";
import Link from "next/link";
import Image from "next/image";
import ScheduleCard from "@/components/ScheduleCard/ScheduleCard";
import DailyQuote from "@/components/DailyQuote/DailyQuote";
import MetricsCards from "@/components/MetricsCards/MetricsCards";
import EmployeeDistributionChart from "@/components/EmployeeDistributionChart/EmployeeDistributionChart";
import EnrollmentChart from "@/components/EnrollmentChart/EnrollmentChart";
import { getAllEmployees } from "@/actions/employee";
import { EmployeeListItem } from "@/types/types";
import ErrorToast from "@/components/ErrorToast/ErrorToast";
import { getOptionalAuth, getUserDisplayName } from "@/utils/auth";
import { headers, cookies } from "next/headers";

const getTimeBasedGreeting = (h: number) =>
  h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";

function greetingForTZ(tz?: string) {
  const hour = tz
    ? Number(
        new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "numeric",
          hourCycle: "h23",
        }).format(new Date())
      )
    : new Date().getHours();
  return getTimeBasedGreeting(hour);
}

export const dynamic = "force-dynamic"; // ensure per-request rendering

const errorGettingEmployeesMessage =
  "We're experiencing technical difficulties. Employee statistics and charts may not display correctly. Please refresh the page or try again later.";

const errorGettingEmployeesTitle = "Unable to load employee data";

const AdminHomePage = async () => {
  const h = headers();
  const tz =
    h.get("x-vercel-ip-timezone") || cookies().get("tz")?.value || undefined;
  
  // console.log("Timezone from headers/cookies:", tz);

  const greeting = greetingForTZ(tz);
  
  // Get the current user information from the JWT token (optional for testing)
  const currentUser = getOptionalAuth();
  const name = getUserDisplayName(currentUser);

  // Conditional URLs for external integrations
  // Trello: Supports email pre-filling via URL parameter
  // Slack: Uses modern workspace signin flow (email pre-filling no longer supported)
  // If no user (testing mode): use general login pages
  const slackUrl = 'https://slack.com/workspace-signin';
  
  const trelloUrl = currentUser && currentUser.email
    ? `https://trello.com/login?email=${encodeURIComponent(currentUser.email)}`
    : 'https://trello.com/login';

  // Fetch employee data once in the server component
  let employees: EmployeeListItem[] = [];
  let employeeDataError: unknown = null;

  try {
    employees = await getAllEmployees();
  } catch (error) {
    console.error("Error fetching employees in AdminHomePage:", error);
    employeeDataError = error;
  }

  return (
    <div className={`p-2 space-y-8 w-full`}>
      {/* Error toast handler */}
      <ErrorToast
        hasError={!!employeeDataError}
        title={errorGettingEmployeesTitle}
        message={errorGettingEmployeesMessage}
      />

      <div className="flex flex-col gap-6 md:flex-row md:justify-between p-6">
        <div className="font-bold text-2xl md:text-4xl lg:text-5xl sm:text-3xl">
          {greeting}, {name}!
        </div>
        <div className="flex gap-3 items-center text-[20px]">
          Connect to
          <Link href={slackUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/slack.png"
              alt="Slack logo"
              width={40}
              height={40}
            />
          </Link>
          <Link href={trelloUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src="/images/trello.png"
              alt="Trello logo"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>

      {/* Centralized error message for employee data */}
      {!!employeeDataError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-800">
              <h3 className="text-lg font-medium">
                Unable to load employee data
              </h3>
              <p className="text-sm mt-1">
                We&apos;re experiencing technical difficulties. Employee
                statistics and charts may not display correctly. Please refresh
                the page or try again later.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[480px] mb-8">
        <div className="lg:col-span-1 min-h-full">
          <ScheduleCard />
        </div>
        <div className="lg:col-span-3 min-h-full">
          <div className="space-y-6 min-h-full flex flex-col">
            <DailyQuote />
            <MetricsCards
              employees={employees}
              hasError={!!employeeDataError}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[480px] mb-8">
        <div className="lg:col-span-1 min-h-full">
          <EmployeeDistributionChart
            employees={employees}
            hasError={!!employeeDataError}
          />
        </div>
        <div className="lg:col-span-2 min-h-full">
          <EnrollmentChart
            employees={employees}
            hasError={!!employeeDataError}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
