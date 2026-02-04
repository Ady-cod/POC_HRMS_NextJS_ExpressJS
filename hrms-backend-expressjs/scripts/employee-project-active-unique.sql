-- Optional guardrail: prevent multiple ACTIVE assignments per employee/project.
-- Apply after migrations if concurrency risk is high.
CREATE UNIQUE INDEX IF NOT EXISTS employee_projects_active_unique
ON "employee_projects" ("employeeId", "projectId")
WHERE status = 'ACTIVE';
