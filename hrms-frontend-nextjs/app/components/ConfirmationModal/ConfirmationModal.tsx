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
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50%] max-w-[90%] bg-white rounded-lg shadow-lg p-8 z-[2000]"
          side="top"
        >
          <SheetHeader>
            <SheetTitle className="text-3xl font-bold mt-4 text-darkblue-900">{title}</SheetTitle>
          </SheetHeader>
          <SheetDescription className="text-darkblue-900 mt-4">
            {description}
          </SheetDescription>
          <SheetFooter className="mt-6 flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-4 sm:space-y-0 text-xl">
            <button
              onClick={onClose}
              className=" w-[160px] h-[52px] bg-white text-orange-500 border-2 border-solid font-bold border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus: ring-orange-500 focus:ring-offset-2 hover:bg-orange-50 hover:text-orange-800 hover:border-orange-800 hover:focus:ring-orange-800 transition-all duration-200 hover:scale-105"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className=" w-[160px] h-[52px] bg-lightblue-500 font-bold text-white rounded-lg hover:bg-darkblue-600 focus:outline-none focus:ring-2 focus: ring-lightblue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
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