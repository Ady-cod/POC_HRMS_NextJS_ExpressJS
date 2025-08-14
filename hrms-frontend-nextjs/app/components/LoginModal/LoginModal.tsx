"use client";
import LoginForm from "@/components/LoginForm/LoginForm";
import "@/(auth)/login/LoginPage.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative flex items-center justify-center w-[90%] h-[85%] max-w-[1000px] bg-[#d9d9d9] rounded shadow-xl overflow-x-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close login"
          className="absolute right-4 top-2 z-30 w-8 h-8 flex items-center justify-center text-2xl leading-none text-gray-700 hover:text-black hover:bg-gray-200 rounded-full cursor-pointer"
        >
          ×
        </button>

        {/* Left Trapezoidal Black Section */}
        <div
          className="w-1/2 h-full bg-[#353535]"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 75% 100%, 0% 100%)" }}
        />

        {/* Letter Design Overlay */}
        <div
          id="letter-design-overlay"
          className="absolute top-1/2 transform -translate-y-1/2 left-[20%] min-[520px]:left-1/4 w-[25%] aspect-[4/3] bg-[#d9d9d9] border-2 border-[#bfbfbf] flex items-center justify-center"
        >
          {/* Diagonal Lines */}
          <div className="absolute w-full scale-x-[1.24] h-[3px] bg-[#808080] rotate-[36.5deg]" />
          <div className="absolute w-full scale-x-[1.24] h-[3px] bg-[#808080] -rotate-[36.5deg]" />
        </div>

        {/* Right section with Login Form */}
        <div className="z-10 w-[50%] h-[100%] mr-2 sm:mr-0 pr-10 xxs:pr-0 flex items-center justify-center sm:justify-start sm:pl-8 md:pl-12 lg:pl-16">
          <LoginForm onCloseModal={onClose} />
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
