import express, { Router } from "express";
import { getAllEmployees, createEmployee,deleteEmployee, updateEmployee } from "../controllers/employee";

const router: Router = express.Router();

router.route("/")
    .get(getAllEmployees)
    .post(createEmployee);

router.route("/:id")
    .delete(deleteEmployee)
    .patch(updateEmployee); 

export default router;
