# POC_HRMS_NextJS_ExpressJS

## Table of Contents
- [POC\_HRMS\_NextJS\_ExpressJS](#poc_hrms_nextjs_expressjs)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies and main tools used](#technologies-and-main-tools-used)
  - [Installation](#installation)
      - [Option 1: Using HTTPS](#option-1-using-https)
      - [Option 2: Using SSH](#option-2-using-ssh)
  - [Running the Project](#running-the-project)
  - [Folder Structure](#folder-structure)
  - [Environment Setup](#environment-setup)
  - [Current State \& Future Steps](#current-state--future-steps)
    - [Backend:](#backend)
    - [Frontend:](#frontend)


## Introduction
This project is a proof of concept (POC) for a Human Resource Management System (HRMS), designed to manage employees, attendance, and related data. It uses **Next.js** for the frontend and **Express** for the backend, both written in TypeScript.

## Features

- Backend API with Express.js
- Frontend application with Next.js
- Both backend and frontend written in TypeScript
- Database integration using Prisma ORM
- Hot-reloading for backend using `tsx`

## Technologies and main tools used

- **Node.js** + **Express.js** (Backend)
- **Next.js** (Frontend)
- **TypeScript** (Type Safety)
- **Prisma** (Database ORM)
- **pnpm** (Package Manager)
- **tsx** (Development Backend Hot-Reloading)
- **cross-env** (Injecting in Backend scripts Environment Variables)
- **npm-run-all** (Running Multiple Scripts in the Backend)

## Installation

1. **Clone the repository**:

To clone this repository, you have two options:

#### Option 1: Using HTTPS

```bash
git clone https://github.com/Ady-cod/POC_HRMS_NextJS_ExpressJS.git
```

#### Option 2: Using SSH

```bash
git clone git@github.com:Ady-cod/POC_HRMS_NextJS_ExpressJS.git
```

Note: If you’re not familiar with SSH keys, you can use HTTPS to easily clone the repository.

2. **Navigate into the backend folder**:

   ```bash
   cd POC_HRMS_NextJS_ExpressJS/hrms-backend-expressjs
   ```

3. **Install dependencies using** `pnpm`:

   ```bash
   pnpm install
   ```

   > **Note**: Ensure you have `pnpm` installed globally. You can install it using:

   ```bash
   npm install -g pnpm
   ```

4. **Navigate into the frontend folder**:

   ```bash
   cd ../hrms-frontend-nextjs
   ```

5. **Install frontend dependencies using** `pnpm`:

   ```bash
   pnpm install
   ```

## Running the Project

To start the backend server in development mode, run:

```bash
pnpm dev
```

This will start the Express server with hot-reloading enabled and will inject NODE_ENV value as "development".

⚠️**Warning:** If this is the first time cloning this project to your local machine, before running the server, run:

> ```bash
> pnpm prisma db push
> ```

in the backend terminal.

This will ensure that the database schema is in sync with your local MongoDB database. Failing to do this can lead to runtime errors or database mismatches.

Check the [Environment Setup section](#environment-setup) to set up the environment variables **before** you run `pnpm prisma db push` command.
Especially you need to set up the `DATABASE_URL` environment variable in the `.env` file.

Other available backend scripts:

- **`pnpm start`**: Runs the compiled JavaScript from the `dist` folder and injects NODE_ENV value as "production".
- **`pnpm clean`**: Deletes the `dist` folder.
- **`pnpm compile`**: Compiles TypeScript to JavaScript in the `dist` folder.
- **`pnpm build`**: Combine `clean` and `compile` scripts, compiling the code on a clean slate in the `dist` folder.
- **`pnpm prod`**: Builds and starts the production server.

To start the frontend server in development mode, navigate to the `hrms-frontend-nextjs` folder and run:

```bash
pnpm dev
```

This will start the Next.js development server.

Other available frontend scripts:

- **`pnpm build`**: Builds the production version of the frontend.
- **`pnpm start`**: Starts the production server.
- **`pnpm lint`**: Lints the codebase.

## Folder Structure

```
├── hrms-backend-expressjs
│   ├── prisma
│   │   ├── client.ts
│   │   └── schema.prisma
│   ├── src
│   │   └── server.ts
│   ├── node_modules
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── .env.example
│   └── ... (other files for the Express.js setup)
└── hrms-frontend-nextjs
    ├── app
    ├── node_modules
    ├── .env.example
    ├── package.json
    ├── pnpm-lock.yaml
    ├── tsconfig.json
    └── ... (other files for the Next.js setup)
```

## Environment Setup

- **Backend Setup**:
  - Copy `.env.example` to `.env`:
    ```bash
    cp hrms-backend-expressjs/.env.example hrms-backend-expressjs/.env
    ```
  - Fill in the required values for the backend to function correctly.

- **Frontend Setup**:
  - You can choose to use `.env` or `.env.local` to manage frontend variables:
    ```bash
    cp hrms-frontend-nextjs/.env.example hrms-frontend-nextjs/.env.local
    ```
  - Ensure to fill in the values as needed for the application.


- Setup environment variables in appropriate `.env` or `.env.local` files for both backend and frontend configurations.
- The backend uses a `.env` file to manage environment variables and sensitive data. This file is not committed to the repository for security reasons, so it must be created manually in the backend project root.
- In the frontend, you can use either a `.env.local` file or a `.env` file for managing environment variables, depending on your preference. This file is not committed to the repository for security reasons as well, so it must be also created manually in the frontend project root.

- In the `.env.example` file, located in both the backend and frontend project root directories, you can find a template for the required environment variables. Copy this template to a new file named `.env` (or `.env.local` for the frontend), place it in the backend or frontend root, and fill in the necessary values to ensure proper functionality. 

⚠️ **Important**: It is essential to use a `.env` (and not a `.env.local` ) file for the backend, as Prisma expects the environment variables to be set in this type of file.

You need to place your own `.env` files in the backend and frontend project root folders, following the `.env.example` template.

## Current State & Future Steps

The current state of the project includes a basic setup for both the backend and frontend, using Express and Next.js respectively, both written in TypeScript.

In the backend section, the Prisma models have been created, and the basic CRUD operations for managing employee data are about to be implemented. 

### Backend:

- Create controllers and routes for managing employee data.
- Implement more detailed CRUD operations for managing employee data.

### Frontend:

- Build the UI components to display, add, delete, and update employee information.
- Develop user interfaces for managing authentication and user roles.
