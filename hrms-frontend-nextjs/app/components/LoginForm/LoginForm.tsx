"use client";
import { login } from "@/actions/auth";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { showToast } from "@/utils/toastHelper";
import SubmitButton from "@/components/SubmitButton/SubmitButton";

const LoginForm = () => {
  const [state, formAction] = useFormState(login, undefined);
    useEffect(() => {
        if (state) {
            const errorMessages = Object.values(state.errors).flat();
            showToast("error", "Error logging in", errorMessages);
        }
    }, [state]);
  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input
        name="email"
        type="email"
        id="email"
        placeholder="Email*"
        required
      />
      {state?.errors?.email && <p>{state.errors.email}</p>}
      <label htmlFor="password">Password</label>
      <input
        name="password"
        type="password"
        id="password"
        placeholder="Password*"
        required
      />
      {state?.errors && "password" in state.errors && (
        <p>{state.errors.password}</p>
      )}
      <SubmitButton className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Login</SubmitButton>
    </form>
  );
};

export default LoginForm;

// function SubmitButton() {
//     const { pending } = useFormStatus();
//   return <button type="submit" disabled={pending}>Login</button>;
// }
