"use client";

import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import "./weekSlider.css";

/**
 * WeekSlider component with horizontal scrolling navigation.
 * Features sticky positioning for selected weeks and smooth scrolling.
 */

const FALLBACK_SCROLL_STEP = 130;

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
  const [stickySide, setStickySide] = useState<"left" | "right" | null>(null);

  const weeks = Array.from({ length: 17 }, (_, i) => i + 1);

  // Detect viewport width for showing/hiding navigation carets
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSelectedWeekButton = React.useCallback(() => {
    if (!scrollRef.current) return null;
    const buttons = scrollRef.current.querySelectorAll("button.week-button");
    return buttons[selectedWeek];
  }, [selectedWeek]);

  const calculateScrollStep = () => {
    const selectedButton = getSelectedWeekButton() as HTMLElement | null;
    if (!selectedButton) return FALLBACK_SCROLL_STEP;

    const containerElement = scrollRef.current as HTMLDivElement;
    const gapValue = parseFloat(window.getComputedStyle(containerElement).columnGap || "8");
    
    return selectedButton.offsetWidth + gapValue;
  };

  // Track sticky positioning for visual styling
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const selectedBtn = getSelectedWeekButton();
        if (!selectedBtn) {
          ticking = false;
          return;
        }

        const btnRect = selectedBtn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const leftInside = btnRect.left - containerRect.left;
        const rightInside = btnRect.right - containerRect.left;

        if (leftInside <= 0 && stickySide !== "left") {
          setStickySide("left");
        } else if (
          rightInside >= container.clientWidth &&
          stickySide !== "right"
        ) {
          setStickySide("right");
        } else if (
          leftInside > 0 &&
          rightInside < container.clientWidth &&
          stickySide !== null
        ) {
          setStickySide(null);
        }
        ticking = false;
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, [selectedWeek, stickySide, getSelectedWeekButton]);

  const scrollByStep = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const step = calculateScrollStep();
    const delta = direction === "left" ? -step : step;
    const currentScrollLeft = container.scrollLeft;
    const targetScrollLeft = currentScrollLeft + delta;

    // Apply only basic bounds checking to respect user intent
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const minScrollLeft = 0;
    const finalScrollLeft = Math.min(Math.max(targetScrollLeft, minScrollLeft), maxScrollLeft);

    container.scrollTo({ left: finalScrollLeft, behavior: "smooth" });
  };

  return (
    <div className="flex items-center w-full gap-2 px-2">
      {/* Left navigation caret */}
      {isDesktop && (
        <button
          onClick={() => scrollByStep("left")}
          className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md mb-5"
        >
          <FontAwesomeIcon icon={faCaretLeft} className="text-black text-xl" />
        </button>
      )}

      {/* Scrollable week buttons container */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth w-full hide-scrollbar mx-2 mb-5"
      >
        {/* All weeks button */}
        <button
          onClick={() => setSelectedWeek(0)}
          className={`week-button px-8 py-3 rounded-md text-white text-sm transition ${
            selectedWeek === 0 ? "bg-blue-500" : "bg-gray-400 hover:bg-gray-500"
          } ${
            selectedWeek === 0 && stickySide === "left" ? "sticky-left" : ""
          } ${
            selectedWeek === 0 && stickySide === "right" ? "sticky-right" : ""
          }`}
        >
          All Weeks
        </button>

        {/* Individual week buttons */}
        {weeks.map((week) => {
          const isSelected = selectedWeek === week;
          return (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`week-button px-8 py-3 rounded-md text-white text-sm transition ${
                isSelected ? "bg-green-500" : "bg-gray-400 hover:bg-gray-500"
              } ${isSelected && stickySide === "left" ? "sticky-left" : ""} ${
                isSelected && stickySide === "right" ? "sticky-right" : ""
              }`}
            >
              {week === 17 ? "Week 17+" : `Week ${week}`}
            </button>
          );
        })}
      </div>

      {/* Right navigation caret */}
      {isDesktop && (
        <button
          onClick={() => scrollByStep("right")}
          className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md mb-5"
        >
          <FontAwesomeIcon icon={faCaretRight} className="text-black text-xl" />
        </button>
      )}
    </div>
  );
};

export default WeekSlider;