import "dotenv/config";

import { MongoClient } from "mongodb";
import { PrismaClient } from "@prisma/client";

type CountCheck = {
  name: string;
  mongoCollection: string;
  prismaCount: () => Promise<number>;
};

const prisma = new PrismaClient();

const getMongoUrl = (): string => {
  const url =
    process.env.MONGO_DATABASE_URL ||
    process.env.MONGODB_URL ||
    process.env.MONGO_URL;
  if (!url) {
    throw new Error(
      "Missing MongoDB URL. Set MONGO_DATABASE_URL in your .env."
    );
  }
  return url;
};

const getMongoDbName = (mongoUrl: string): string => {
  if (process.env.MONGO_DATABASE_NAME) {
    return process.env.MONGO_DATABASE_NAME;
  }
  const parsed = new URL(mongoUrl);
  const pathname = parsed.pathname.replace("/", "");
  if (!pathname) {
    throw new Error(
      "Mongo database name not found in URL. Set MONGO_DATABASE_NAME."
    );
  }
  return pathname;
};

const checks: CountCheck[] = [
  {
    name: "employees",
    mongoCollection: "employees",
    prismaCount: () => prisma.employee.count(),
  },
  {
    name: "departments",
    mongoCollection: "departments",
    prismaCount: () => prisma.department.count(),
  },
  {
    name: "projects",
    mongoCollection: "projects",
    prismaCount: () => prisma.project.count(),
  },
  {
    name: "employee_projects",
    mongoCollection: "employee_projects",
    prismaCount: () => prisma.employeeProject.count(),
  },
  {
    name: "pause_intervals",
    mongoCollection: "pause_intervals",
    prismaCount: () => prisma.pauseInterval.count(),
  },
  {
    name: "learning_paths",
    mongoCollection: "learning_paths",
    prismaCount: () => prisma.learningPath.count(),
  },
  {
    name: "learning_modules",
    mongoCollection: "learning_modules",
    prismaCount: () => prisma.learningModule.count(),
  },
  {
    name: "employee_learning_path_progress",
    mongoCollection: "employee_learning_path_progress",
    prismaCount: () => prisma.employeeLearningPathProgress.count(),
  },
  {
    name: "module_progress",
    mongoCollection: "module_progress",
    prismaCount: () => prisma.moduleProgress.count(),
  },
  {
    name: "attendances",
    mongoCollection: "attendances",
    prismaCount: () => prisma.attendance.count(),
  },
  {
    name: "attendance_summaries",
    mongoCollection: "attendance_summaries",
    prismaCount: () => prisma.attendanceSummary.count(),
  },
  {
    name: "applicants",
    mongoCollection: "applicants",
    prismaCount: () => prisma.applicant.count(),
  },
  {
    name: "applicant_interviews",
    mongoCollection: "applicant_interviews",
    prismaCount: () => prisma.applicantInterview.count(),
  },
  {
    name: "applicant_interviewers",
    mongoCollection: "applicant_interviewers",
    prismaCount: () => prisma.applicantInterviewer.count(),
  },
  {
    name: "applicant_remarks",
    mongoCollection: "applicant_remarks",
    prismaCount: () => prisma.applicantRemark.count(),
  },
  {
    name: "applicant_edit_history",
    mongoCollection: "applicant_edit_history",
    prismaCount: () => prisma.applicantEditHistory.count(),
  },
  {
    name: "leave_balances",
    mongoCollection: "leave_balances",
    prismaCount: () => prisma.leaveBalance.count(),
  },
  {
    name: "employee_remarks",
    mongoCollection: "employee_remarks",
    prismaCount: () => prisma.employeeRemark.count(),
  },
];

const run = async (): Promise<void> => {
  const mongoUrl = getMongoUrl();
  const mongoDbName = getMongoDbName(mongoUrl);
  const mongoClient = new MongoClient(mongoUrl);

  await mongoClient.connect();
  const db = mongoClient.db(mongoDbName);

  let mismatchCount = 0;
  for (const check of checks) {
    const mongoCount = await db
      .collection(check.mongoCollection)
      .countDocuments();
    const postgresCount = await check.prismaCount();
    const matches = mongoCount === postgresCount;
    if (!matches) {
      mismatchCount += 1;
    }
    console.log(
      `${check.name}: mongo=${mongoCount} postgres=${postgresCount} ${
        matches ? "OK" : "MISMATCH"
      }`
    );
  }

  await mongoClient.close();
  await prisma.$disconnect();

  if (mismatchCount > 0) {
    process.exitCode = 1;
    console.error(`Count mismatches detected: ${mismatchCount}`);
  } else {
    console.log("All collection counts match.");
  }
};

run().catch((error) => {
  console.error("Validation failed:", error);
  prisma
    .$disconnect()
    .catch(() => undefined)
    .finally(() => process.exit(1));
});
