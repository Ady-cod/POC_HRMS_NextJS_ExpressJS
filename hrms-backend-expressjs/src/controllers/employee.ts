import prisma from "../lib/client";
import { Request, Response } from "express";
import {
  EmployeeRole,
  EmployeeStatus,
  EmployeeGender,
  CreateEmployeeInput,
  CreateEmployeePrismaData,
} from "../types/types";
import { Employee } from "@prisma/client";

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        employeeProjects: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        department: {
          select: {
            id: true,
            name: true, 
          }
        },
      },
    });

    // console.log("Employees:", employees);

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }

};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      password,
      country,
      city,
      streetAddress,
      phoneNumber,
      birthDate,
      dateOfJoining,
      gender,
      inductionCompleted,
      profilePhotoUrl,
      timezone,
      role,
      status,
      departmentId,
    }: CreateEmployeeInput = req.body;

    // console.log("Request Body:", req.body);
    // console.log("fullName:", fullName);
    // console.log("email:", email);

    if (!fullName || !email) {
      res.status(400).json({ error: "First name and email are required." });
      return;
    }

    // Prepare the data to handle undefined -> default or null conversion for Prisma compatibility
    const newEmployeeData: CreateEmployeePrismaData = {
      fullName,
      email,
      password: password || null,
      country: country || null,
      city: city || null,
      streetAddress: streetAddress || null,
      phoneNumber: phoneNumber || null,
      birthDate: birthDate || null,
      dateOfJoining: dateOfJoining || null,
      gender: gender || EmployeeGender.OTHER,
      inductionCompleted: inductionCompleted ?? false,
      profilePhotoUrl: profilePhotoUrl || null,
      timezone: timezone || null,
      role: role || EmployeeRole.EMPLOYEE,
      status: status || EmployeeStatus.ACTIVE,
      departmentId: departmentId || null,
    };

    // Create the employee
    const newEmployee: Employee = await prisma.employee.create({
      data: newEmployeeData,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Failed to create employee" });
  }
};

export const updateEmployee = async(req :Request , res :Response) : Promise<void> => {
  
}