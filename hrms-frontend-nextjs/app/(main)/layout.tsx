"use client";
import React, { useState } from "react";
import NavBar from "@/components/Navbar/Navbar";
import SideBar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div className="flex flex-col h-dvh">
      {/* Header containing Sticky Navbar*/}
      <header className="sticky top-0 z-10 bg-white shadow-lg">
        <NavBar toggleSideBar={toggleSideBar} />
      </header>

      <section className="flex flex-col justify-between h-dvh">
        <section className="flex flex-col flex-1  sm:flex-row sm:items-start">
          {/* Sticky SideBar */}
          <SideBar isOpen={isSideBarOpen} toggleSidebar={setIsSideBarOpen} />

          {/* Main Content */}
          <main className="sm:flex-grow  h-full sm:overflow-auto ">
            {children}
          </main>
        </section>
        <footer>
          <Footer />
        </footer>
      </section>
    </div>
  );
}
