// src/components/AddNewDataButton.tsx
"use client";
import React from "react";
import "./AddNewDataButton.css"; // Import CSS if using external styling

interface AddNewDataButtonProps {
  onClick: () => void;
}

const AddNewDataButton: React.FC<AddNewDataButtonProps> = ({ onClick }) => {
  return (
    <button
      className={`
    add-new-data-button 
    inline-flex items-center
        bg-[#a7aeb4]
        text-white
        rounded-lg 
        px-5 py-2          
        text-sm font-semibold
        shadow-sm
        hover:bg-gray-500
        focus:outline-none focus:ring-4 focus:ring-gray-700
        transition-colors duration-150
    `}
      onClick={onClick}
    >
      + Add New Data
    </button>
  );
};

export default AddNewDataButton;
