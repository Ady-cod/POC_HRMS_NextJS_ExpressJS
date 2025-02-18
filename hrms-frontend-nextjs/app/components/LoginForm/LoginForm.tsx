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

const LoginForm = () => {
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
      className="flex flex-col items-center justify-center"
    >
      <h1
        className={`${playfair.className} text-5xl text-[#323232] font-bold mb-12 bg-[#d9d9d9] rounded`}
      >
        Login
      </h1>
      <label
        htmlFor="email"
        className="self-start mb-1 text-base text-gray-500 font-medium bg-[#d9d9d9] rounded"
      >
        Email Address
      </label>
      <input
        name="email"
        type="email"
        placeholder="Email*"
        required
        className={`w-auto sm:w-[30vw] mb-2 p-1 shadow-md shadow-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 ${
          state?.errors?.email ? "border-2 border-red-500" : ""
        }`}
      />
      {state?.errors?.email && (
        <p className="self-start mb-4 text-red-500 text-sm font-semibold bg-[#d9d9d9]">
          {state.errors.email}
        </p>
      )}
      <label
        htmlFor="password"
        className="self-start mb-1 text-base text-gray-500 font-medium bg-[#d9d9d9] rounded"
      >
        Password
      </label>
      <div className="relative rounded-md w-auto sm:w-[30vw] mb-2">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password*"
          required
          className={`w-full p-1 pr-12 shadow-md shadow-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 ${
            state?.invalidCredentials || state?.errors && "password" in state.errors
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
            className="text-gray-600 hover:text-gray-700 hover:text-xl"
          />
        </button>
      </div>
      {state?.errors && "password" in state.errors && (
        <p className="self-start mb-2 text-red-500 text-sm font-semibold bg-[#d9d9d9] rounded">
          {state.errors.password}
        </p>
      )}
      <Link
        href="#"
        className="self-start text-sm font-semibold text-blue-600 hover:underline bg-[#d9d9d9] rounded"
      >
        Forgot your password?
      </Link>
      <SubmitButton className="self-end bg-gray-400 hover:bg-gray-600 text-white font-medium py-2 px-8 rounded">
        Login
      </SubmitButton>
      <Link
        href="#"
        className="absolute bottom-4 right-6 self-end p-2 text-sm font-semibold text-blue-600 hover:underline"
      >
        Register now
      </Link>
      {/* Home Button on the Left Dark Section */}
      <Link
        href="/"
        className="absolute bottom-4 left-6 flex flex-col items-center p-2 rounded text-white bg-[#353535] transform transition-transform hover:scale-110 border border-transparent hover:border-white"
      >
        <FontAwesomeIcon
          icon={faHome}
          className="text-4xl max-[350px]:text-2xl"
        />
        <span className="text-sm max-[350px]:text-xs mt-2">Back Home</span>
      </Link>
    </form>
  );
};

export default LoginForm;
