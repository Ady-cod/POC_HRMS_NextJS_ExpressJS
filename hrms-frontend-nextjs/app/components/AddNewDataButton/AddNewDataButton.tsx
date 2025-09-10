"use client";
import React from "react";
import "./AddNewDataButton.css"; 

interface AddNewDataButtonProps {
  onClick: () => void;
  className?: string;
  buttonText?: string;
}

const AddNewDataButton: React.FC<AddNewDataButtonProps> = ({
  onClick,
  className = "",
  buttonText = "+ Add New Data"
}) => {
  return (
    <button
      className={`
        add-new-data-button 
        inline-flex items-center
        bg-[#008ec7]
        text-white
        rounded-lg 
        px-5 py-2          
        text-sm font-semibold
        shadow-sm
        hover:bg-[#0c3e66]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008ec7]
        focus-visible:ring-offset-2 focus-visible:ring-offset-white
        transition-colors duration-150 motion-reduce:transition-none
        ${className}
    `}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};

export default AddNewDataButton;
