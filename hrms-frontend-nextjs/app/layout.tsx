// app/layout.tsx
"use client";
import React, { useState } from "react";
import NavBar from "./components/navbar/navbar";
import SideBar from "./components/SidebarMenu/Sidebar";
import Footer from "./components/footer/footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-dvh">
          <NavBar isSideBarOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
          <section className="flex flex-col justify-between h-dvh">
            <section className="flex flex-col items-center justify-center sm:flex-row">
              <SideBar isOpen={isSideBarOpen} />
              <main className="flex-grow p-4 mb-4">{children}</main>
            </section>
            <Footer />
          </section>
        </div>
      </body>
    </html>
  );
}
