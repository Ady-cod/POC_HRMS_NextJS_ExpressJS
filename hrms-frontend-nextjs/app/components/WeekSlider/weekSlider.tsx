"use client";

import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import "./WeekSlider.css";

/**
 * We now scroll **one week at a time** when you hit a caret so the
 * selected week can remain pinned to the edge while everything else
 * slides underneath.
 */

const FALLBACK_STEP = 130; // just in case we can’t measure any buttons

interface WeekSliderProps {
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}

const WeekSlider: React.FC<WeekSliderProps> = ({
  selectedWeek,
  setSelectedWeek,
}) => {
  /* --------------------------------------------------------------------- */
  /* Refs & state                                                          */
  /* --------------------------------------------------------------------- */
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [stickySide, setStickySide] = useState<"left" | "right" | null>(null);

  const weeks = Array.from({ length: 17 }, (_, i) => i + 1);

  /* --------------------------------------------------------------------- */
  /* Detect viewport width (show / hide carets on ≥768 px)                 */
  /* --------------------------------------------------------------------- */
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* --------------------------------------------------------------------- */
  /* Helper – locate the button that represents the currently‑selected week*/
  /* --------------------------------------------------------------------- */
  const getSelectedWeekButton = React.useCallback(() => {
    if (!scrollRef.current) return null;
    const buttons = scrollRef.current.querySelectorAll("button.week-button");
    return buttons[selectedWeek];
  }, [selectedWeek]);

  /* --------------------------------------------------------------------- */
  /* Helper – how wide is **one** week button (including the flex gap)?    */
  /* --------------------------------------------------------------------- */
  const getWeekStep = () => {
    const btn = getSelectedWeekButton() as HTMLElement | null;
    if (!btn) return FALLBACK_STEP;

    // Try to infer the horizontal gap between buttons from CSS
    const gapStr = window.getComputedStyle(
      scrollRef.current as HTMLDivElement
    ).columnGap;
    const gap = parseFloat(gapStr || "8"); // Tailwind gap-2 → 0.5rem ≈ 8 px

    return btn.offsetWidth + gap;
  };

  /* --------------------------------------------------------------------- */
  /* Sticky logic – keeps track of whether the selected button is glued to */
  /* an edge so we can (a) apply the helper class & (b) decide when        */
  /* caret clicks should bypass the “keep‑visible” clamp.                  */
  /* --------------------------------------------------------------------- */
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

        // Use viewport‑based positions so position:sticky is accounted for
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
          setStickySide(null); // back inside the viewport — normal scrolling
        }
        ticking = false;
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once initially to set correct state
    return () => container.removeEventListener("scroll", onScroll);
  }, [selectedWeek, stickySide, getSelectedWeekButton]);

  /* --------------------------------------------------------------------- */
  /* Clamp helper – prevents the selected button from disappearing when    */
  /* it isn’t sticky yet (same as before).                                 */
  /* --------------------------------------------------------------------- */
  const clampScrollToKeepSelectedVisible = (
    tentativeScrollLeft: number,
    container: HTMLDivElement,
    selectedBtn: HTMLElement
  ) => {
    const btnLeft = selectedBtn.offsetLeft;
    const btnRight = btnLeft + selectedBtn.offsetWidth;

    const btnLeftAfter = btnLeft - tentativeScrollLeft;
    const btnRightAfter = btnRight - tentativeScrollLeft;

    // Would the button vanish on the left?
    if (btnLeftAfter < 0) return btnLeft;
    // Would it vanish on the right?
    if (btnRightAfter > container.clientWidth)
      return btnRight - container.clientWidth;

    return tentativeScrollLeft; // normal step
  };

  /* --------------------------------------------------------------------- */
  /* Caret helpers                                                         */
  /* --------------------------------------------------------------------- */
  const scrollByStep = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const step = getWeekStep();
    const delta = dir === "left" ? -step : step;

    const tentativeLeft = container.scrollLeft + delta;

    const selectedBtn = getSelectedWeekButton();
    if (!selectedBtn) return;

    // Only apply the visibility‑clamp when the selected week is **not**
    // already sticky. Once it’s glued to an edge, the browser guarantees
    // it remains visible.
    const finalLeft =
      stickySide === null
        ? clampScrollToKeepSelectedVisible(
            tentativeLeft,
            container,
            selectedBtn as HTMLElement
          )
        : Math.min(
            Math.max(tentativeLeft, 0),
            container.scrollWidth - container.clientWidth
          );

    container.scrollTo({ left: finalLeft, behavior: "smooth" });
  };

  /* --------------------------------------------------------------------- */
  /* Render                                                                */
  /* --------------------------------------------------------------------- */
  return (
    <div className="flex items-center w-full gap-2 px-2">
      {/* Left caret ------------------------------------------------------ */}
      {isDesktop && (
        <button
          onClick={() => scrollByStep("left")}
          className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-300 hover:bg-gray-400 rounded-full shadow-md mb-5"
        >
          <FontAwesomeIcon icon={faCaretLeft} className="text-black text-xl" />
        </button>
      )}

      {/* Scrollable list -------------------------------------------------- */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth w-full hide-scrollbar mx-2 mb-5"
      >
        {/* All‑weeks button ---------------------------------------------- */}
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

        {/* Individual week buttons -------------------------------------- */}
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

      {/* Right caret ----------------------------------------------------- */}
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
