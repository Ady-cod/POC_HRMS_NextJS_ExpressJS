"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./Sidebar.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/shadCN/shadCNDialog";

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: (value: boolean) => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SideBarProps) => {
  const [isSmBreakpoint, setIsSmBreakpoint] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Media query for 'sm' breakpoint
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    // Initial state based on the current match
    setIsSmBreakpoint(mediaQuery.matches);

    // Event listener for changes to the media query
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsSmBreakpoint(e.matches);
    };

    // Listen for changes
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleSidebarItemClick = () => {
    if (!isSmBreakpoint) {
      toggleSidebar(false);
    }
  };

  const smallScreenSidebar = () => {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => toggleSidebar(open)}>
        <SheetTrigger></SheetTrigger>
        <SheetContent className="w-fit pt-12" side="left">
          <SheetHeader>
            <SheetTitle>{renderSidebar()}</SheetTitle>
          </SheetHeader>
          {/* Use Radix's SheetDescription to provide a description */}
          <SheetDescription className="sr-only">
            Navigation menu for the admin panel.
          </SheetDescription>
        </SheetContent>
      </Sheet>
    );
  };

  const renderSidebar = () => {
    return (
      <div
        className={`w-fit min-w-52 h-full transition-all duration-75 ease-in-out sm:border-r-2 ${
          isOpen
            ? "translate-x-0 relative opacity-100"
            : " -translate-x-full absolute opacity-0"
        } bg-white sm:bg-gradient-to-b from-gray-200 to-white  sm:p-6  pt-10 sidebar`}
      >
        <ul className="whitespace-nowrap font-semibold sm:text-[15px]  max-sm:items-start  sticky top-28  flex flex-col gap-4 sidebaritems">
          <li>
            <Link
              href="/admin"
              onClick={handleSidebarItemClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === "/admin"
                  ? "bg-blue-200 border-r-4 border-blue-500 text-blue-700 scale-110"
                  : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"
              }`}
            >
              <Image
                src="/images/home.png"
                alt="Home icon"
                className="inline"
                width={40}
                height={40}
              />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/admin/profile"
              onClick={handleSidebarItemClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === "/admin/profile"
                  ? "bg-blue-200 border-r-4 border-blue-500 text-blue-700 scale-110"
                  : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"
              }`}
            >
              <Image
                src="/images/My profile icon.png"
                alt="Profile icon"
                className="inline"
                width={40}
                height={40}
              />
              My Profile
            </Link>
          </li>
          <li>
            <Link
              href="/admin/employee"
              onClick={handleSidebarItemClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === "/admin/employee"
                  ? "bg-blue-200 border-r-4 border-blue-500 text-blue-700 scale-110"
                  : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"
              }`}
            >
              <Image
                src="/images/My learning path icon.png"
                alt="Learning Path icon"
                className="inline"
                width={40}
                height={40}
              />
              Employee
            </Link>
          </li>
          <li>
            <Link
              href="/admin/applicants"
              onClick={handleSidebarItemClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === "/admin/applicants"
                  ? "bg-blue-200 border-r-4 border-blue-500 text-blue-700 scale-110"
                  : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"
              }`}
            >
              <Image
                src="/images/Applicants.png"
                alt="Applicant icon"
                className="inline"
                width={40}
                height={40}
              />
              Applicants
            </Link>
          </li>
          <li>
            <Link
              href="/admin/workflow"
              onClick={handleSidebarItemClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === "/admin/workflow"
                  ? "bg-blue-200 border-r-4 border-blue-500 text-blue-700 scale-110"
                  : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"
              }`}
            >
              <Image
                src="/images/My workflow icon.png"
                alt="Workflow icon"
                className="inline"
                width={40}
                height={40}
              />
              My Workflow
            </Link>
          </li>
          <li>
            <Link
              href="/admin/masters"
              onClick={handleSidebarItemClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === "/admin/masters"
                  ? "bg-blue-200 border-r-4 border-blue-500 text-blue-700 scale-110"
                  : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"
              }`}
            >
              <Image
                src="/images/Master.png"
                alt="Master icon"
                className="inline"
                width={40}
                height={40}
              />
              Masters
            </Link>
          </li>
          <li>
            <Link
              href="/admin/hr"
              onClick={handleSidebarItemClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === "/admin/hr"
                  ? "bg-blue-200 border-r-4 border-blue-500 text-blue-700 scale-110"
                  : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"
              }`}
            >
              <Image
                src="/images/HR.png"
                alt="HR icon"
                className="inline"
                width={40}
                height={40}
              />
              Core HR
            </Link>
          </li>

          <li className="logout bottom-3">
            <Link
              href="/"
              onClick={handleSidebarItemClick}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110 transition-all duration-200"
            >
              <Image
                src="/images/Logout icon.png"
                alt="Logout icon"
                className="inline"
                width={40}
                height={40}
              />{" "}
              Logout{" "}
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  return <>{!isSmBreakpoint ? smallScreenSidebar() : renderSidebar()}</>;
};

export default Sidebar;
