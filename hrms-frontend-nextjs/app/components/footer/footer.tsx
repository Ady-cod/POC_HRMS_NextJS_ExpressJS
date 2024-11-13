import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <div>
            <div className="w-full h-24 fixed bottom-0 bg-gray-300 flex flex-col sm:flex-row justify-between items-center p-10">
                <div className="flex justify-center">
                    ZummitLabs&copy;2024
                </div>
                <div>
                    Privacy Policy | Terms & Conditions
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="#"> 
                    <img
                    src="/images/Facebook link.png"
                    alt="Facebook"
                    className="w-30 h-30px inline"
                />
                    </Link>
                    <Link href="#">
                    <img
                    src="/images/Twitter link.png"
                    alt="Twitter"
                    className="w-30px h-30px inline"
                />
                    </Link>
                    <Link href="#">
                    <img
                    src="/images/Youtube link.png"
                    alt="Youtube"
                    className="w-30px h-30px inline"
                />
                    </Link>

                </div>
            </div>
        </div>
    )
}

export default Footer
