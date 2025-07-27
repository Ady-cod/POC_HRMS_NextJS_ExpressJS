import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import prisma from "../lib/client";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find employee by email
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    // If employee is not found, send an error response
    if (!employee) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Compare the password with the hashed password  
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      console.error("Invalid password for employee with the email: ", employee.email);
      res.status(401).json({ message: "Invalid credentials" });
      return;
      }

    // Generate JWT
    const token = generateToken({
      employeeId: employee.id,
      role: employee.role,
      fullName: employee.fullName,
      email: employee.email,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred in the sever during the login" });
  }
};
