"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Video } from "lucide-react";
import { IBM_Plex_Sans } from "next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400" ,"700"],
  variable: "--font-ibm-plex-sans",
})

const ScheduleCard = () => {
  const tasks = [
    {
      time: "10-11.30 AM",
      title: "Interview UI/UX",
      video: true,
      active: true,
    },
    { time: "14-15.30 PM", title: "Interview Business Analyst" },
    { time: "17-18.00 PM", title: "Stand Up HR" },
    { time: "17-18.00 PM", title: "Stand Up HR" },
  ];

  return (
    <Card
      className={`p-6 rounded-xl bg-black/10 h-full pt-14 shadow-none ${ibmPlexSans.variable}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="text-lg font-normal">MON</div>
          <div className="text-4xl font-bold">20</div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black/40 h-[39px] w-[39px] hover:bg-black/50"
        >
          <Plus size={25} />
        </Button>
      </div>

      <div className="space-y-3 shadow-none">
        {tasks.map((task, idx) => (
          <Card
            key={idx}
            className={`shadow-none flex justify-between items-center p-3 rounded-lg ${
              task.active ? "bg-white" : "bg-black/20"
            }`}
          >
            <CardContent className="p-0">
              <div className="font-semibold text-sm">{task.time}</div>
              <div className="text-xs">{task.title}</div>
            </CardContent>
            {task.video && (
              <div className="bg-gray-200 p-2 rounded-full">
                <Video size={16} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ScheduleCard;
