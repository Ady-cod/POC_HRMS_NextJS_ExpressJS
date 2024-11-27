// app/layout.tsx
"use client";
import React, { useState } from "react";
import NavBar from "./components/Navbar/Navbar";
import SideBar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
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
          <NavBar toggleSideBar={toggleSideBar} />

          <section className="flex flex-col justify-between h-dvh">
            <section className="flex flex-col items-center justify-center sm:flex-row">

              {/* Sticky SideBar */}
              <div
                className="sticky top-10 mb-20"
              >
                <SideBar isOpen={isSideBarOpen} />
              </div>

              {/* Main Content */}
              <main className="flex-grow p-6 mb-12 mx-4">{children}</main>
            </section>
            <Footer />
          </section>
        </div>
      </body>
    </html>
  );
}
