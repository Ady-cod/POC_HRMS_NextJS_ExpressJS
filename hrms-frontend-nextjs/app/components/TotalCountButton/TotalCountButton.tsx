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
        border-b-2 border-orange-500
        bg-white
        text-[#1C1C1C]/50
        px-5 py-2          
        text-sm font-semibold
        cursor-default
      `}
    >
      Total Count: {count}
    </button>
  );
};

export default TotalCountButton;