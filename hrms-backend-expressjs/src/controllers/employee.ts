import prisma from "../lib/client";
import { Request , Response } from "express";

export const getAllEmployees = async(req : Request , res : Response) => {

    const employees = await prisma.employee.findMany({
      include: {
        employeeProjects: true,
        attendanceRecords: true,
        attendanceSummaries: true,
        department: true,
        EmployeeLearningPathProgress: true
      },
    });

    // console.log(employees);

    res.status(200).json(employees)
}

