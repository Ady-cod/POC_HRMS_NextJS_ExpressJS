import "dotenv/config";

import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

type IdMap = Record<string, Record<string, string>>;

const prisma = new PrismaClient();
const MIGRATION_MAP_PATH = path.resolve(
  process.cwd(),
  "scripts",
  "migration-id-map.json"
);

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

const loadIdMap = async (): Promise<IdMap> => {
  try {
    const raw = await fs.readFile(MIGRATION_MAP_PATH, "utf8");
    return JSON.parse(raw) as IdMap;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
};

const saveIdMap = async (idMap: IdMap): Promise<void> => {
  await fs.writeFile(MIGRATION_MAP_PATH, JSON.stringify(idMap, null, 2));
};

const toObjectIdString = (value: unknown): string | null => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof ObjectId) return value.toHexString();
  return null;
};

const getOrCreateId = (
  idMap: IdMap,
  collection: string,
  oldId: unknown
): string => {
  const key = toObjectIdString(oldId);
  if (!key) {
    throw new Error(`Missing id for ${collection}`);
  }
  if (!idMap[collection]) {
    idMap[collection] = {};
  }
  if (!idMap[collection][key]) {
    idMap[collection][key] = randomUUID();
  }
  return idMap[collection][key];
};

const getMappedId = (
  idMap: IdMap,
  collection: string,
  oldId: unknown
): string | null => {
  const key = toObjectIdString(oldId);
  if (!key) return null;
  return idMap[collection]?.[key] ?? null;
};

const coerceDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  const dateValue = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(dateValue.getTime())) return undefined;
  return dateValue;
};

const logMissing = (collection: string, id: unknown, context: string): void => {
  const key = toObjectIdString(id);
  console.warn(
    `Skipping ${collection} reference (missing map) for ${context}: ${key}`
  );
};

