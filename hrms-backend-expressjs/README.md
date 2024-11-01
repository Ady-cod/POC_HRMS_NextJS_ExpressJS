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

> ```bash
> pnpm prisma db push
> ```

This will ensure that the database schema is in sync with the latest changes. Failing to do this can lead to runtime errors or database mismatches.

Check the [.env Configuration section](#env-configuration) to set up the environment variables **before** you run `pnpm prisma db push` command.
Especially you need to set up the `DATABASE_URL` environment variable in the `.env` file.

Prisma is the primary tool for managing our database schema and accessing data models within this backend. Below are the setup details and information on the Prisma models implemented in this project.

### Prisma Client Usage

The backend utilizes a singleton pattern for the Prisma Client to ensure type-safe, consistent database access. This is implemented in the client.ts file, which should be used wherever Prisma is required in the application.

To use Prisma, always import it from the client.ts file, like so:

```typescript
import prisma from "../prisma/client";

// Usage
const users = await prisma.user.findMany();
```

This pattern ensures that only one instance of the Prisma Client is active at any time during development, preventing potential issues with database connection limits due to multiple instances.

### Prisma Schema Models

The `schema.prisma` file defines the core models that structure the backend database, setting up entities
and their fields with specific types and constraints tailored for our application.

**Note:** The Prisma schema is the single source of truth for the database schema, so any changes to the schema should be reflected in this file. Any time changes are made to the `schema.prisma` file, it is essential to run:

```bash
pnpm prisma db push
```

to sync these changes with the MongoDB database. For instance, adding a new field or modifying an existing one should be followed by running this command to ensure the database reflects the updated structure.

**Overview of Implemented Models:**

- **Employee**: Represents individual employee records with the following fields:

  - `id`: Unique identifier, mapped to MongoDB’s `_id` field for ObjectId compatibility.
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

Always ensure that any schema changes (either coming from the local changes or from code pulled from repository) are followed by running

```bash
pnpm prisma db push
```

to sync the schema with the MongoDB database.

## .env Configuration

The backend uses a `.env` file to manage environment variables and sensitive data. This file is not committed to the repository for security reasons, so it must be created manually in the project root.

In the `.env.example` file, you can find a template for the required environment variables. Copy this template to a new file named `.env` , placed in the backend project root, and fill in the necessary values for the backend to function correctly.
