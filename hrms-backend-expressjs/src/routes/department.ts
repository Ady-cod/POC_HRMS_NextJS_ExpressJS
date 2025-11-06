import express, { Router } from "express";
import {
  getDepartmentById,
  getAllDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../controllers/department";

const router: Router = express.Router();

router
    .route("/")
    .get(getAllDepartments)
    .post(createDepartment);

router
  .route("/:id")
  .get(getDepartmentById)
  .delete(deleteDepartment)
  .patch(updateDepartment);

export default router;