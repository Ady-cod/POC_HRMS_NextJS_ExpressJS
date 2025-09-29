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
  const [isXsBreakpoint, setIsXsBreakpoint] = useState(false);

  useEffect(()=>{
    const handleResize = ()=>{
      if(window.innerWidth<=440){
        setIsCollapsed(true);
      }
      else{
        setIsCollapsed(false);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  const handleResize = () => {
    setIsXsBreakpoint(window.innerWidth <= 440);
  };
  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <SheetContent className="w-4/6 sm:w-fit pt-12" side="left">
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
          ${
          isOpen ? "translate-x-0 opacity-100 sticky ml-2 mr-6 top-40" : "-translate-x-full absolute opacity-0"} 
          sm:p-6 pt-5 sidebar 
          ${isCollapsed ? 'sm:w-28' : 'sm:w-60'}
          `}
        style={{ 
                borderRadius: "45px",
                backgroundColor: '#D0DAE2',
                width: !isSmBreakpoint || window.innerWidth <=440
                  ? isCollapsed
                    ? "7rem"       
                    : "80%"       
                  : isCollapsed
                    ? "7rem"      
                    : "15rem",    
                minWidth: !isSmBreakpoint
                  ? isCollapsed
                    ? "4rem"
                    : "80%"
                  : isCollapsed
                    ? "7rem"
                    : "15rem",
                padding: !isSmBreakpoint
                  ? isCollapsed
                    ? "1.5rem"    
                    : "1.5rem"      
                  : undefined,
                margin: !isSmBreakpoint && isCollapsed ? "0 auto" : undefined
               }}
      >
        <div className={`flex ${!isCollapsed ? "justify-end" : "justify-center"}  mb-4 transition-[margin] duration-300 ease-in-out sidebar-expand-btn`}>
          <Image
            src={isCollapsed ? "/images/expand menu icon.png" : "/images/collapse.png"}
            alt={isCollapsed ? "expand menu icon" : "collapse menu icon"}
            width={44}
            height={44}
            className={`rounded-lg transition-all duration-200 hover:cursor-pointer mb-4  `}
            onClick={toggleCollapse}
            style={{margin: !isSmBreakpoint
                    ? isCollapsed
                      ? "0 0 1rem 0"    
                      : undefined      
                    : undefined}}
          />
        </div>
        <ul className="whitespace-nowrap font-semibold sm:text-[15px] flex flex-col gap-4 transition-[gap] duration-300 ease-in-out sidebaritems">
          {/* Home */}
          <li className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}>
            <Link
              href="/admin"
              onClick={handleSidebarItemClick}
              className={`group flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? pathname === "/admin"
                    ? "gap-0 px-0 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-0 px-0 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128]"
                  : pathname === "/admin"
                    ? "gap-3 px-4 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-3 px-4 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-110"}
                `}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200`}>
              <Image
                src="/images/home-darkblue-900.png"
                alt="Home icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                style={{ pointerEvents: "none" }}
              />
              {/* White (active) icon */}
              <Image
                src="/images/home-white.png"
                alt="Home icon active"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                style={{ pointerEvents: "none" }}
              />
              </div>
              {!isCollapsed && 
              <span className={`transition-colors duration-200 ${pathname === "/admin"
              ? "text-white"
              : "text-[#051A2B] group-hover:text-white"
              }`}>Home</span>}
            </Link>
          </li>

          {/* Profile */}
          <li className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}>
            <Link
              href="/admin/profile"
              onClick={handleSidebarItemClick}
              className={`group flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? pathname === "/admin/profile"
                    ? "gap-0 px-0 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-0 px-0 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128]"
                  : pathname === "/admin/profile"
                    ? "gap-3 px-4 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-3 px-4 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-110"}`}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200`}>
             <Image
                src="/images/My profile icon-darkblue-900.png"
                alt="Profile icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin/profile" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                style={{ pointerEvents: "none" }}
              />
              {/* White (active) icon */}
              <Image
                src="/images/MyProfileIcon-white.png"
                alt="Profile icon active"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin/profile" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                style={{ pointerEvents: "none" }}
              />
              </div>
              {!isCollapsed && 
              <span className={`transition-colors duration-200 ${pathname === "/admin/profile"
              ? "text-white"
              : "text-[#051A2B] group-hover:text-white"
              }`}>My Profile</span>}
            </Link>
          </li>

          {/* Employee menu */}
          <li
            className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`w-full group flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg cursor-default transition-all duration-200 
                ${pathname.startsWith("/admin/employee")
                  ? "gap-3 px-4 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white scale-110"
                  : isCollapsed
                  ? "gap-0 px-0 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] cursor-pointer"
                  : "gap-3 px-4 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-110 text-[#0C3E66]"
                }`}
               onClick={()=>{
                if(isCollapsed){
                  setIsCollapsed(false);
                  setIsHovered(true);
                }
               }}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200`}>
              <Image
                src="/images/My learning path icon-darkblue-900.png"
                alt="Employee icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/employee") ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
              />
              {/* White (active) icon */}
              <Image
                src="/images/MyLearningPath-white.png"
                alt="Employee icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/employee") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
              </div>
              {!isCollapsed && 
              <span className={`transition-colors duration-200 ${
              pathname.startsWith("/admin/employee")
              ? "text-white"
              : "text-[#051A2B] group-hover:text-white"
              }`}
              >Employee</span>}
            </div>

            {/* Submenu */}
            <ul
              className={`mt-1 ${isXsBreakpoint ? "ml-6" : "ml-12"} list-inside text-sm space-y-1 transition-all duration-300 ease-in-out ${
                !isCollapsed && (isHovered || pathname.startsWith("/admin/employee"))
                  ? "opacity-100 translate-y-0 max-h-40"
                  : "opacity-0 -translate-y-2 max-h-0 overflow-hidden"
              }`}
            >
              <li className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}>
                <Link
                  href="/admin/employee/list"
                  onClick={handleSidebarItemClick}
                  className={`group flex items-start gap-2 px-2 py-1 rounded-lg transition-all duration-200 
                  ${
                    isCollapsed
                      ? ""
                      : pathname === "/admin/employee/list"
                      ? ""
                      : "hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-105"
                  }
                  ${pathname === "/admin/employee/list" ? "text-[#E97128] cursor-default" : "text-[#051A2B]"}`}
                >
                  <span
                    className={`text-lg leading-none transition-colors duration-200
                      ${
                        pathname === "/admin/employee/list"
                          ? "text-[#E97128]" 
                          : "group-hover:text-white"
                      }
                    `}
                  >
                    •
                  </span>
                  <span className={`leading-tight transition-colors duration-200
                  ${
                    pathname === "/admin/employee/list"
                      ? "text-[#E97128]" 
                      : "group-hover:text-white"
                  }
                  `}>List</span>
                </Link>
              </li>

              <li className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}>
                <Link
                  href="/admin/employee/week-wise"
                  onClick={handleSidebarItemClick}
                  className={`group flex items-start gap-2 px-2 py-1 rounded-lg transition-all duration-200 
                    ${
                    isCollapsed
                      ? ""
                      : pathname === "/admin/employee/week-wise"
                      ? ""
                      : "hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-105"
                  }
                   ${pathname === "/admin/employee/week-wise" ? "text-[#E97128] cursor-default" : "text-[#051A2B]"}`}
                >
                  <span
                    className={`text-lg leading-none transition-colors duration-200
                  ${
                    pathname === "/admin/employee/week-wise"
                      ? "text-[#E97128]"
                      : "group-hover:text-white"
                  }
                  `}
                  >
                    •
                  </span>
                  <span className={`leading-tight transition-colors duration-200
                  ${
                    pathname === "/admin/employee/week-wise"
                      ? "text-[#E97128]"
                      : "group-hover:text-white"
                  }
                  `}>Week-wise</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Applicants */}
          <li className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}>
            <Link
              href="/admin/applicants"
              onClick={handleSidebarItemClick}
              className={`group flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? pathname === "/admin/applicants"
                    ? "gap-0 px-0 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-0 px-0 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128]"
                  : pathname === "/admin/applicants"
                    ? "gap-3 px-4 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-3 px-4 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-110"}`}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200`}>
              <Image
                src="/images/Applicants-darkblue-900.png"
                alt="Applicant icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin/applicants" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                style={{ pointerEvents: "none" }}
              />
              {/* White (active) icon */}
              <Image
                src="/images/MyProjectsIcon-white.png"
                alt="Applicant icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname === "/admin/applicants" ? "opacity-1000" : "opacity-0 group-hover:opacity-100"}`}
              />
              </div>
              {!isCollapsed && 
              <span className={`transition-colors duration-200 ${pathname === "/admin/applicants"
              ? "text-white"
              : "text-[#051A2B] group-hover:text-white"
              }`}>Applicants</span>}
            </Link>
          </li>

          {/* Workflow */}
          <li className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}>
            <Link
              href="/admin/workflow"
              onClick={handleSidebarItemClick}
              className={`group flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? pathname === "/admin/workflow"
                    ? "gap-0 px-0 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-0 px-0 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128]"
                  : pathname === "/admin/workflow"
                    ? "gap-3 px-4 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-3 px-4 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-110"}`}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200`}>
              <Image
                src="/images/My workflow icon-darkblue-900.png"
                alt="Workflow icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/workflow") ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
              />
              {/* White (active) icon */}
              <Image
                src="/images/MyWorkflowIcon-white.png"
                alt="Workflow icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/workflow") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
              </div>
              {!isCollapsed && 
              <span className={`transition-colors duration-200 ${pathname === "/admin/workflow"
              ? "text-white"
              : "text-[#051A2B] group-hover:text-white"
              }`}>My Workflow</span>}
            </Link>
          </li>

          {/* Masters */}
          <li className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}>
            <Link
              href="/admin/masters"
              onClick={handleSidebarItemClick}
              className={`group flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? pathname === "/admin/masters"
                    ? "gap-0 px-0 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-0 px-0 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128]"
                  : pathname === "/admin/masters"
                    ? "gap-3 px-4 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-3 px-4 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-110"
                }`}
            >
              <div className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200`}>
              <Image
                src="/images/Master-darkblue-900.png"
                alt="Master icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/masters") ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
              />
              {/* White (active) icon */}
              <Image
                src="/images/folderOpen-white.png"
                alt="Master icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/masters") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
              </div>
              {!isCollapsed && 
              <span className={`transition-colors duration-200 ${pathname === "/admin/masters"
              ? "text-white"
              : "text-[#051A2B] group-hover:text-white"
              }`}>Masters</span>}
            </Link>
          </li>

          {/* HR */}
          <li className={`relative w-full ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"}`}>
            <Link
              href="/admin/hr"
              onClick={handleSidebarItemClick}
              className={`group flex items-center justify-${isCollapsed ? "center" : "start"} rounded-lg transition-all duration-200 
                 ${isCollapsed 
                  ? pathname === "/admin/hr"
                    ? "gap-0 px-0 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-0 px-0 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128]"
                  : pathname === "/admin/hr"
                    ? "gap-3 px-4 py-2 bg-[#008EC7] border-r-8 border-[#E97128] text-white cursor-default scale-110"
                    : "gap-3 px-4 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-110"
                }`}
            >
              <div
                className={`relative w-6 h-6 flex items-center justify-center rounded-lg p-2 transition-all duration-200`}
              >
              <Image
                src="/images/HR-darkblue-900.png"
                alt="HR icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/hr") ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
              />
              {/* White (active) icon */}
              <Image
                src="/images/speedometer-white.png"
                alt="HR icon"
                width={24}
                height={24}
                className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname.startsWith("/admin/hr") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
              </div>
              {!isCollapsed && 
              <span className={`transition-colors duration-200 ${pathname === "/admin/hr"
              ? "text-white"
              : "text-[#051A2B] group-hover:text-white"
              }`}>Core HR</span>}
            </Link>
          </li>

          {/* Logout */}
          <li className={`logout bottom-3 mt-8 pt-4 transition-[margin,_padding] duration-300 ease-in-out list-none block border-t-2 border-black`}
          style={{margin:!isSmBreakpoint
                  ? isCollapsed
                    ? "1.5rem 0 0.5rem 0"
                    : undefined
                  : undefined
          }}>
            <form action={logout}>
              <button
                type="submit" 
                className={`group flex items-center justify-${isCollapsed ? "center" : "start"} ${isXsBreakpoint ? "text-xs" : "sm:text-[15px]"} transition-all duration-200 w-full rounded-lg ${
                  isCollapsed
                  ? "gap-0 px-0 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128]"
                  : "gap-3 px-4 py-2 hover:bg-[#0C3E66] hover:border-r-4 hover:border-[#E97128] hover:scale-110"
                }
              text-[#0C3E66]`}
              >
                <div
                  className={`relative w-6 h-5 flex items-center justify-center rounded-lg transition-all duration-200`}
                >
                <Image
                  src="/images/Logout icon-darkblue-900.png"
                  alt="Logout icon"
                  width={24}
                  height={24}
                  className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname==="/" ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                />
                <Image
                  src="/images/Logout-white.png"
                  alt="Logout icon"
                  width={24}
                  height={24}
                   className={`absolute top-0 left-0 transition-opacity duration-200 ${pathname==="/" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />
                </div>
                {!isCollapsed && 
                <span className={`transition-colors duration-200 ${pathname === "/"
              ? "text-white"
              : "text-[#051A2B] group-hover:text-white"
              }`}>Logout</span>}
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
