"use client"
import React,{useState} from 'react'
import NavBar from '../components/navBar/navBar'
import SideBar from '../components/sidebar/sidebar'
import Footer from '../components/footer/footer'

const Page=()=>{
    const [isSideBarOpen,setIsSideBarOpen] = useState<boolean>(true)

    const toggleSideBar=()=>{
setIsSideBarOpen(!isSideBarOpen)
    }
    return (
        <div>
            <NavBar isSideBarOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
            <SideBar isOpen={isSideBarOpen} />
            <Footer/>
        </div>
    );
};

export default Page;
