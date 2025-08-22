// src/components/TotalCountButton.tsx
"use client";
import React from "react";
import "./TotalCountButton.css";

interface TotalCountButtonProps {
  count: number;
}

const TotalCountButton: React.FC<TotalCountButtonProps> = ({ count }) => {
  return (
    <button
      disabled
      className={`
        total-count-button 
        inline-flex items-center
        border-2 border-gray-300
        bg-white
        text-gray-400
        rounded-lg 
        px-5 py-2          
        text-sm font-semibold
        cursor-default
        hover:bg-gray-100 hover:shadow-sm
        transition duration-200
      `}
    >
      Total Count: {count}
    </button>
  );
};

export default TotalCountButton;