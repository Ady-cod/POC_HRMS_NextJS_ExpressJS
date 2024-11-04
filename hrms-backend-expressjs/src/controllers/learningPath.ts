import prisma from "../lib/client";
import { Request , Response } from "express";

export const getAllLearningPaths = async(req : Request , res : Response) => {

    const learningPaths = await prisma.learningPath.findMany();
    console.log(learningPaths);
    const learningPath = learningPaths;
    console.log(learningPath);
    
    res.status(200).json(learningPaths)
    
}