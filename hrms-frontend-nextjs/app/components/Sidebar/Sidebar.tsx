"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./Sidebar.css";
import { useEffect, useState, useRef } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { boolean } from "zod";

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: (value: boolean) => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SideBarProps) => {
  const [isSmBreakpoint, setIsSmBreakpoint] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      toggleSidebar(false); // Set isOpen to false when the sheet is closed
    }
  };


  useEffect(() => {
    if(isOpen){
      setIsSheetOpen(true)
    }
    else if (!isOpen) {
      setIsSheetOpen(false);
    }
  }, [isOpen,isSheetOpen])
  

  const smallScreenSidebar = () => {
    return (
      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger ></SheetTrigger>
        <SheetContent className="w-[50%] max-[400px]:w-[65%] p-0 max-[525px]:pl-4 pl-8 pt-12" side="left">
          <SheetHeader>
            <SheetTitle>
              {renderSidebar()}
             
            </SheetTitle>
           
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  };

  const renderSidebar = () => {
    return (
      <div
        className={`transition-transform-500 ${
          isOpen ? "transform-translate-x-0" : "transform -translate-x-full hidden"
        }  left-0 w-60 bg-gray-300 rounded-3xl m-3 p-6 sidebar`}
      >
        <ul className="font-semibold sidebaritems">
          <li>
            <Link href="/admin">
              {" "}
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
            <Link href="/admin/profile">
              {" "}
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
            <Link href="/admin/employee">
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
            <Link href="/admin/applicants">
              {" "}
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
            <Link href="/admin/workflow">
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
            <Link href="/admin/masters">
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
            <Link href="/admin/hr">
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
            <Link href="#">
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
    </>
  );
};

export default Sidebar;
