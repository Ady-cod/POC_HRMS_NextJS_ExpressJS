"use client";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faHome } from "@fortawesome/free-solid-svg-icons";

import { login } from "@/actions/auth";
import { showToast } from "@/utils/toastHelper";
import SubmitButton from "@/components/SubmitButton/SubmitButton";

import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({ weight: ["900"], subsets: ["latin"] });

interface LoginFormProps {
  onCloseModal?: () => void;
  appearance?: "live" | "ghost";
  suppressAnchors?: boolean;
}

const LoginForm = ({
  onCloseModal,
  appearance = "live",
  suppressAnchors = false,
}: LoginFormProps) => {
  const [state, formAction] = useFormState(login, undefined);

  // State to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state) {
      const errorMessages = Object.values(state.errors).flat();
      showToast("error", "Error logging in:", errorMessages);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className={`flex flex-col items-center justify-center  ${
        appearance === "ghost" ? "relative w-full h-full" : ""
      }`}
    >
      <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-8">
        <path d="M6.465 43.5349C5.52725 44.4724 5.00028 45.7439 5 47.0699V52.4999C5 53.1629 5.26339 53.7988 5.73223 54.2677C6.20107 54.7365 6.83696 54.9999 7.5 54.9999H15C15.663 54.9999 16.2989 54.7365 16.7678 54.2677C17.2366 53.7988 17.5 53.1629 17.5 52.4999V49.9999C17.5 49.3369 17.7634 48.701 18.2322 48.2321C18.7011 47.7633 19.337 47.4999 20 47.4999H22.5C23.163 47.4999 23.7989 47.2365 24.2678 46.7677C24.7366 46.2988 25 45.6629 25 44.9999V42.4999C25 41.8369 25.2634 41.201 25.7322 40.7321C26.2011 40.2633 26.837 39.9999 27.5 39.9999H27.93C29.256 39.9996 30.5275 39.4727 31.465 38.5349L33.5 36.4999C36.9746 37.7103 40.7571 37.7056 44.2287 36.4868C47.7003 35.2679 50.6555 32.907 52.6109 29.7902C54.5663 26.6734 55.406 22.9853 54.9928 19.3293C54.5795 15.6732 52.9378 12.2655 50.3361 9.66384C47.7344 7.06213 44.3267 5.42037 40.6707 5.00714C37.0146 4.5939 33.3265 5.43365 30.2097 7.38901C27.0929 9.34438 24.732 12.2996 23.5131 15.7712C22.2943 19.2428 22.2896 23.0253 23.5 26.4999L6.465 43.5349Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M40.5 18C40.7761 18 41 17.7761 41 17.5C41 17.2239 40.7761 17 40.5 17C40.2239 17 40 17.2239 40 17.5C40 17.7761 40.2239 18 40.5 18Z" fill="black" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h1
        className={`${playfair.className} text-5xl text-[#323232] font-medium mb-12 bg-darkblue-50 rounded`}
      >
        Login
      </h1>

      {/* Email */}
      <div
        className={`relative rounded-md ${
          onCloseModal
            ? "w-full sm:w-[37vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] xl:max-w-[440px]"
            : "w-auto sm:w-[30vw]"
        } mb-4`}
      >
        <input
          name="email"
          type="email"
          placeholder="Email address"
          required
          className={`w-full p-2 shadow-md text-darkblue-300 mx-0 placeholder-darkblue-300 border bg-darkblue-50 border-lightblue-900 bg-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 ${
            state?.errors?.email ? "border-2 border-red-500" : ""
          }`}
        />
      </div>
      {state?.errors?.email && (
        <p className="self-start mb-4 text-red-500 text-sm font-semibold bg-transparent">
          {state.errors.email}
        </p>
      )}

      {/* Password */}
      
      <div 
        className={`relative rounded-md ${
          onCloseModal
              ? "w-full sm:w-[37vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] xl:max-w-[440px]"
              : "w-auto sm:w-[30vw]"
          } mb-2`}
      >
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          className={`w-full p-2 shadow-md text-darkblue-300 placeholder-darkblue-300 bg-darkblue-50 border border-lightblue-900 bg-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 ${
            state?.invalidCredentials ||
            (state?.errors && "password" in state.errors)
              ? "border-2 border-red-500"
              : ""
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            size="sm"
            className="text-gray-600 hover:text-[#1C1B1F] hover:text-xl transition"
          />
        </button>
      </div>
      {state?.errors && "password" in state.errors && (
        <p className="self-start mb-2 text-red-500 text-sm font-semibold bg-transparent rounded">
          {state.errors.password}
        </p>
      )}

      {/* Forgot password link */}
      <Link
        href="#"
        className="self-start text-sm font-medium text-orange-900 hover:underline bg-darkblue-50 rounded whitespace-nowrap max-[700px]:mb-2"
      >
        Forgot your password?
      </Link>

      {/* Submit button */}
      <SubmitButton className="flex items-center justify-center  bg-lightblue-700 hover:bg-lightblue-900 text-white font-bold text-2xl py-2 px-12 mt-6 rounded-3xl transition">
        Login
      </SubmitButton>

      {/* Register link */}
      {!suppressAnchors && (
        <Link
          href="#"
          className="absolute bottom-4 right-6 self-end p-2 text-lg font-thin text-darkblue-900 max-[350px]:text-xs max-[350px]:font-medium hover:underline"
        >
          Register now
        </Link>
      )}

      {/* Home button */}
      {!suppressAnchors &&
        (onCloseModal ? (
          <button
            type="button"
            onClick={onCloseModal}
            className="absolute bottom-4 left-6 flex flex-col items-center p-2 rounded-lg text-white bg-darkblue-900  transform transition-transform hover:scale-110 border border-transparent"
          >
            <>
              <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 20H6.25V12.5H13.75V20H17.5V8.75L10 3.125L2.5 8.75V20ZM0 22.5V7.5L10 0L20 7.5V22.5H11.25V15H8.75V22.5H0Z" fill="white"/>
              </svg>
              <span className="text-sm max-[350px]:text-[10px] max-[350px]:leading-[14px] mt-2">
                Back Home
              </span>
            </>
          </button>
        ) : (
          <Link
            href="/"
            className="absolute bottom-4 left-6 flex flex-col items-center p-2 rounded text-white bg-[#353535] transform transition-transform hover:scale-110 border border-transparent hover:border-white"
          >
            <>
              <FontAwesomeIcon
                icon={faHome}
                className="text-4xl max-[350px]:text-2xl"
              />
              <span className="text-sm max-[350px]:text-xs mt-2">
                Back Home
              </span>
            </>
          </Link>
        ))}
    </form>
  );
};

export default LoginForm;
