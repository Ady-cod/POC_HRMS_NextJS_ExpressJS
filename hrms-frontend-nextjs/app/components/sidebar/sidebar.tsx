import React from 'react'
import Link from 'next/link'
import './sidebar.css'

interface SideBarProps {
    isOpen: boolean;
}

const SideBar = ({ isOpen }:SideBarProps) => {
    return (
        <>
        <div className={`transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed  left-0 h-full w-80 bg-gray-400 rounded-3xl m-3 p-6 sidebar absolute`}>
            
                <ul className="font-black font-medium sidebaritems">
                    <li>
                        <Link href="#">Home</Link>
                    </li>
                    <li>
                        <Link href="#">My Profile</Link>
                    </li>
                    <li>
                        <Link href="#">Employee</Link>
                    </li>
                    <li>
                        <Link href="#">Applicants</Link>
                    </li>
                    <li>
                        <Link href="#">My Workflow</Link>
                    </li>
                    <li>
                        <Link href="#">Masters</Link>
                    </li>
                    <li>
                        <Link href="#">Core HR</Link>
                        </li>
                </ul>
                <hr className="fixed bottom-9 text-yellow-500"/>
                <div className="fixed bottom-9">
                   <Link href="#"> Logout </Link> 
                     </div>
        </div>
    
    </>
    );
};

export default SideBar;
