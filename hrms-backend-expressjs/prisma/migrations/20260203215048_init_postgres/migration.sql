-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'INTERN', 'HR_INTERN', 'HR_EMPLOYEE', 'HR_MANAGER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PLANNED');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('DEVELOPER', 'SCRUM_MASTER', 'UI_UX_DESIGNER', 'BUSINESS_ANALYST', 'PROJECT_MANAGER', 'QUALITY_ASSURANCE', 'TECHNICAL_LEAD');

-- CreateEnum
CREATE TYPE "EmployeeProjectStatus" AS ENUM ('ACTIVE', 'PAUSED', 'LEFT');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "LearningStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ApplicationSourceType" AS ENUM ('LINKEDIN', 'REFERRAL', 'MANUAL', 'CAREER_PORTAL', 'CAMPUS', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicantStatus" AS ENUM ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SCHEDULED', 'SELECTED', 'ON_HOLD', 'OFFER_LETTER', 'REJECTED');

-- CreateEnum
CREATE TYPE "InterviewResult" AS ENUM ('PASS', 'FAIL', 'ON_HOLD', 'NO_SHOW', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmployeeRemarkType" AS ENUM ('PERFORMANCE', 'BEHAVIOR', 'ATTENDANCE', 'COMPLIANCE', 'DISCIPLINARY', 'GENERAL');

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "appId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "stateCode" TEXT,
    "streetAddress" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "dateOfJoining" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "inductionCompleted" BOOLEAN NOT NULL DEFAULT false,
    "profilePhotoUrl" TEXT,
    "timezone" TEXT,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "departmentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "timezone" TEXT,
    "deptHeadEmployeeId" UUID,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_projects" (
    "id" UUID NOT NULL,
    "role" "ProjectRole" NOT NULL,
    "status" "EmployeeProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "feedback" TEXT,
    "employeeId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "employeeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_summaries" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "presentDays" INTEGER NOT NULL,
    "absentDays" INTEGER NOT NULL,
    "leaveDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pause_intervals" (
    "id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "employeeProjectId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pause_intervals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_modules" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "contentUrl" TEXT,
    "estimatedTime" INTEGER,
    "learningPathId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_learning_path_progress" (
    "id" UUID NOT NULL,
    "completionStatus" "LearningStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "employeeId" UUID NOT NULL,
    "learningPathId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_learning_path_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_progress" (
    "id" UUID NOT NULL,
    "completionStatus" "LearningStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "learningModuleId" UUID NOT NULL,
    "employeeLearningPathProgressId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_balances" (
    "id" UUID NOT NULL,
    "casual" INTEGER NOT NULL DEFAULT 0,
    "sick" INTEGER NOT NULL DEFAULT 0,
    "earned" INTEGER NOT NULL DEFAULT 0,
    "employeeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_remarks" (
    "id" UUID NOT NULL,
    "appId" TEXT,
    "employeeId" UUID NOT NULL,
    "authorId" UUID,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EmployeeRemarkType" NOT NULL,
    "text" TEXT NOT NULL,
    "relatedDocumentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_remarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicants" (
    "id" UUID NOT NULL,
    "appId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "educationStatus" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL,
    "status" "ApplicantStatus" NOT NULL,
    "departmentId" UUID,
    "resumeUrl" TEXT,
    "applicationSourceType" "ApplicationSourceType",
    "applicationSourceNotes" TEXT,
    "applicationSourceAddedById" UUID,
    "createdById" UUID,
    "lastEditedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_interviews" (
    "id" UUID NOT NULL,
    "appId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "result" "InterviewResult",
    "feedback" TEXT,
    "applicantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_interviewers" (
    "applicantInterviewId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,

    CONSTRAINT "applicant_interviewers_pkey" PRIMARY KEY ("applicantInterviewId","employeeId")
);

-- CreateTable
CREATE TABLE "applicant_remarks" (
    "id" UUID NOT NULL,
    "appId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" UUID,
    "applicantId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_remarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_edit_history" (
    "id" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicantId" UUID NOT NULL,
    "editedById" UUID,
    "changes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicant_edit_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "employees_departmentId_idx" ON "employees"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_deptHeadEmployeeId_key" ON "departments"("deptHeadEmployeeId");

-- CreateIndex
CREATE INDEX "employee_projects_employeeId_idx" ON "employee_projects"("employeeId");

-- CreateIndex
CREATE INDEX "employee_projects_projectId_idx" ON "employee_projects"("projectId");

-- CreateIndex
CREATE INDEX "employee_projects_employeeId_projectId_idx" ON "employee_projects"("employeeId", "projectId");

-- CreateIndex
CREATE INDEX "attendances_employeeId_idx" ON "attendances"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_employeeId_date_key" ON "attendances"("employeeId", "date");

-- CreateIndex
CREATE INDEX "attendance_summaries_month_year_idx" ON "attendance_summaries"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_summaries_employeeId_month_year_key" ON "attendance_summaries"("employeeId", "month", "year");

-- CreateIndex
CREATE INDEX "pause_intervals_employeeProjectId_idx" ON "pause_intervals"("employeeProjectId");

-- CreateIndex
CREATE INDEX "learning_modules_learningPathId_idx" ON "learning_modules"("learningPathId");

-- CreateIndex
CREATE INDEX "employee_learning_path_progress_learningPathId_idx" ON "employee_learning_path_progress"("learningPathId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_learning_path_progress_employeeId_learningPathId_key" ON "employee_learning_path_progress"("employeeId", "learningPathId");

-- CreateIndex
CREATE INDEX "module_progress_learningModuleId_idx" ON "module_progress"("learningModuleId");

-- CreateIndex
CREATE INDEX "module_progress_employeeLearningPathProgressId_idx" ON "module_progress"("employeeLearningPathProgressId");

-- CreateIndex
CREATE UNIQUE INDEX "module_progress_employeeLearningPathProgressId_learningModu_key" ON "module_progress"("employeeLearningPathProgressId", "learningModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "leave_balances_employeeId_key" ON "leave_balances"("employeeId");

-- CreateIndex
CREATE INDEX "employee_remarks_employeeId_idx" ON "employee_remarks"("employeeId");

-- CreateIndex
CREATE INDEX "employee_remarks_authorId_idx" ON "employee_remarks"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "applicants_email_key" ON "applicants"("email");

-- CreateIndex
CREATE INDEX "applicants_departmentId_idx" ON "applicants"("departmentId");

-- CreateIndex
CREATE INDEX "applicant_interviews_applicantId_idx" ON "applicant_interviews"("applicantId");

-- CreateIndex
CREATE INDEX "applicant_remarks_applicantId_idx" ON "applicant_remarks"("applicantId");

-- CreateIndex
CREATE INDEX "applicant_remarks_authorId_idx" ON "applicant_remarks"("authorId");

-- CreateIndex
CREATE INDEX "applicant_edit_history_applicantId_idx" ON "applicant_edit_history"("applicantId");

-- CreateIndex
CREATE INDEX "applicant_edit_history_editedById_idx" ON "applicant_edit_history"("editedById");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_deptHeadEmployeeId_fkey" FOREIGN KEY ("deptHeadEmployeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_projects" ADD CONSTRAINT "employee_projects_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_projects" ADD CONSTRAINT "employee_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_summaries" ADD CONSTRAINT "attendance_summaries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pause_intervals" ADD CONSTRAINT "pause_intervals_employeeProjectId_fkey" FOREIGN KEY ("employeeProjectId") REFERENCES "employee_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_modules" ADD CONSTRAINT "learning_modules_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_learning_path_progress" ADD CONSTRAINT "employee_learning_path_progress_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_learning_path_progress" ADD CONSTRAINT "employee_learning_path_progress_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_learningModuleId_fkey" FOREIGN KEY ("learningModuleId") REFERENCES "learning_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_employeeLearningPathProgressId_fkey" FOREIGN KEY ("employeeLearningPathProgressId") REFERENCES "employee_learning_path_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_remarks" ADD CONSTRAINT "employee_remarks_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_remarks" ADD CONSTRAINT "employee_remarks_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_applicationSourceAddedById_fkey" FOREIGN KEY ("applicationSourceAddedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_interviews" ADD CONSTRAINT "applicant_interviews_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_interviewers" ADD CONSTRAINT "applicant_interviewers_applicantInterviewId_fkey" FOREIGN KEY ("applicantInterviewId") REFERENCES "applicant_interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_interviewers" ADD CONSTRAINT "applicant_interviewers_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_remarks" ADD CONSTRAINT "applicant_remarks_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_remarks" ADD CONSTRAINT "applicant_remarks_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_edit_history" ADD CONSTRAINT "applicant_edit_history_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_edit_history" ADD CONSTRAINT "applicant_edit_history_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
