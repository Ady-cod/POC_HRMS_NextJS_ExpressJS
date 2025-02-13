import LoginForm from "@/components/LoginForm/LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <main className="flex items-center justify-center h-[100%] w-full relative">
      {/* Left Trapezoidal Black Section */}
      <div
        className=" w-[50%] h-[100%] bg-[#353535]"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 75% 100%, 0% 100%)" }}
      />

      {/* Letter Design Overlay */}
      <div
        id="letter-design-overlay"
        className="absolute top-1/2 transform -translate-y-1/2 left-[15%] md:left-1/4 w-[25%] aspect-[4/3] bg-[#d9d9d9] border-2 border-[#bfbfbf] flex items-center justify-center"
      >
        {/* Diagonal Lines */}
        <div className="absolute w-full scale-x-[1.24] h-[3px] bg-[#808080] rotate-[36.5deg]"></div>
        <div className="absolute w-full scale-x-[1.24] h-[3px] bg-[#808080] -rotate-[36.5deg]"></div>
      </div>

      {/* Right section with Login Form */}
      <div className="z-10 w-[50%] h-[100%] mr-2 sm:mr-0 pr-14 sm:pr-0 flex items-center justify-center">
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
