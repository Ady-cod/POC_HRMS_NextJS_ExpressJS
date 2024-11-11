import prisma from "../lib/client";
import { Request , Response } from "express";

export const getAllLearningPaths = async(req : Request , res : Response) => {

    const learningPaths = await prisma.learningPath.findMany({
        include: {
            learningModules: true,
            employeeLearningPathProgress: true
        }
    });
    // console.log(learningPaths);
    // const learningPath = learningPaths[0];
    // console.log(learningPath.learningModules);
    
    res.status(200).json(learningPaths)
    
}