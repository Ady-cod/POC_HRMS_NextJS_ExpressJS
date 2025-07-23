"use client";

import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import "./WeekSlider.css";

interface WeekSliderProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}

const WeekSlider: React.FC<WeekSliderProps> = ({
  selectedWeek,
  setSelectedWeek,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const weeks = Array.from({ length: 17 }, (_, i) => i + 1);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center w-full gap-2 px-2">
      {/* Left Big Circular Button with black caret */}
      {isDesktop && (
        <button
          onClick={scrollLeft}
          className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md mb-5"
        >
          <FontAwesomeIcon icon={faCaretLeft} className="text-black text-xl" />
        </button>
      )}

      {/* Scrollable Week Buttons */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth w-full hide-scrollbar mx-2 mb-5"
      >
        {weeks.map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`flex-shrink-0 px-8 py-3 rounded-md text-white text-sm transition ${
              selectedWeek === week
                ? "bg-green-500"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {week === 17 ? "Week 17+" : `Week ${week}`}
          </button>
        ))}
      </div>

      {/* Right Big Circular Button with black caret */}
      {isDesktop && (
        <button
          onClick={scrollRight}
          className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md mb-5"
        >
          <FontAwesomeIcon icon={faCaretRight} className="text-black text-xl" />
        </button>
      )}
    </div>
  );
};

export default WeekSlider;
