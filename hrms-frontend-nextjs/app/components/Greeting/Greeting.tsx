"use client";
import React, { useEffect, useState } from "react";

const getTimeBasedGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

const Greeting = ({ name }: { name: string }) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setGreeting(getTimeBasedGreeting());
  }, []);

  return (
    <div className="font-bold text-2xl md:text-4xl lg:text-5xl sm:text-3xl">
      {greeting}, {name}!
    </div>
  );
};

export default Greeting;
