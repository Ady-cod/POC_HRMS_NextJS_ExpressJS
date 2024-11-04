import express, { Router } from "express"
import { getAllEmployees } from "../controllers/employee";

const router : Router = express.Router();

router.route("/").get(getAllEmployees);

export default router;