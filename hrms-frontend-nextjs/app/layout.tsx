// app/layout.tsx
"use client";
import React, { useState } from "react";
import NavBar from "./components/Navbar/Navbar";
import SideBar from "./components/Sidebar/Sidebar";
import Footer from "./components/Footer/Footer";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(true);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-dvh">
          <header className="sticky top-0 z-10 bg-white shadow-lg">
            <NavBar toggleSideBar={toggleSideBar} />
          </header>

          <section className="flex flex-col justify-between h-dvh">
            <section className="flex flex-col sm:flex-row sm:items-start">
              {/* Sticky SideBar */}
              <div className="sm:sticky sm:top-24 sm:mt-24 mx-auto">
                <SideBar isOpen={isSideBarOpen} />
              </div>

              {/* Main Content */}
              <main className="sm:flex-grow sm:overflow-auto my-8">{children}</main>
            </section>
            <footer>
              <Footer />
            </footer>
          </section>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          style={{
            width: "90%",
            maxWidth: "500px",
          }}
        />
      </body>
    </html>
  );
}
