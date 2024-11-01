# Backend Documentation

## Introduction

This README provides backend-specific documentation for the development team, focusing on implemented code features, tools, and dependencies used in the backend of this project. For an overall project overview, please refer to the general README located in the project root.

## Prisma

**Warning:** If this is the first time cloning this project to your local machine, or if there are updates in the `schema.prisma` file, it is imperative to run `pnpm prisma db push` to sync the schema with the database.

Prisma is the primary tool for managing our database schema and accessing data models within this backend. Below are the setup details and information on the Prisma models implemented in this project.

### Prisma Client Usage

The backend utilizes a singleton pattern for the Prisma Client to ensure type-safe, consistent database access. This is implemented in the client.ts file, which should be used wherever Prisma is required in the application.

To use Prisma, always import it from the client.ts file, like so:

```bash
import prisma from "../prisma/client";

// Usage
const users = await prisma.user.findMany();
```

This pattern ensures that only one instance of the Prisma Client is active at any time during development, preventing potential issues with database connection limits due to multiple instances.

### Prisma Schema Models

The `schema.prisma` file defines the core models that structure the backend database, setting up entities
and their fields with specific types and constraints tailored for our application.

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

Always ensure that any schema changes are followed by running

```bash
pnpm prisma db push
```

to sync the schema with the MongoDB database.

## .env Configuration

The backend uses a `.env` file to manage environment variables and sensitive data. This file is not committed to the repository for security reasons, so it must be created manually in the project root.

In the .env.example file, you can find a template for the required environment variables. Copy this template to a new file named `.env` and fill in the necessary values for the backend to function correctly.
