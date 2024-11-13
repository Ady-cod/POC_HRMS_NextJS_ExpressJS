// app/layout.tsx
"use client";
import React, { useState } from 'react';
import NavBar from './components/navbar/navbar';
import SideBar from './components/sidebar/sidebar';
import Footer from './components/footer/footer';
import './globals.css';


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
      <body className="min-h-screen flex flex-col">
        <NavBar isSideBarOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
        <div className="flex flex-grow">
          <SideBar isOpen={isSideBarOpen} />

          <main className="flex-grow p-4">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
