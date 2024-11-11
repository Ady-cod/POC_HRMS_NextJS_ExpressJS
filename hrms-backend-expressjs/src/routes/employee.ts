import express, { Router } from "express";
import { getAllEmployees, createEmployee } from "../controllers/employee";

const router: Router = express.Router();

router.route("/")
    .get(getAllEmployees)
    .post(createEmployee);

export default router;
