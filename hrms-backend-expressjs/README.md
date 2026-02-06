# Backend Documentation

## Table of Contents

- [Backend Documentation](#backend-documentation)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Prisma](#prisma)
    - [Prisma Client Usage](#prisma-client-usage)
    - [Prisma Schema Models](#prisma-schema-models)
  - [.env Configuration](#env-configuration)

## Introduction

This README provides backend-specific documentation for the development team, focusing on implemented code features, tools, and dependencies used in the backend of this project. Unlike the general README located in the project root, this document emphasizes backend-specific workflows, development details, and best practices.

For an overall project overview, please refer to the [general README](../README.md) located in the project root.

## Prisma

⚠️**Warning:** If this is the first time cloning this project to your local machine, or if there are updates in the `schema.prisma` file, run:

```bash
pnpm prisma format
pnpm prisma validate
pnpm prisma migrate dev --name <migration_name>
pnpm prisma generate
```

This will ensure that the database schema is in sync with the latest changes. Failing to do this can lead to runtime errors or database mismatches.

For production/CI deploys, use:

```bash
pnpm prisma migrate deploy
```

Check the [.env Configuration section](#env-configuration) to set up the environment variables **before** you run migrations.
Especially you need to set up the `DATABASE_URL` and `DIRECT_URL` environment variables in the `.env` file.

Prisma is the primary tool for managing our database schema and accessing data models within this backend. Below are the setup details and information on the Prisma models implemented in this project.

### Prisma Client Usage

The backend utilizes a singleton pattern for the Prisma Client to ensure type-safe, consistent database access. This is implemented in the client.ts file, which should be used wherever Prisma is required in the application.

To use Prisma, always import it from the client.ts file, like so:

```typescript
import prisma from "../lib/client";

// Usage
const users = await prisma.user.findMany();
```

This pattern ensures that only one instance of the Prisma Client is active at any time during development, preventing potential issues with database connection limits due to multiple instances.

### Prisma Schema Models

The `schema.prisma` file defines the core models that structure the backend database, setting up entities
and their fields with specific types and constraints tailored for our application.

**Note:** The Prisma schema is the single source of truth for the database schema, so any changes to the schema should be reflected in this file. Any time changes are made to the `schema.prisma` file, run the migration workflow shown above to ensure the database reflects the updated structure.

**Overview of Implemented Models:**

- **Employee**: Represents individual employee records with the following fields:

  - `id`: Unique identifier using `@db.Uuid`.
  - `firstName` and `lastName`: Basic identifiers for the employee’s name.
  - `email`: Unique, ensuring each employee record has a distinct contact reference.
  - `inductionCompleted`: Boolean flag to track if the employee has completed induction.
  - Additional fields include optional `phoneNumber` and `profilePhotoUrl`, allowing flexibility in employee records.

  **Note:** In order for the Employee model to work properly, some additional models and enums have been created.

- **Model Constraints and Indexes**:
  - Unique constraints (e.g., `@unique` on the `email` field) ensure data integrity.
  - Relationships or additional indexes can be specified here if the schema grows with more entities.

**Schema Location**:

The `schema.prisma` file is located in the backend project root, in the `prisma` folder, where it can be accessed and updated as required by new database requirements.

Always ensure that any schema changes (either coming from local changes or from code pulled from repository) are followed by running the migration workflow to sync the schema with the PostgreSQL database.

### Migration Utilities

- `pnpm migrate:mongo-to-postgres`: migrate data from MongoDB into PostgreSQL (restart-safe).
- `pnpm validate:migration`: compare MongoDB vs PostgreSQL row counts.
- `pnpm smoke:postgres`: run pre-cutover API smoke tests.
- Optional: run `scripts/employee-project-active-unique.sql` to enforce one ACTIVE assignment per employee/project.

### Cutover & Rollback (PostgreSQL)

**Cutover (recommended order):**

1. Stop application writes (maintenance window).
2. Run `pnpm migrate:mongo-to-postgres`.
3. Run `pnpm validate:migration` and `pnpm smoke:postgres`.
4. Update `DATABASE_URL`/`DIRECT_URL` to PostgreSQL and restart backend.

**Rollback (if validation fails):**

1. Revert `DATABASE_URL`/`DIRECT_URL` to MongoDB (or previous working configuration).
2. Restart backend and re-enable writes.
3. Investigate migration issues before retrying.

## .env Configuration

The backend uses a `.env` file to manage environment variables and sensitive data. This file is not committed to the repository for security reasons, so it must be created manually in the project root.

In the `.env.example` file, you can find a template for the required environment variables. Copy this template to a new file named `.env`, placed in the backend project root, and fill in the necessary values for the backend to function correctly.

If you plan to run the MongoDB → PostgreSQL migration script, also set:

- `MONGO_DATABASE_URL` (MongoDB connection string)
- `MONGO_DATABASE_NAME` (optional, if not present in the MongoDB URL)

### Email Domain Validation (DNS)

The backend validates email domains using DNS lookups. To avoid local DNS resolver issues in dev environments, you can optionally configure:

- `DNS_SERVERS`: comma-separated DNS servers used **only** for email validation (e.g. `1.1.1.1,8.8.8.8`)
- `EMAIL_DOMAIN_VALIDATION_MODE`: `strict | warn | off`
  - `strict`: DNS lookup failures reject the email
  - `warn`: DNS lookup failures allow the email and log a warning
  - `off`: skip DNS validation entirely

If `EMAIL_DOMAIN_VALIDATION_MODE` is unset, it defaults to `strict` in production and `warn` in non-production.
