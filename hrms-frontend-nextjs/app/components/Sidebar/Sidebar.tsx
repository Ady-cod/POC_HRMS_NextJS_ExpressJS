"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SBIcons from "../SidebarIcons/SidebarIcons";
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

// Constants
const SIDEBAR_PATHS = {
  HOME: "/admin",
  PROFILE: "/admin/profile",
  EMPLOYEE: {
    LIST: "/admin/employee/list",
    WEEK_WISE: "/admin/employee/week-wise",
  },
  APPLICANTS: "/admin/applicants",
  WORKFLOW: "/admin/workflow",
  MASTERS: {
    DEPARTMENTS: "/admin/masters/departments",
    PROJECTS: "/admin/masters/projects"
  },
  HR: "/admin/hr",
} as const;

const ICONS = {
  HOME: SBIcons.Home,
  PROFILE: SBIcons.Profile,
  EMPLOYEE: SBIcons.Employee,
  APPLICANTS: SBIcons.Applicants,
  WORKFLOW: SBIcons.Workflow,
  MASTERS: SBIcons.Masters,
  HR: SBIcons.Hr,
  LOGOUT: SBIcons.Logout,
  COLLAPSE: SBIcons.Collapse,
  EXPAND: SBIcons.Expand,
} as const;

// Menu item configuration
interface MenuItemConfig {
  path: string;
  label: string;
  icons: React.FC<{ className?: string }>;
  hasSubmenu?: boolean;
  submenuItems?: SubmenuItemConfig[];
}

interface SubmenuItemConfig {
  path: string;
  label: string;
}

type MenuItemKey =
  | "HOME"
  | "PROFILE"
  | "EMPLOYEE"
  | "APPLICANTS"
  | "WORKFLOW"
  | "MASTERS"
  | "HR"
  | "LOGOUT";

const MENU_CONFIG: Record<MenuItemKey, MenuItemConfig> = {
  HOME: {
    path: SIDEBAR_PATHS.HOME,
    label: "Home",
    icons: ICONS.HOME,
  },
  PROFILE: {
    path: SIDEBAR_PATHS.PROFILE,
    label: "My Profile",
    icons: ICONS.PROFILE,
  },
  EMPLOYEE: {
    path: "/admin/employee",
    label: "Employee",
    icons: ICONS.EMPLOYEE,
    hasSubmenu: true,
    submenuItems: [
      { path: SIDEBAR_PATHS.EMPLOYEE.LIST, label: "List" },
      { path: SIDEBAR_PATHS.EMPLOYEE.WEEK_WISE, label: "Week-wise" },
    ],
  },
  APPLICANTS: {
    path: SIDEBAR_PATHS.APPLICANTS,
    label: "Applicants",
    icons: ICONS.APPLICANTS,
  },
  WORKFLOW: {
    path: SIDEBAR_PATHS.WORKFLOW,
    label: "My Workflow",
    icons: ICONS.WORKFLOW,
  },
  MASTERS: {
    path: "/admin/masters",
    label: "Masters",
    icons: ICONS.MASTERS,
    hasSubmenu: true,
    submenuItems: [
      { path: SIDEBAR_PATHS.MASTERS.DEPARTMENTS, label: "Departments" },
      { path: SIDEBAR_PATHS.MASTERS.PROJECTS, label: "Projects" },
    ]
  },
  HR: {
    path: SIDEBAR_PATHS.HR,
    label: "Core HR",
    icons: ICONS.HR,
  },
  LOGOUT: {
    path: "/",
    label: "Logout",
    icons: ICONS.LOGOUT,
  },
} as const;

