import express, { Router } from "express";
import { getAllEmployees, createEmployee,deleteEmployee , updateEmployee } from "../controllers/employee";

const router: Router = express.Router();

router.route("/")
    .get(getAllEmployees)
    .post(createEmployee)

router.route("/:id")
.delete(deleteEmployee)    

router.route("/update/:id").post(updateEmployee);    

export default router;
