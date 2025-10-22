import React, {useState} from 'react'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

interface DeactivateButtonProps {
    selectedEmployees: string[];
    onDeactivate: (ids: string[]) => void;
}

const DeactivateButton:React.FC<DeactivateButtonProps> = ({selectedEmployees, onDeactivate,}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeactivateClick = () => {
    // Open the confirmation modal
    setIsModalOpen(true);
    };

  const confirmDeactivate = () => {
    onDeactivate(selectedEmployees);
    setIsModalOpen(false);
    };
  return (
    <div>
        <button
            onClick={handleDeactivateClick}
            disabled={selectedEmployees.length === 0}
            className={`inline-flex items-center border rounded-lg px-2 py-2 text-sm font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors duration-300 motion-reduce:transition-none
                ${
                    selectedEmployees.length === 0
                        ? "border-orange-100 text-orange-100 cursor-not-allowed bg-white"
                        : "border-orange-500 text-orange-500 hover:border-orange-500 hover:text-white hover:bg-orange-700"
                }
            `}
        >
        <span>Deactivate</span>
      </button>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeactivate}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate ${selectedEmployees?.length} selected employee(s)?`}
      />
  </div>
  )
}

export default DeactivateButton
