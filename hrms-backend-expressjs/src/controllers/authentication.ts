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
      console.error(
        "Invalid password for employee with the email: ",
        employee.email
      );
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

    // Update the employee's lastLogin and maintain a rolling list `lastLogins` (max 30 entries)
    // Capture the returned updated record from Prisma so we can return the history to clients
    let updatedLastLogin: Date | null = null;
    let updatedLastLogins: Date[] = [];
    try {
      const now = new Date();
      console.debug(
        "Attempting to update lastLogins for employee:",
        employee.id
      );

      // Read existing list from the initial `employee` read (may be undefined)
      const existingList: Date[] = (employee as any).lastLogins ?? [];

      // Append current login and keep only the last 30 (most recent)
      const newList = [...existingList, now].slice(-30);

      const updated = await prisma.employee.update({
        where: { id: employee.id },
        data: {
          lastLogin: now,
          lastLogins: newList,
        },
      });

      updatedLastLogin = updated?.lastLogin ?? null;
      updatedLastLogins = updated?.lastLogins ?? [];
      console.debug(
        "lastLogins updated successfully for employee:",
        employee.id,
        "-> count:",
        updatedLastLogins.length
      );
    } catch (updateErr) {
      // Log but don't fail login if we can't update lastLogin history
      console.error(
        "Failed to update lastLogins for employee:",
        employee.id,
        updateErr
      );
    }

    // Return token and lastLogin/history so frontend can show it immediately without an extra fetch
    res
      .status(200)
      .json({
        token,
        lastLogin: updatedLastLogin,
        lastLogins: updatedLastLogins,
      });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "An error occurred in the sever during the login" });
  }
};
