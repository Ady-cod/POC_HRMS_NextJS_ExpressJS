import { Request, Response } from "express";
import prisma from "../lib/client";
import { z } from "zod";
import { createDepartmentSchema, updateDepartmentSchema } from "../schemas/departmentSchema";
import { Prisma } from "@prisma/client";


// GET all departments
export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany();
    const departmentsWithHeadName = await Promise.all(
      departments.map(async (dept) => {
        let headName = "Unknown";
        if (dept.deptHeadEmployeeId) {
          const head = await prisma.employee.findUnique({
            where: { id: dept.deptHeadEmployeeId },
            select: { fullName: true },
          });
          if (head) headName = head.fullName;
        }
        return { ...dept, headName };
      })
    );
    res.status(200).json(departmentsWithHeadName);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch departments", error });
  }
};

// GET department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = await prisma.department.findUnique({ where: { id } });

    if (!department) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch department", error });
  }
};

// CREATE department
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const parsed = await createDepartmentSchema.parseAsync(req.body);

    let deptHeadEmployeeId: string | null = null;
    if (parsed.headOfDep) {
      const employeeExists = await prisma.employee.findUnique({ where: { id: parsed.headOfDep } });
      if (!employeeExists) {
        res.status(400).json({ error: "Head of department not found among employees" });
        return;
      }
      deptHeadEmployeeId = parsed.headOfDep;
    }

    const department = await prisma.department.create({
      data: {
        name: parsed.name,
        description: parsed.description ?? null,
        deptHeadEmployeeId,
        icon: parsed.icon ?? null,
      },
    });

    res.status(201).json({ success: true, department });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ zodError: error });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({ error: "A department with this name already exists." });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error." });
    return;
  }
};

// UPDATE department
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = await updateDepartmentSchema.parseAsync(req.body);

    const { headOfDep, ...departmentData } = validatedData;

    // Check headOfDep if provided
    let deptHeadEmployeeId: string | undefined = undefined;
    if (headOfDep) {
      const employeeExists = await prisma.employee.findUnique({ where: { id: headOfDep } });
      if (!employeeExists) {
        res.status(400).json({ success: false, error: "Head of department not found among employees" });
        return;
      }
      deptHeadEmployeeId = headOfDep;
    }

    // Get current department from DB
    const currentDepartment = await prisma.department.findUnique({ where: { id } });
    if (!currentDepartment) {
      res.status(404).json({ success: false, error: "Department not found" });
      return;
    }

    // Prepare update data
    const updateData = {
      name: departmentData.name ?? currentDepartment.name, // always required
      description: departmentData.description ?? currentDepartment.description,
      deptHeadEmployeeId: deptHeadEmployeeId ?? currentDepartment.deptHeadEmployeeId,
      icon: departmentData.icon ?? currentDepartment.icon,
    };

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, department: updatedDepartment });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, zodError: error });
      return;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({ success: false, error: "A department with this name already exists." });
        return;
      }
      res.status(500).json({ success: false, error: "Database error occurred." });
      return;
    }
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error." });
    return;
  }
};

// DELETE department
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.department.delete({ where: { id } });
    res.status(200).json({ message: "Department deleted successfully." });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record not found
        res.status(404).json({ error: "Department not found." });
        return;
      }
      res.status(500).json({ error: "Database error occurred." });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};