import express, { Router } from "express";
import { getAllEmployees, createEmployee,deleteEmployee } from "../controllers/employee";

const router: Router = express.Router();

router.route("/")
    .get(getAllEmployees)
    .post(createEmployee)

router.route("/:id")
.delete(deleteEmployee)    

export default router;
