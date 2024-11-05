import React from 'react'
import NavBar from '../components/navBar/navBar'

    const toggleSideBar=()=>{
setIsSideBarOpen(!isSideBarOpen)
    }
    return (
        <>
            <NavBar isSideBarOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
            <SideBar isOpen={isSideBarOpen} />
        </div>
    );
};

export default Page;
