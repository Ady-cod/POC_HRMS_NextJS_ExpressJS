import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/shadCN/shadCNDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    }) => {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50%] max-w-[90%] bg-white rounded-lg shadow-lg p-8 z-50"
          side="top"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
          </SheetHeader>
          <SheetDescription className="text-gray-600 mt-4">
            {description}
          </SheetDescription>
          <SheetFooter className="mt-6 flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              onClick={onClose}
              className="bg-gray-300 text-black rounded-lg px-4 py-2 hover:bg-gray-400 transition"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Confirm
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
};
    
export default ConfirmationModal;