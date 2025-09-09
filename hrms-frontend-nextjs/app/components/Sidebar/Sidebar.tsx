"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Sidebar.css";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/shadCN/shadCNDialog";
import { logout } from "@/actions/auth";

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: (value: boolean) => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SideBarProps) => {
  const [isSmBreakpoint, setIsSmBreakpoint] = useState(true);
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false); // For Employee submenu
  const [isCollapsed, setIsCollapsed] = useState(false); 

  useEffect(() => {
    if (pathname.startsWith("/admin/employee")) {
      setIsHovered(true);
    }
  }, [pathname]);

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderSidebar = () => {
    return (
      <div
        className={`
          transition-all duration-75 ease-in-out 
          sm:border-r-2 
          ${
          isOpen ? "translate-x-0 opacity-100 sticky ml-2 mr-6 top-32" : "-translate-x-full absolute opacity-0"} 
          sm:p-6 pt-5 sidebar 
          ${isCollapsed ? 'sm:w-28' : 'sm:w-60'}`}
        style={{ borderRadius: "45px", backgroundColor: '#d9d9d9',width: isCollapsed ? "7rem" : "15rem",
    minWidth: isCollapsed ? "7rem" : "15rem" }}
      >
        <div className={`flex ${!isCollapsed ? "justify-end" : "justify-center"}  mb-4`}>
          <Image
            src={isCollapsed ? "/images/expand menu icon.png" : "/images/collapse.png"}
            alt={isCollapsed ? "expand menu icon" : "collapse menu icon"}
            width={44}
            height={44}
            className={`rounded-lg transition-all duration-200 hover:cursor-pointer mb-4  `}
            onClick={toggleCollapse}
          />
        </div>

        <ul className="whitespace-nowrap font-semibold sm:text-[15px]  flex flex-col gap-4 sidebaritems">
          {/* Home */}
          <li className="w-full">
            <Link
              href="/admin"
              onClick={handleSidebarItemClick}
              className={`flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? "gap-0 px-0 py-2"
                  : "gap-3 px-4 py-2 hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"}
                ${
                pathname === "/admin"
                  ? " text-blue-700 scale-110"
                  : ""
              }`}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isCollapsed ? "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110" : ""
                }  
                `}>
              <Image
                src="/images/home.png"
                alt="Home icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin" ? "opacity-0" : "opacity-100"}`}
                style={{ pointerEvents: "none" }}
              />
              {/* Blue (active) icon */}
              <Image
                src="/images/home-blue.png"
                alt="Home icon active"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin" ? "opacity-100" : "opacity-0"}`}
                style={{ pointerEvents: "none" }}
              />
              </div>
              {!isCollapsed && <span>Home</span>}
            </Link>
          </li>

          {/* Profile */}
          <li className="w-full">
            <Link
              href="/admin/profile"
              onClick={handleSidebarItemClick}
              className={`flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? "gap-0 px-0 py-2 "
                  : "gap-3 px-4 py-2 hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"}
                ${pathname === "/admin/profile"
                  ? "text-blue-700 scale-110"
                  : ""
              }`}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isCollapsed? "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110" : ""
                }`}>
             <Image
                src="/images/My profile icon.png"
                alt="Profile icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin/profile" ? "opacity-0" : "opacity-100"}`}
                style={{ pointerEvents: "none" }}
              />
              {/* Blue (active) icon */}
              <Image
                src="/images/MyProfileIcon-blue.png"
                alt="Profile icon active"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin/profile" ? "opacity-100" : "opacity-0"}`}
                style={{ pointerEvents: "none" }}
              />
              </div>
              {!isCollapsed && <span>My Profile</span>}
            </Link>
          </li>

          {/* Employee menu */}
          <li
            className="relative w-full"
            onMouseEnter={() => {
              setIsHovered(true);
              if (isCollapsed) setIsHovered(false);
            }}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`w-full flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg cursor-default transition-all duration-200 
                ${isCollapsed 
                  ? "gap-0 px-0 py-2 "
                  : "gap-3 px-4 py-2 hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"}
                ${
                pathname.startsWith("/admin/employee")
                  ? " text-blue-700 scale-110"
                  : ""
              } `}
               onClick={()=>{
                if(isCollapsed){
                  setIsCollapsed(false);
                  setIsHovered(true);
                }
               }}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isCollapsed ? "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110" : ""
                }`}>
              <Image
                src="/images/My learning path icon.png"
                alt="Employee icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/employee") ? "opacity-0" : "opacity-100"}`}
              />
              {/* Blue (active) icon */}
              <Image
                src="/images/MyLearningPath-blue.png"
                alt="Employee icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/employee") ? "opacity-100" : "opacity-0"}`}
              />
              </div>
              {!isCollapsed && <span>Employee</span>}
            </div>

            {/* Submenu */}
            <ul
              className={`ml-12 mt-1 list-inside text-sm space-y-1 transition-all duration-300 ease-in-out ${
                !isCollapsed && (isHovered || pathname.startsWith("/admin/employee"))
                  ? "opacity-100 translate-y-0 max-h-40"
                  : "opacity-0 -translate-y-2 max-h-0 overflow-hidden"
              }`}
            >
              <li>
                <Link
                  href="/admin/employee/list"
                  onClick={handleSidebarItemClick}
                  className={`flex items-start gap-2 px-2 py-1 rounded-lg transition-all duration-200 ${
                    pathname === "/admin/employee/list"
                      ? "text-blue-600"
                      : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-105 text-black"
                  }`}
                >
                  <span
                    className={`text-lg leading-none ${
                      pathname === "/admin/employee/list" ? "text-blue-600" : ""
                    }`}
                  >
                    •
                  </span>
                  <span className="leading-tight">List</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/employee/week-wise"
                  onClick={handleSidebarItemClick}
                  className={`flex items-start gap-2 px-2 py-1 rounded-lg transition-all duration-200 ${
                    pathname === "/admin/employee/week-wise"
                      ? "text-blue-600"
                      : "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-105 text-black"
                  }`}
                >
                  <span
                    className={`text-lg leading-none ${
                      pathname === "/admin/employee/week-wise"
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    •
                  </span>
                  <span className="leading-tight">Week-wise</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Applicants */}
          <li className="w-full">
            <Link
              href="/admin/applicants"
              onClick={handleSidebarItemClick}
              className={`flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? "gap-0 px-0 py-2"
                  : "gap-3 px-4 py-2 hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"} 
                  ${
                pathname === "/admin/applicants"
                  ? " text-blue-700 scale-110"
                  : ""
              } `}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isCollapsed ? "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110" : ""
                }`}>
              <Image
                src="/images/Applicants.png"
                alt="Applicant icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin/applicants" ? "opacity-0" : "opacity-100"}`}
                style={{ pointerEvents: "none" }}
              />
              {/* Blue (active) icon */}
              <Image
                src="/images/MyProjectsIcon-blue.png"
                alt="Applicant icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin/applicants" ? "opacity-1000" : "opacity-0"}`}
              />
              </div>
              {!isCollapsed && <span>Applicants</span>}
            </Link>
          </li>

          {/* Workflow */}
          <li className="w-full">
            <Link
              href="/admin/workflow"
              onClick={handleSidebarItemClick}
              className={`flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? "gap-0 px-0 py-2 "
                  : "gap-3 px-4 py-2 hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"}
                   ${
                pathname === "/admin/workflow"
                  ? " text-blue-700 scale-110"
                  : ""
              } `}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isCollapsed ? "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110" : ""
                }`}>
              <Image
                src="/images/My workflow icon.png"
                alt="Workflow icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/workflow") ? "opacity-0" : "opacity-100"}`}
              />
              {/* Blue (active) icon */}
              <Image
                src="/images/MyWorkflowIcon-blue.png"
                alt="Workflow icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/workflow") ? "opacity-100" : "opacity-0"}`}
              />
              </div>
              {!isCollapsed && <span>My Workflow</span>}
            </Link>
          </li>

          {/* Masters */}
          <li className="w-full">
            <Link
              href="/admin/masters"
              onClick={handleSidebarItemClick}
              className={`flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? "gap-0 px-0 py-2 "
                  : "gap-3 px-4 py-2 hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"}
                   ${
                pathname === "/admin/masters"
                  ? " text-blue-700 scale-110"
                  : ""
              } `}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isCollapsed ? "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110" : ""
                }`}>
              <Image
                src="/images/Master.png"
                alt="Master icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/masters") ? "opacity-0" : "opacity-100"}`}
              />
              {/* Blue (active) icon */}
              <Image
                src="/images/folderOpen-blue.png"
                alt="Master icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/masters") ? "opacity-100" : "opacity-0"}`}
              />
              </div>
              {!isCollapsed && <span>Masters</span>}
            </Link>
          </li>

          {/* HR */}
          <li className="w-full">
            <Link
              href="/admin/hr"
              onClick={handleSidebarItemClick}
              className={`flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? "gap-0 px-0 py-2"
                  : "gap-3 px-4 py-2 hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"}
                   ${
                pathname === "/admin/hr"
                  ? " text-blue-700 scale-110"
                  : ""
              } `}
            >
              <div
                className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isCollapsed ? "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110" : ""
                }`}
              >
              <Image
                src="/images/HR.png"
                alt="HR icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/hr") ? "opacity-0" : "opacity-100"}`}
              />
              {/* Blue (active) icon */}
              <Image
                src="/images/speedometer-blue.png"
                alt="HR icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/hr") ? "opacity-100" : "opacity-0"}`}
              />
              </div>
              {!isCollapsed && <span>Core HR</span>}
            </Link>
          </li>

          {/* Logout */}
          <li className="logout bottom-3 mt-8 ">
            <form action={logout}>
              <button
                type="submit" 
                className={`flex items-center  transition-all duration-200 w-full rounded-lg ${
                  isCollapsed
                  ? "justify-center gap-0 px-0 py-2 "
                  : "justify-start gap-3 px-4 py-2 hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110"
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                  isCollapsed ? "hover:bg-gray-300 hover:border-r-2 hover:border-gray-500 hover:scale-110" : ""
                  }`}
                >
                <Image
                  src="/images/Logout icon.png"
                  alt="Logout icon"
                  width={24}
                  height={24}
                />
                </div>
                {!isCollapsed && <span>Logout</span>}
              </button>
            </form>
          </li>
        </ul>
      </div>
    );
  };

  return <>{!isSmBreakpoint ? smallScreenSidebar() : renderSidebar()}</>;
};

export default Sidebar;
