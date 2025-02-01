"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
    
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const LOGIN_ENDPOINT = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT;

export async function login(prevState: unknown, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const response = await fetch(`${BACKEND_BASE_URL}${LOGIN_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return {
      errors: {
        email: "Invalid email or password",
      },
    };
  }
    const { token } = await response.json();
    
  // Store JWT in cookies
    cookies().set("token", token, { httpOnly: true, secure: true });
    redirect("/admin");
}