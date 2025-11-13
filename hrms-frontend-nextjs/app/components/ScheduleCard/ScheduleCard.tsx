"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Video } from "lucide-react";

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
    <Card className={`p-6 rounded-xl bg-darkblue-50 h-full pt-14 shadow-none`}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="text-lg font-normal text-darkblue-700">MON</div>
          <div className="text-4xl font-bold text-darkblue-700">20</div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-darkblue-150 h-[39px] w-[39px] hover:bg-darkblue-300"
        >
          <Plus size={30} />
        </Button>
      </div>

      <div className="space-y-3 shadow-none">
        {tasks.map((task, idx) => (
          <Card
            key={idx}
            className={`shadow-none flex justify-between items-center p-3 rounded-lg ${
              task.active ? "bg-white" : "bg-darkblue-100"
            }`}
          >
            <CardContent className="p-0">
              <div className="font-semibold text-sm text-darkblue-700">{task.time}</div>
              <div className="text-xs text-darkblue-700">{task.title}</div>
            </CardContent>
            {task.video && (
              <div className="bg-darkblue-75 p-2 rounded-full hover:bg-darkblue-200 cursor-pointer">
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
