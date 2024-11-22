import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import employeeRouter from "./routes/employee";
import learningPathRouter from "./routes/learningPath";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable All CORS Requests
app.use(cors())

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, HRMS Backend with TypeScript!");
});

app.use("/api/v1/employee" , employeeRouter);
app.use("/api/v1/learningPath" , learningPathRouter);

app.listen(PORT, () => {
  console.log(`Server is working in the ${process.env.NODE_ENV} mode`);
  console.log(`Server is running at http://localhost:${PORT}`);
});
