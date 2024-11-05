import React from 'react'
import Link from 'next/link'
import './sidebar.css'

interface SideBarProps {
    isOpen: boolean;
}

const SideBar = ({ isOpen }:SideBarProps) => {
    return (
        <>
        <div className={`transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed  left-0 h-full w-72 bg-gray-400 rounded-3xl m-3 p-6 sidebar absolute`}>
            
                <ul className="font-black font-medium sidebaritems">
                    <li>
                  
                        <Link href="#">  <img
                    src="images/home.png"
                    alt="Home icon"
                    className="w-30px h-30px inline"
                />Home</Link>
                    </li>
                    <li>
                   
                        <Link href="#">  <img
                    src="images/My profile icon.png"
                    alt="Profile icon"
                    className="w-30px h-30px inline"
                    />My Profile</Link>
                    </li>
                    <li>
                  
                        <Link href="#">
                        <img
                    src="images/My learning path icon.png"
                    alt="Learning Path icon"
                    className="w-30px h-30px inline"
                />Employee</Link>
                    </li>
                    <li>
                   
                        <Link href="#"> <img
                    src="images/My projects icon.png"
                    alt="Project icon"
                    className="w-30px h-30px inline"
                />Applicants</Link>
                    </li>
                    <li>
                  
                        <Link href="#">
                        <img
                    src="images/My workflow icon.png"
                    alt="Workflow icon"
                    className="w-30px h-30px inline"
                />My Workflow</Link>
                    </li>
                    <li>
                    
                        <Link href="#">
                        <img
                    src="images/Master.png"
                    alt="Master icon"
                    className="w-30px h-30px inline"
                />Masters</Link>
                    </li>
                    <li>
                  
                        <Link href="#">
                        <img
                    src="images/HR.png"
                    alt="HR icon"
                    className="w-30px h-30px inline"
                />Core HR</Link>
                        </li>
               
                    <li className="logout fixed bottom-3">
                   <Link href="#">
                       
                   <img
                    src="images/Logout icon.png"
                    alt="Logout icon"
                    className="w-30px h-30px inline"
                /> Logout </Link> 
                </li>
                </ul>
        </div>
    
    </>
    );
};

export default SideBar;
