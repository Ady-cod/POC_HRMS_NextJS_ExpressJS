// Admin Home Page
import React from "react";
import Link from "next/link";
import Image from "next/image";

const AdminHomePage = () => {
  return (
    <div>
      <div className="flex justify-between p-12 pt-8 border border-red-500">
        <div className="font-bold text-5xl">Good Afternoon, HR!</div>
        <div className="flex flex-col gap-3 items-center">
          Connect to
          <Link href="#">
            <Image
              src="/images/slack.png"
              alt="Slack logo"
              width={40}
              height={40}
            />
          </Link>
          <Link href="#">
            <Image
              src="/images/trello.png"
              alt="Trello logo"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
