import prisma from "../lib/client";
import { Request, Response } from "express";
import { LearningPath } from "@prisma/client";

export const getAllLearningPaths = async(req : Request , res : Response): Promise<void> => {
    try {
        const learningPaths: LearningPath[] = await prisma.learningPath.findMany({
            include: {
                learningModules: true,
                employeeLearningPathProgress: true
            }
        });
        // console.log(learningPaths);
        // const learningPath = learningPaths[0];
        // console.log(learningPath.learningModules);
        
        res.status(200).json(learningPaths)
    } catch (error) {
        console.error("Error fetching learning paths:", error);
        res.status(500).json({ error: "Failed to fetch learning paths" });
    }
    
}