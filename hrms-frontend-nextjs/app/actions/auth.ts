"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { loginSchema } from "@/schemas/loginSchema";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const LOGIN_ENDPOINT = process.env.NEXT_PUBLIC_LOGIN_ENDPOINT;

interface LoginErrorResponse {
  errors: Record<string, string[]>;
  invalidCredentials?: boolean;
}

export async function login(
  prevState: unknown,
  formData: FormData
): Promise<void | LoginErrorResponse> {
  const validationResult = loginSchema.safeParse(Object.fromEntries(formData));

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validationResult.data;

  try {
    const response = await fetch(`${BACKEND_BASE_URL}${LOGIN_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return response.status === 401
        ? {
            errors: {
              email: ["Invalid email or password"],
            },
            invalidCredentials: true,
          }
        : {
            errors: {
              serverError: [
                "An unexpected error occurred while logging in. Please try again later or contact support if the issue persists.",
              ],
            },
          };
    }
    const { token } = await response.json();

    // Store JWT in cookies
    cookies().set("token", token, { httpOnly: true, secure: true });
  } catch (error) {
    console.error(error);
    return {
      errors: {
        networkError: [
          "Unable to connect to the server. Please check your internet connection or try again later.",
        ],
      },
    };
  }

  // Redirect to admin page, later on we will add a check for the user role and redirect to the appropriate page
  redirect("/admin");
}
