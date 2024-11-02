import React from 'react'

const NavBar = () => {
    return (
        <div className="border border-gray-400 h-20 flex justify-between items-center px-4">
            <div className="flex justify-center">
            <img
                    src="images/left-align_2209567.png" 
                    alt="Sidebar icon"
                    className="w-6 h-7"
                />
            </div>
            <div className="flex justify-center">
                <img
                    src="images/Zummitlabs Logo 3.png" 
                    alt="Zummit Logo"
                    className="w-11 h-11"
                />
            </div>
            <div className="flex items-center space-x-7">
                <img
                    src="images/Notifications.png" 
                    alt="Notifications"
                    className="w-6 h-7"
                />
                <div className="rounded-3xl bg-yellow-400 h-11 w-11 ml-12"></div>

            </div>

        </div>
    )
}

export default NavBar
