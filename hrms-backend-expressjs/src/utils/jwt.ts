import jwt from "jsonwebtoken";
import { Employee, Role } from "@prisma/client";

const SECRET_KEY = process.env.JWT_SECRET || "dev-secret-key"; // Use an environment variable for the secret
if (!process.env.JWT_SECRET) {
  console.warn(
    "Warning: Using default JWT secret. This should never happen in production."
  );
}

// Type for payload (customize this according to your app)
interface JwtPayload {
  employeeId: Employee["id"];
  role: Role;
}

// Generate a new JWT
export const generateToken = (
  payload: JwtPayload,
  expiresIn: string = "1h"
): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Verify the validity of a JWT and extract the payload
export const decodeToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