// Reusable MenuItem component
interface MenuItemProps {
  config: MenuItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const MenuItem = ({
  config,
  isActive,
  isCollapsed,
  onClick,
  children,
}: MenuItemProps) => {
  const getItemClasses = () => `group flex items-center rounded-lg transition-all duration-200
    ${isCollapsed ? "justify-center px-0 py-1" : "justify-start px-3 py-1.5"}
    ${isActive ? "bg-lightblue-500 border-r-8 border-orange-500 text-white" : "hover:bg-darkblue-500 hover:border-r-4 hover:border-orange-500 text-darkblue-900"}
  `;

  const getTextClasses = () => {
    return `ml-2 transition-colors duration-200 ${
      isActive ? "text-white" : "text-darkblue-900 group-hover:text-white"
    }`;
  };

  return (
    <li className="w-full">
      <Link href={config.path} onClick={onClick} className={getItemClasses()}>
        <div className="relative w-6 h-6 flex items-center justify-center transition-all duration-200">
          <config.icons
            className={`transition-colors duration-200 ${isActive ? "text-white" : "text-darkblue-900 group-hover:text-white"}`}
          />
        </div>
        {!isCollapsed && (
          <span className={getTextClasses()}>{config.label}</span>
        )}
      </Link>
      {children}
    </li>
  );
};

// Reusable SubmenuItem component
interface SubmenuItemProps {
  path: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SubmenuItem = ({ path, label, isActive, onClick }: SubmenuItemProps) => {
  return (
    <li>
      <Link
        href={path}
        onClick={onClick}
        className={`group flex items-start gap-2 px-2 py-1 rounded-lg transition-all duration-200 ${
          isActive ? "text-orange-500 cursor-default" : "text-darkblue-900 hover:bg-darkblue-500 hover:border-r-4 hover:border-orange-500"
        }`}
      >
        <span className={`text-lg leading-none transition-colors duration-200 ${isActive ? "text-orange-500" : "group-hover:text-white"}`}>•</span>
        <span className={`leading-tight transition-colors duration-200 ${isActive ? "text-orange-500" : "group-hover:text-white"}`}>
          {label}
        </span>
      </Link>
    </li>
  );
};

// Submenu component for items with dropdowns
interface SubmenuProps {
  config: MenuItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
  isHovered: boolean;
  pathname: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onItemClick: () => void;
  onExpandClick?: () => void;
}

const Submenu = ({
  config,
  isActive,
  isCollapsed,
  isHovered,
  pathname,
  onMouseEnter,
  onMouseLeave,
  onItemClick,
  onExpandClick,
}: SubmenuProps) => {
  const getContainerClasses = () => `group relative w-full flex items-center rounded-lg transition-all duration-200
    ${isCollapsed ? "justify-center px-0 py-1" : "justify-start px-3 py-1.5"}
    ${isActive ? "bg-lightblue-500 border-r-8 border-orange-500 text-white" : "hover:bg-darkblue-500 hover:border-r-4 hover:border-orange-500 text-darkblue-900"}
  `;

  const getSubmenuClasses = () =>
    `ml-8 mt-1 list-inside sm:text-[13px] space-y-0.5 transition-all duration-300 ease-in-out ${
      !isCollapsed && (isHovered || isActive)
        ? "opacity-100 translate-y-0 max-h-[40vh] overflow-y-auto"
        : "opacity-0 -translate-y-2 max-h-0 overflow-hidden"
    }`;

  return (
    <li
      className="relative w-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={getContainerClasses()} onClick={onExpandClick}>
        <div className="relative w-6 h-6 flex items-center justify-center transition-all duration-200">
          <config.icons
            className={`transition-colors duration-200 ${
              isActive ? "text-white" : "text-darkblue-900 group-hover:text-white"
            }`}
          />
        </div>
        {!isCollapsed && <span className={`ml-2 transition-colors duration-200 ${isActive ? "text-white" : "text-darkblue-900 group-hover:text-white"}`}>{config.label}</span>}
        {isCollapsed && isHovered && (
          <span className="absolute left-full ml-2 bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap z-50">
            {config.label}
          </span>
        )}
      </div>

      <ul className={getSubmenuClasses()}>
        {config.submenuItems?.map((item) => (
          <SubmenuItem
            key={item.path}
            path={item.path}
            label={item.label}
            isActive={pathname === item.path}
            onClick={onItemClick}
          />
        ))}
      </ul>
    </li>
  );
};

// Utility functions
const getActiveState = (currentPath: string, itemPath: string): boolean => {
  const pathsWithSubmenus = ["/admin/employee", "/admin/masters"];
  if (pathsWithSubmenus.includes(itemPath)) {
    return currentPath.startsWith(itemPath);
  }
  return currentPath === itemPath;
};

const getSidebarClasses = (isOpen: boolean, isCollapsed: boolean): string => {
  return `
  transition-all duration-300 ease-in-out bg-darkblue-75
  ${
    isOpen
      ? "translate-x-0 opacity-100 sticky top-24 sm:mx-3"
      : "-translate-x-full absolute opacity-0"
  }
  px-6 sm:px-6 pt-3 sidebar mb-2
  ${isCollapsed ? "sm:w-28" : "sm:w-60"}
  flex flex-col min-h-0
  h-auto sm:max-h-[calc(100dvh-6rem-0.5rem)]
  overflow-hidden
`;
};

const getSidebarStyle = (isCollapsed: boolean): React.CSSProperties => ({
  borderRadius: "45px",
  width: isCollapsed ? "7rem" : "15rem",
  minWidth: isCollapsed ? "7rem" : "15rem",
  scrollbarWidth: "thin", // Firefox
  scrollbarColor: "#0c3e66 #d0dae2", // Firefox
});


const getCollapseIcon = (isCollapsed: boolean) => {
  return isCollapsed ? ICONS.EXPAND : ICONS.COLLAPSE;
};

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: (value: boolean) => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SideBarProps) => {
  const [isSmBreakpoint, setIsSmBreakpoint] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 640px)").matches
      : true
  );
  const pathname = usePathname();
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin/employee")) {
    setHoveredSubmenu("employee");
  } else if (pathname.startsWith("/admin/masters")) {
    setHoveredSubmenu("masters");
  } else {
    setHoveredSubmenu(null);
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


  const renderSidebar = () => {
    const CollapseIcon  = getCollapseIcon(isCollapsed);

    return (
      <div
        className={getSidebarClasses(isOpen, isCollapsed)}
        style={getSidebarStyle(isCollapsed)}
      >
        <div
          className={`flex ${
            !isCollapsed ? "justify-end" : "justify-center"
          } mb-2`}
        >
          <CollapseIcon
            className="transition-all duration-200 hover:cursor-pointer mt-4 mb-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        <ul className="whitespace-nowrap pr-1 pb-3 font-semibold sm:text-[14px] flex flex-col gap-3 sidebaritems flex-1 overflow-y-auto overflow-x-hidden">
          {/* Home */}
          <MenuItem
            config={MENU_CONFIG.HOME}
            isActive={getActiveState(pathname, SIDEBAR_PATHS.HOME)}
            isCollapsed={isCollapsed}
            onClick={handleSidebarItemClick}
          />

          {/* Profile */}
          <MenuItem
            config={MENU_CONFIG.PROFILE}
            isActive={getActiveState(pathname, SIDEBAR_PATHS.PROFILE)}
            isCollapsed={isCollapsed}
            onClick={handleSidebarItemClick}
          />

          {/* Employee menu */}
          <Submenu
            config={MENU_CONFIG.EMPLOYEE}
            isActive={getActiveState(pathname, "/admin/employee")}
            isCollapsed={isCollapsed}
            isHovered={hoveredSubmenu==="employee"}
            pathname={pathname}
            onMouseEnter={() => {setHoveredSubmenu("employee");}}
            onMouseLeave={() => setHoveredSubmenu(null)}
            onItemClick={handleSidebarItemClick}
            onExpandClick={() => {
              if (isCollapsed) {
                setIsCollapsed(false);
                setHoveredSubmenu("employee");
              }
            }}
          />

          {/* Applicants */}
          <MenuItem
            config={MENU_CONFIG.APPLICANTS}
            isActive={getActiveState(pathname, SIDEBAR_PATHS.APPLICANTS)}
            isCollapsed={isCollapsed}
            onClick={handleSidebarItemClick}
          />

          {/* Workflow */}
          <MenuItem
            config={MENU_CONFIG.WORKFLOW}
            isActive={getActiveState(pathname, SIDEBAR_PATHS.WORKFLOW)}
            isCollapsed={isCollapsed}
            onClick={handleSidebarItemClick}
          />

          {/* Masters */}
          <Submenu
            config={MENU_CONFIG.MASTERS}
            isActive={getActiveState(pathname, "/admin/masters")}
            isCollapsed={isCollapsed}
            isHovered={hoveredSubmenu === "masters"}
            pathname={pathname}
            onMouseEnter={() => setHoveredSubmenu("masters")}
            onMouseLeave={() => setHoveredSubmenu(null)}
            onItemClick={handleSidebarItemClick}
            onExpandClick={() => {
              if (isCollapsed) {
                setIsCollapsed(false);
                setHoveredSubmenu("masters");
              }
            }}
          /> 

          {/* HR */}
          <MenuItem
            config={MENU_CONFIG.HR}
            isActive={getActiveState(pathname, SIDEBAR_PATHS.HR)}
            isCollapsed={isCollapsed}
            onClick={handleSidebarItemClick}
          />

          {/* Logout */}
          <li className="logout mb-3 mt-2">
            <form
              action={logout}
              onSubmit={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("hrms_connection_status");
                }
              }}
            >
              <button
                type="submit"
                className={`group flex items-center justify-${isCollapsed ? "center" : "start"} transition-all duration-200 w-full rounded-lg gap-2 px-3 py-1.5 hover:bg-darkblue-500 hover:border-r-4 hover:border-orange-500 text-darkblue-900`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <ICONS.LOGOUT className="transition-colors duration-200 group-hover:text-white text-darkblue-900" />
                </div>
                {!isCollapsed && <span className="  transition-colors duration-200 text-darkblue-900 group-hover:text-white">Logout</span>}
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
