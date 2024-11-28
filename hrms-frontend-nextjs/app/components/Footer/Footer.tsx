import React from 'react'
import Link from 'next/link'
import Image from 'next/image';

const Footer = () => {
    return (
      <div >
        <div className="bg-gray-300 flex flex-col gap-2 sm:flex-row justify-between items-center py-4 sm:p-8">
          <div className="flex justify-center">ZummitLabs&copy;2024</div>
          <div>Privacy Policy | Terms & Conditions</div>
          <div className="flex items-center space-x-2">
            <Link href="#">
              <Image
                src="/images/Facebook link.png"
                alt="Facebook"
                className="inline"
                width={25}
                height={25}
              />
            </Link>
            <Link href="#">
              <Image
                src="/images/Twitter link.png"
                alt="Twitter"
                className="inline"
                width={25}
                height={25}
              />
            </Link>
            <Link href="#">
              <Image
                src="/images/Youtube link.png"
                alt="Youtube"
                className="inline"
                width={25}
                height={25}
              />
            </Link>
          </div>
        </div>
      </div>
    );
}

export default Footer;
