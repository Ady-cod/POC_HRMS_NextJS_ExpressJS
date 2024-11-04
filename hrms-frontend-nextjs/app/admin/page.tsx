import React from 'react'
import NavBar from '../components/navBar/navBar'

    return (
        <div>
            <NavBar isSideBarOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
            <SideBar isOpen={isSideBarOpen} />
        </div>
    );
};

export default Page;