const migrateDepartments = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const departments = db.collection("departments");
  for await (const department of departments.find()) {
    const departmentId = getOrCreateId(idMap, "departments", department._id);
    await prisma.department.upsert({
      where: { id: departmentId },
      update: {
        name: department.name,
        description: department.description ?? null,
        timezone: department.timezone ?? null,
        deptHeadEmployeeId: null,
        icon: department.icon ?? null,
        createdAt: coerceDate(department.createdAt),
        updatedAt: coerceDate(department.updatedAt),
      },
      create: {
        id: departmentId,
        name: department.name,
        description: department.description ?? null,
        timezone: department.timezone ?? null,
        deptHeadEmployeeId: null,
        icon: department.icon ?? null,
        createdAt: coerceDate(department.createdAt) ?? new Date(),
        updatedAt: coerceDate(department.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateEmployees = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const employees = db.collection("employees");
  for await (const employee of employees.find()) {
    const employeeId = getOrCreateId(idMap, "employees", employee._id);
    const departmentId = getMappedId(
      idMap,
      "departments",
      employee.departmentId
    );
    if (employee.departmentId && !departmentId) {
      logMissing("departments", employee.departmentId, "employee.departmentId");
    }

    await prisma.employee.upsert({
      where: { id: employeeId },
      update: {
        appId: employee.appId ?? null,
        fullName: employee.fullName,
        email: employee.email,
        password: employee.password,
        phoneNumber: employee.phoneNumber,
        country: employee.country,
        countryCode: employee.countryCode ?? null,
        city: employee.city,
        state: employee.state ?? null,
        stateCode: employee.stateCode ?? null,
        streetAddress: employee.streetAddress ?? null,
        birthDate: coerceDate(employee.birthDate),
        dateOfJoining: coerceDate(employee.dateOfJoining),
        gender: employee.gender,
        inductionCompleted: employee.inductionCompleted ?? false,
        profilePhotoUrl: employee.profilePhotoUrl ?? null,
        timezone: employee.timezone ?? null,
        role: employee.role,
        status: employee.status,
        departmentId: departmentId,
        lastLogin: coerceDate(employee.lastLogin),
        createdAt: coerceDate(employee.createdAt),
        updatedAt: coerceDate(employee.updatedAt),
      },
      create: {
        id: employeeId,
        appId: employee.appId ?? null,
        fullName: employee.fullName,
        email: employee.email,
        password: employee.password,
        phoneNumber: employee.phoneNumber,
        country: employee.country,
        countryCode: employee.countryCode ?? null,
        city: employee.city,
        state: employee.state ?? null,
        stateCode: employee.stateCode ?? null,
        streetAddress: employee.streetAddress ?? null,
        birthDate: coerceDate(employee.birthDate) ?? new Date(),
        dateOfJoining: coerceDate(employee.dateOfJoining) ?? new Date(),
        gender: employee.gender,
        inductionCompleted: employee.inductionCompleted ?? false,
        profilePhotoUrl: employee.profilePhotoUrl ?? null,
        timezone: employee.timezone ?? null,
        role: employee.role,
        status: employee.status,
        departmentId: departmentId,
        lastLogin: coerceDate(employee.lastLogin),
        createdAt: coerceDate(employee.createdAt) ?? new Date(),
        updatedAt: coerceDate(employee.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const updateDepartmentHeads = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const departments = db.collection("departments");
  for await (const department of departments.find()) {
    const departmentId = getMappedId(idMap, "departments", department._id);
    if (!departmentId) continue;
    const headId = getMappedId(
      idMap,
      "employees",
      department.deptHeadEmployeeId
    );
    if (department.deptHeadEmployeeId && !headId) {
      logMissing(
        "employees",
        department.deptHeadEmployeeId,
        "department.deptHeadEmployeeId"
      );
    }
    await prisma.department.update({
      where: { id: departmentId },
      data: {
        deptHeadEmployeeId: headId,
      },
    });
  }
};

const migrateProjects = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const projects = db.collection("projects");
  for await (const project of projects.find()) {
    const projectId = getOrCreateId(idMap, "projects", project._id);
    const status = project.status ?? "ACTIVE";
    await prisma.project.upsert({
      where: { id: projectId },
      update: {
        name: project.name,
        description: project.description ?? null,
        startDate: coerceDate(project.startDate),
        endDate: coerceDate(project.endDate),
        status,
        createdAt: coerceDate(project.createdAt),
        updatedAt: coerceDate(project.updatedAt),
      },
      create: {
        id: projectId,
        name: project.name,
        description: project.description ?? null,
        startDate: coerceDate(project.startDate),
        endDate: coerceDate(project.endDate),
        status,
        createdAt: coerceDate(project.createdAt) ?? new Date(),
        updatedAt: coerceDate(project.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateEmployeeProjects = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const employeeProjects = db.collection("employee_projects");
  for await (const employeeProject of employeeProjects.find()) {
    const employeeProjectId = getOrCreateId(
      idMap,
      "employee_projects",
      employeeProject._id
    );
    const employeeId = getMappedId(
      idMap,
      "employees",
      employeeProject.employeeId
    );
    const projectId = getMappedId(idMap, "projects", employeeProject.projectId);

    if (!employeeId || !projectId) {
      if (!employeeId) {
        logMissing(
          "employees",
          employeeProject.employeeId,
          "employeeProject.employeeId"
        );
      }
      if (!projectId) {
        logMissing(
          "projects",
          employeeProject.projectId,
          "employeeProject.projectId"
        );
      }
      continue;
    }

    await prisma.employeeProject.upsert({
      where: { id: employeeProjectId },
      update: {
        role: employeeProject.role,
        status: employeeProject.status ?? "ACTIVE",
        startDate: coerceDate(employeeProject.startDate),
        endDate: coerceDate(employeeProject.endDate),
        feedback: employeeProject.feedback ?? null,
        employeeId,
        projectId,
        createdAt: coerceDate(employeeProject.createdAt),
        updatedAt: coerceDate(employeeProject.updatedAt),
      },
      create: {
        id: employeeProjectId,
        role: employeeProject.role,
        status: employeeProject.status ?? "ACTIVE",
        startDate: coerceDate(employeeProject.startDate),
        endDate: coerceDate(employeeProject.endDate),
        feedback: employeeProject.feedback ?? null,
        employeeId,
        projectId,
        createdAt: coerceDate(employeeProject.createdAt) ?? new Date(),
        updatedAt: coerceDate(employeeProject.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migratePauseIntervals = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const pauseIntervals = db.collection("pause_intervals");
  for await (const pauseInterval of pauseIntervals.find()) {
    const pauseIntervalId = getOrCreateId(
      idMap,
      "pause_intervals",
      pauseInterval._id
    );
    const employeeProjectId = getMappedId(
      idMap,
      "employee_projects",
      pauseInterval.employeeProjectId
    );
    if (!employeeProjectId) {
      logMissing(
        "employee_projects",
        pauseInterval.employeeProjectId,
        "pauseInterval.employeeProjectId"
      );
      continue;
    }

    await prisma.pauseInterval.upsert({
      where: { id: pauseIntervalId },
      update: {
        startDate: coerceDate(pauseInterval.startDate),
        endDate: coerceDate(pauseInterval.endDate),
        employeeProjectId,
        createdAt: coerceDate(pauseInterval.createdAt),
        updatedAt: coerceDate(pauseInterval.updatedAt),
      },
      create: {
        id: pauseIntervalId,
        startDate: coerceDate(pauseInterval.startDate) ?? new Date(),
        endDate: coerceDate(pauseInterval.endDate),
        employeeProjectId,
        createdAt: coerceDate(pauseInterval.createdAt) ?? new Date(),
        updatedAt: coerceDate(pauseInterval.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateLearningPaths = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const learningPaths = db.collection("learning_paths");
  for await (const learningPath of learningPaths.find()) {
    const learningPathId = getOrCreateId(
      idMap,
      "learning_paths",
      learningPath._id
    );
    await prisma.learningPath.upsert({
      where: { id: learningPathId },
      update: {
        name: learningPath.name,
        description: learningPath.description ?? null,
        createdAt: coerceDate(learningPath.createdAt),
        updatedAt: coerceDate(learningPath.updatedAt),
      },
      create: {
        id: learningPathId,
        name: learningPath.name,
        description: learningPath.description ?? null,
        createdAt: coerceDate(learningPath.createdAt) ?? new Date(),
        updatedAt: coerceDate(learningPath.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateLearningModules = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const learningModules = db.collection("learning_modules");
  for await (const learningModule of learningModules.find()) {
    const learningModuleId = getOrCreateId(
      idMap,
      "learning_modules",
      learningModule._id
    );
    const learningPathId = getMappedId(
      idMap,
      "learning_paths",
      learningModule.learningPathId
    );
    if (!learningPathId) {
      logMissing(
        "learning_paths",
        learningModule.learningPathId,
        "learningModule.learningPathId"
      );
      continue;
    }

    await prisma.learningModule.upsert({
      where: { id: learningModuleId },
      update: {
        title: learningModule.title,
        contentUrl: learningModule.contentUrl ?? null,
        estimatedTime: learningModule.estimatedTime ?? null,
        learningPathId,
        createdAt: coerceDate(learningModule.createdAt),
        updatedAt: coerceDate(learningModule.updatedAt),
      },
      create: {
        id: learningModuleId,
        title: learningModule.title,
        contentUrl: learningModule.contentUrl ?? null,
        estimatedTime: learningModule.estimatedTime ?? null,
        learningPathId,
        createdAt: coerceDate(learningModule.createdAt) ?? new Date(),
        updatedAt: coerceDate(learningModule.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateEmployeeLearningPathProgress = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const progressCollection = db.collection("employee_learning_path_progress");
  for await (const progress of progressCollection.find()) {
    const progressId = getOrCreateId(
      idMap,
      "employee_learning_path_progress",
      progress._id
    );
    const employeeId = getMappedId(idMap, "employees", progress.employeeId);
    const learningPathId = getMappedId(
      idMap,
      "learning_paths",
      progress.learningPathId
    );
    if (!employeeId || !learningPathId) {
      if (!employeeId) {
        logMissing(
          "employees",
          progress.employeeId,
          "employeeLearningPathProgress.employeeId"
        );
      }
      if (!learningPathId) {
        logMissing(
          "learning_paths",
          progress.learningPathId,
          "employeeLearningPathProgress.learningPathId"
        );
      }
      continue;
    }

    await prisma.employeeLearningPathProgress.upsert({
      where: { id: progressId },
      update: {
        completionStatus: progress.completionStatus ?? "IN_PROGRESS",
        employeeId,
        learningPathId,
        createdAt: coerceDate(progress.createdAt),
        updatedAt: coerceDate(progress.updatedAt),
      },
      create: {
        id: progressId,
        completionStatus: progress.completionStatus ?? "IN_PROGRESS",
        employeeId,
        learningPathId,
        createdAt: coerceDate(progress.createdAt) ?? new Date(),
        updatedAt: coerceDate(progress.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateModuleProgress = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const progressCollection = db.collection("module_progress");
  for await (const progress of progressCollection.find()) {
    const progressId = getOrCreateId(idMap, "module_progress", progress._id);
    const learningModuleId = getMappedId(
      idMap,
      "learning_modules",
      progress.learningModuleId
    );
    const employeeLearningPathProgressId = getMappedId(
      idMap,
      "employee_learning_path_progress",
      progress.employeeLearningPathProgressId
    );
    if (!learningModuleId || !employeeLearningPathProgressId) {
      if (!learningModuleId) {
        logMissing(
          "learning_modules",
          progress.learningModuleId,
          "moduleProgress.learningModuleId"
        );
      }
      if (!employeeLearningPathProgressId) {
        logMissing(
          "employee_learning_path_progress",
          progress.employeeLearningPathProgressId,
          "moduleProgress.employeeLearningPathProgressId"
        );
      }
      continue;
    }

    await prisma.moduleProgress.upsert({
      where: { id: progressId },
      update: {
        completionStatus: progress.completionStatus ?? "NOT_STARTED",
        startDate: coerceDate(progress.startDate),
        completionDate: coerceDate(progress.completionDate),
        learningModuleId,
        employeeLearningPathProgressId,
        createdAt: coerceDate(progress.createdAt),
        updatedAt: coerceDate(progress.updatedAt),
      },
      create: {
        id: progressId,
        completionStatus: progress.completionStatus ?? "NOT_STARTED",
        startDate: coerceDate(progress.startDate),
        completionDate: coerceDate(progress.completionDate),
        learningModuleId,
        employeeLearningPathProgressId,
        createdAt: coerceDate(progress.createdAt) ?? new Date(),
        updatedAt: coerceDate(progress.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateAttendance = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const attendance = db.collection("attendances");
  for await (const record of attendance.find()) {
    const attendanceId = getOrCreateId(idMap, "attendances", record._id);
    const employeeId = getMappedId(idMap, "employees", record.employeeId);
    if (!employeeId) {
      logMissing("employees", record.employeeId, "attendance.employeeId");
      continue;
    }

    await prisma.attendance.upsert({
      where: { id: attendanceId },
      update: {
        date: coerceDate(record.date),
        status: record.status,
        checkInTime: coerceDate(record.checkInTime),
        checkOutTime: coerceDate(record.checkOutTime),
        employeeId,
        createdAt: coerceDate(record.createdAt),
        updatedAt: coerceDate(record.updatedAt),
      },
      create: {
        id: attendanceId,
        date: coerceDate(record.date) ?? new Date(),
        status: record.status,
        checkInTime: coerceDate(record.checkInTime),
        checkOutTime: coerceDate(record.checkOutTime),
        employeeId,
        createdAt: coerceDate(record.createdAt) ?? new Date(),
        updatedAt: coerceDate(record.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateAttendanceSummaries = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const attendanceSummaries = db.collection("attendance_summaries");
  for await (const summary of attendanceSummaries.find()) {
    const summaryId = getOrCreateId(idMap, "attendance_summaries", summary._id);
    const employeeId = getMappedId(idMap, "employees", summary.employeeId);
    if (!employeeId) {
      logMissing(
        "employees",
        summary.employeeId,
        "attendanceSummary.employeeId"
      );
      continue;
    }

    await prisma.attendanceSummary.upsert({
      where: { id: summaryId },
      update: {
        employeeId,
        month: summary.month,
        year: summary.year,
        presentDays: summary.presentDays,
        absentDays: summary.absentDays,
        leaveDays: summary.leaveDays,
        createdAt: coerceDate(summary.createdAt),
        updatedAt: coerceDate(summary.updatedAt),
      },
      create: {
        id: summaryId,
        employeeId,
        month: summary.month,
        year: summary.year,
        presentDays: summary.presentDays,
        absentDays: summary.absentDays,
        leaveDays: summary.leaveDays,
        createdAt: coerceDate(summary.createdAt) ?? new Date(),
        updatedAt: coerceDate(summary.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateApplicants = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const applicants = db.collection("applicants");
  for await (const applicant of applicants.find()) {
    const applicantId = getOrCreateId(idMap, "applicants", applicant._id);
    const departmentId = getMappedId(
      idMap,
      "departments",
      applicant.departmentId
    );
    const createdById = getMappedId(idMap, "employees", applicant.createdById);
    const lastEditedById = getMappedId(
      idMap,
      "employees",
      applicant.lastEditedById
    );
    const sourceAddedById = getMappedId(
      idMap,
      "employees",
      applicant.applicationSourceAddedById
    );

    await prisma.applicant.upsert({
      where: { id: applicantId },
      update: {
        appId: applicant.appId ?? null,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        country: applicant.country,
        educationStatus: applicant.educationStatus ?? null,
        appliedAt: coerceDate(applicant.appliedAt),
        status: applicant.status,
        departmentId: departmentId,
        resumeUrl: applicant.resumeUrl ?? null,
        applicationSourceType: applicant.applicationSourceType ?? null,
        applicationSourceNotes: applicant.applicationSourceNotes ?? null,
        applicationSourceAddedById: sourceAddedById,
        createdById: createdById,
        lastEditedById: lastEditedById,
        createdAt: coerceDate(applicant.createdAt),
        updatedAt: coerceDate(applicant.updatedAt),
      },
      create: {
        id: applicantId,
        appId: applicant.appId ?? null,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        country: applicant.country,
        educationStatus: applicant.educationStatus ?? null,
        appliedAt: coerceDate(applicant.appliedAt) ?? new Date(),
        status: applicant.status,
        departmentId: departmentId,
        resumeUrl: applicant.resumeUrl ?? null,
        applicationSourceType: applicant.applicationSourceType ?? null,
        applicationSourceNotes: applicant.applicationSourceNotes ?? null,
        applicationSourceAddedById: sourceAddedById,
        createdById: createdById,
        lastEditedById: lastEditedById,
        createdAt: coerceDate(applicant.createdAt) ?? new Date(),
        updatedAt: coerceDate(applicant.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateApplicantInterviews = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const interviews = db.collection("applicant_interviews");
  for await (const interview of interviews.find()) {
    const interviewId = getOrCreateId(
      idMap,
      "applicant_interviews",
      interview._id
    );
    const applicantId = getMappedId(idMap, "applicants", interview.applicantId);
    if (!applicantId) {
      logMissing(
        "applicants",
        interview.applicantId,
        "applicantInterview.applicantId"
      );
      continue;
    }

    await prisma.applicantInterview.upsert({
      where: { id: interviewId },
      update: {
        appId: interview.appId ?? null,
        date: coerceDate(interview.date),
        result: interview.result ?? null,
        feedback: interview.feedback ?? null,
        applicantId,
        createdAt: coerceDate(interview.createdAt),
        updatedAt: coerceDate(interview.updatedAt),
      },
      create: {
        id: interviewId,
        appId: interview.appId ?? null,
        date: coerceDate(interview.date) ?? new Date(),
        result: interview.result ?? null,
        feedback: interview.feedback ?? null,
        applicantId,
        createdAt: coerceDate(interview.createdAt) ?? new Date(),
        updatedAt: coerceDate(interview.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateApplicantInterviewers = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const interviewers = db.collection("applicant_interviewers");
  for await (const interviewer of interviewers.find()) {
    const applicantInterviewId = getMappedId(
      idMap,
      "applicant_interviews",
      interviewer.applicantInterviewId
    );
    const employeeId = getMappedId(idMap, "employees", interviewer.employeeId);
    if (!applicantInterviewId || !employeeId) {
      if (!applicantInterviewId) {
        logMissing(
          "applicant_interviews",
          interviewer.applicantInterviewId,
          "applicantInterviewer.applicantInterviewId"
        );
      }
      if (!employeeId) {
        logMissing(
          "employees",
          interviewer.employeeId,
          "applicantInterviewer.employeeId"
        );
      }
      continue;
    }

    await prisma.applicantInterviewer.upsert({
      where: {
        applicantInterviewId_employeeId: {
          applicantInterviewId,
          employeeId,
        },
      },
      update: {},
      create: {
        applicantInterviewId,
        employeeId,
      },
    });
  }
};

const migrateApplicantRemarks = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const remarks = db.collection("applicant_remarks");
  for await (const remark of remarks.find()) {
    const remarkId = getOrCreateId(idMap, "applicant_remarks", remark._id);
    const applicantId = getMappedId(idMap, "applicants", remark.applicantId);
    if (!applicantId) {
      logMissing(
        "applicants",
        remark.applicantId,
        "applicantRemark.applicantId"
      );
      continue;
    }

    const authorId = getMappedId(idMap, "employees", remark.authorId);
    await prisma.applicantRemark.upsert({
      where: { id: remarkId },
      update: {
        appId: remark.appId ?? null,
        timestamp: coerceDate(remark.timestamp),
        authorId,
        applicantId,
        text: remark.text,
        createdAt: coerceDate(remark.createdAt),
        updatedAt: coerceDate(remark.updatedAt),
      },
      create: {
        id: remarkId,
        appId: remark.appId ?? null,
        timestamp: coerceDate(remark.timestamp) ?? new Date(),
        authorId,
        applicantId,
        text: remark.text,
        createdAt: coerceDate(remark.createdAt) ?? new Date(),
        updatedAt: coerceDate(remark.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateApplicantEditHistory = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const editHistory = db.collection("applicant_edit_history");
  for await (const history of editHistory.find()) {
    const historyId = getOrCreateId(
      idMap,
      "applicant_edit_history",
      history._id
    );
    const applicantId = getMappedId(idMap, "applicants", history.applicantId);
    if (!applicantId) {
      logMissing(
        "applicants",
        history.applicantId,
        "applicantEditHistory.applicantId"
      );
      continue;
    }

    const editedById = getMappedId(idMap, "employees", history.editedById);
    await prisma.applicantEditHistory.upsert({
      where: { id: historyId },
      update: {
        timestamp: coerceDate(history.timestamp),
        applicantId,
        editedById,
        changes: history.changes,
        createdAt: coerceDate(history.createdAt),
        updatedAt: coerceDate(history.updatedAt),
      },
      create: {
        id: historyId,
        timestamp: coerceDate(history.timestamp) ?? new Date(),
        applicantId,
        editedById,
        changes: history.changes,
        createdAt: coerceDate(history.createdAt) ?? new Date(),
        updatedAt: coerceDate(history.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateLeaveBalances = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const leaveBalances = db.collection("leave_balances");
  for await (const balance of leaveBalances.find()) {
    const balanceId = getOrCreateId(idMap, "leave_balances", balance._id);
    const employeeId = getMappedId(idMap, "employees", balance.employeeId);
    if (!employeeId) {
      logMissing("employees", balance.employeeId, "leaveBalance.employeeId");
      continue;
    }

    await prisma.leaveBalance.upsert({
      where: { id: balanceId },
      update: {
        casual: balance.casual ?? 0,
        sick: balance.sick ?? 0,
        earned: balance.earned ?? 0,
        employeeId,
        createdAt: coerceDate(balance.createdAt),
        updatedAt: coerceDate(balance.updatedAt),
      },
      create: {
        id: balanceId,
        casual: balance.casual ?? 0,
        sick: balance.sick ?? 0,
        earned: balance.earned ?? 0,
        employeeId,
        createdAt: coerceDate(balance.createdAt) ?? new Date(),
        updatedAt: coerceDate(balance.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const migrateEmployeeRemarks = async (
  db: ReturnType<MongoClient["db"]>,
  idMap: IdMap
): Promise<void> => {
  const remarks = db.collection("employee_remarks");
  for await (const remark of remarks.find()) {
    const remarkId = getOrCreateId(idMap, "employee_remarks", remark._id);
    const employeeId = getMappedId(idMap, "employees", remark.employeeId);
    if (!employeeId) {
      logMissing("employees", remark.employeeId, "employeeRemark.employeeId");
      continue;
    }
    const authorId = getMappedId(idMap, "employees", remark.authorId);
    await prisma.employeeRemark.upsert({
      where: { id: remarkId },
      update: {
        appId: remark.appId ?? null,
        employeeId,
        authorId,
        timestamp: coerceDate(remark.timestamp),
        type: remark.type,
        text: remark.text,
        relatedDocumentUrl: remark.relatedDocumentUrl ?? null,
        createdAt: coerceDate(remark.createdAt),
        updatedAt: coerceDate(remark.updatedAt),
      },
      create: {
        id: remarkId,
        appId: remark.appId ?? null,
        employeeId,
        authorId,
        timestamp: coerceDate(remark.timestamp) ?? new Date(),
        type: remark.type,
        text: remark.text,
        relatedDocumentUrl: remark.relatedDocumentUrl ?? null,
        createdAt: coerceDate(remark.createdAt) ?? new Date(),
        updatedAt: coerceDate(remark.updatedAt) ?? new Date(),
      },
    });
  }
  await saveIdMap(idMap);
};

const run = async (): Promise<void> => {
  const mongoUrl = getMongoUrl();
  const mongoDbName = getMongoDbName(mongoUrl);
  const idMap = await loadIdMap();

  const mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  const db = mongoClient.db(mongoDbName);

  try {
    console.log("Starting migration...");
    await migrateDepartments(db, idMap);
    await migrateEmployees(db, idMap);
    await updateDepartmentHeads(db, idMap);
    await migrateProjects(db, idMap);
    await migrateEmployeeProjects(db, idMap);
    await migratePauseIntervals(db, idMap);
    await migrateLearningPaths(db, idMap);
    await migrateLearningModules(db, idMap);
    await migrateEmployeeLearningPathProgress(db, idMap);
    await migrateModuleProgress(db, idMap);
    await migrateAttendance(db, idMap);
    await migrateAttendanceSummaries(db, idMap);
    await migrateApplicants(db, idMap);
    await migrateApplicantInterviews(db, idMap);
    await migrateApplicantInterviewers(db, idMap);
    await migrateApplicantRemarks(db, idMap);
    await migrateApplicantEditHistory(db, idMap);
    await migrateLeaveBalances(db, idMap);
    await migrateEmployeeRemarks(db, idMap);
    console.log("Migration completed.");
  } finally {
    await saveIdMap(idMap);
    await mongoClient.close();
    await prisma.$disconnect();
  }
};

run().catch((error) => {
  console.error("Migration failed:", error);
  prisma
    .$disconnect()
    .catch(() => undefined)
    .finally(() => process.exit(1));
});
