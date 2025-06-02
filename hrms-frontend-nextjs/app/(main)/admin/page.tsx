import React from "react";
import Link from "next/link";
import Image from "next/image";
import ScheduleCard from "@/components/ScheduleCard/ScheduleCard";
import StatsCard from "@/components/StatCard/StatisticsCard";
import EmployeeOverview from "@/components/EmployeeOverviewCard/EmployeeOverview";
import EnrollmentChart from "@/components/EnrollmentStatistics/EnrollmentChart";

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const AdminHomePage = () => {
  const greeting = getTimeBasedGreeting();
  const name = "Sabrina White";

  return (
    <div className="p-2 space-y-8 max-w-7xl">
      <div className="flex flex-col gap-6 md:flex-row md:justify-between p-6 border border-red-500">
        <div className="font-bold text-2xl md:text-4xl lg:text-5xl sm:text-3xl">
          {greeting}, {name}!
        </div>
        <div className="flex gap-3 items-center text-[20px]">
          Connect to
          <Link href="#">
            <Image
              src="/images/slack.png"
              alt="Slack logo"
              width={40}
              height={40}
            />
          </Link>
          <Link href="#">
            <Image
              src="/images/trello.png"
              alt="Trello logo"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[480px] mb-8">
        <div className="lg:col-span-1 min-h-full">
          <ScheduleCard />
        </div>
        <div className="lg:col-span-3 min-h-full">
          <StatsCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[480px] mb-8">
        <div className="lg:col-span-1 min-h-full">
          <EmployeeOverview />
        </div>
        <div className="lg:col-span-2 min-h-full">
          <EnrollmentChart />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
