import React from 'react'

interface SelectButtonProps {
  selectMode: boolean;
  onToggleSelectMode: () => void;
}

const SelectButton: React.FC<SelectButtonProps> = ({ selectMode, onToggleSelectMode }) => {
  return (
    <div>
      <button
      onClick={onToggleSelectMode} className={`
        inline-flex items-center
        border
        border-lightblue-500
        text-lightblue-500
        rounded-lg 
        px-2 py-2          
        text-sm font-semibold
        shadow-sm
        hover:border-darkblue-500
        hover:text-darkblue-500
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008ec7]
        focus-visible:ring-offset-2 focus-visible:ring-offset-white
        transition-colors duration-300 motion-reduce:transition-none
        `}>
        <span>{selectMode ? "Unselect" : "Select"}</span>
      </button>
    </div>
  )
}

export default SelectButton
