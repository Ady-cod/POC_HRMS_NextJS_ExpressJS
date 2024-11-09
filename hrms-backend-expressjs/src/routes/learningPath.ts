import express, { Router } from "express"
import { getAllLearningPaths } from "../controllers/learningPath";

const router : Router = express.Router();

router.route("/").get(getAllLearningPaths);

export default router;