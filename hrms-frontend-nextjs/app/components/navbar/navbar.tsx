"use client";
import React from 'react';
import Image from "next/image";

interface NavBarProps {
    isSideBarOpen: boolean;
    toggleSideBar: () => void;
}

const NavBar = ({ isSideBarOpen, toggleSideBar }:NavBarProps) => {
    return (
        <div className="border border-gray-400 h-20 flex justify-between items-center px-4">
            <div className="flex justify-center">
                <Image
                    src="/images/left-align_2209567.png"
                    alt="Sidebar icon"
                    width={28}
                    height={28}
                    className="cursor-pointer"
                    onClick={toggleSideBar}
                />
            </div>
            <div className="flex justify-center">
                <Image
                    src="/images/Zummitlabs Logo 3.png"
                    alt="Zummit Logo"
                    width={40}
                    height={40}
                />
            </div>
            <div className="flex items-center space-x-7">
                <Image
                    src="/images/Notifications.png"
                    alt="Notifications"
                    width={24}
                    height={24}
                />
                <div className="rounded-3xl bg-yellow-400 h-11 w-11 ml-12"></div>
            </div>
        </div>
    );
};

export default NavBar;
