// src/components/AddNewDataButton.tsx
"use client";
import React from "react";
import "./AddNewDataButton.css"; // Import CSS if using external styling

interface AddNewDataButtonProps {
  onClick: () => void;
}

const AddNewDataButton: React.FC<AddNewDataButtonProps> = ({ onClick }) => {
  return (
    <button className="add-new-data-button font-semibold" onClick={onClick}>
      + Add New Data
    </button>
  );
};

export default AddNewDataButton;
