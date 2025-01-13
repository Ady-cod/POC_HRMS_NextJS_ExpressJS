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
  - [Deployment](#deployment)
  - [Current State \& Progress](#current-state--progress)
    - [Backend:](#backend)
    - [Frontend:](#frontend)
    - [Future Steps:](#future-steps)


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
├── POC_HRMS_NEXTJS_EXPRESSJS
│   ├── hrms-backend-expressjs
│   │   ├── dist
│   │   ├── prisma
│   │   │   └── schema.prisma
│   │   ├── src
│   │   │   ├── controllers
│   │   │   │   ├── employee.ts
│   │   │   │   └── learningPath.ts
│   │   │   ├── lib
│   │   │   │   └── client.ts
│   │   │   ├── routes
│   │   │   │   ├── employee.ts
│   │   │   │   └── learningPath.ts
│   │   │   ├── schemas
│   │   │   │   └── employeeSchema.ts
│   │   │   ├── types
│   │   │   │   └── types.ts
│   │   │   └── server.ts
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── pnpm-lock.yaml
│   │   ├── tsconfig.json
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   └── README.md
│   ├── hrms-frontend-nextjs
│   │   ├── app
│   │   │   ├── actions
│   │   │   ├── admin
│   │   │   ├── components
│   │   │   ├── fonts
│   │   │   ├── schemas
│   │   │   │   └── employeeSchema.ts
│   │   │   ├── types
│   │   │   │   └── types.ts
│   │   │   ├── utils
│   │   │   │   ├── formatZodErrors.ts
│   │   │   │   └── toastHelper.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   └── page.tsx
│   │   ├── node_modules
│   │   ├── public
│   │   ├── .env.example
│   │   ├── .env.local
│   │   ├── package.json
│   │   ├── pnpm-lock.yaml
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── ... (other files for the Next.js setup)
│   ├── .gitignore
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── README.md
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

## Deployment

The project is currently fully deployed on **Vercel** (frontend) and **Render** (backend). 

- **Full Deployment**: The frontend is hosted on Vercel and connected to the deployed backend for seamless integration. Access it here:  
  [HRMS Full Deployment](https://poc-hrms-next-js-express-js.vercel.app/)

- **Core Feature**: The Employee Management section, which includes all CRUD operations, can be accessed directly:  
  [Admin Employee Management](https://poc-hrms-next-js-express-js.vercel.app/admin/employee)  
  Alternatively, navigate to it by clicking on the `Employee` link in the sidebar after visiting the main deployment link.

## Current State & Progress

The current state of the project includes a basic setup for both the backend and frontend, using Express and Next.js respectively, both written in TypeScript.

### Backend:

In the backend section, the Prisma models have been created, and the basic CRUD operations for managing employee data are implemented. The backend is set up to handle employee data, including validation, error handling, and secure password management.

- **Prisma Models**:
  - **Employee**: Tracks employee details such as name, email, password, role, department, and attendance.
    - Relationships:
      - Linked to **Department** (many-to-one), **Attendance** (one-to-many), and **Project** (many-to-many via **EmployeeProject**).
      - One-to-one link with **EmployeeLearningPathProgress** for tracking learning paths.
    - Includes fields for timestamps, profile photo, and status.
  - The Employee model integrates seamlessly with related models to support comprehensive HRMS functionality.
  - Other models such as **Department** and **Attendance** are designed to complement the Employee model, ensuring a complete HRMS solution.
  - These models can be further extended in future development to include additional HRMS features.

- **CRUD Operations**:
  - Fully implemented CRUD operations for employee management.
  - Includes secure password handling with bcrypt.
  - Employee data includes validation for fields such as name, email, phone number, and more using Zod.
  - Supports department assignment with the ability to create new departments dynamically in DEMO mode.
  - Handles comprehensive error scenarios including validation errors, Prisma-specific database errors, and general server errors.

- **Validation**:
  - Zod schemas used for input validation, ensuring data integrity for both creation and updates.
  - Includes custom validation rules for email uniqueness, domain checks, and phone number formats.

- **Other Features**:
  - Password hashing and verification for secure employee management.
  - Modular architecture with separate layers for routes, controllers, and validation schemas.

### Frontend:

The frontend is designed for seamless employee management with a responsive user interface built using Next.js and Tailwind CSS. It incorporates the following features:

- **Employee Management**:
  - The `EmployeeTable` component displays employee data in a tabular format with support for pagination and sorting.
  - Provides `Edit` and `Delete` actions for each employee, with success/error toasts for feedback.
  - Implements responsive column adjustments for small screens, ensuring usability across devices.

- **Modal Form**:
  - The `ModalForm` component allows creating or updating employee records.
  - Integrates Zod schemas (`createEmployeeSchema`, `updateEmployeeSchema`) for robust client-side validation.
  - Features:
    - Password visibility toggle and confirm password validation.
    - Dynamic input handling for `birthDate` and `joinDate` with minimum and maximum constraints.
    - Error messages displayed inline and as toast notifications.

- **Sidebar and Layout**:
  - The `Sidebar` component provides easy navigation with links to key sections, such as Admin Dashboard, Employee Management, and more.
  - Features:
    - Responsive design that toggles visibility using a smooth animation.
    - Styled with custom CSS (`Sidebar.css`) for a clean, user-friendly appearance.
    - Dynamic state management to handle the open/close behavior based on screen size and user interaction.
  - The layout integrates:
    - A sticky navigation bar (`NavBar`) for quick access to the sidebar toggle.
    - A footer for additional content or links.
    - Centralized structure to handle responsive sidebar and main content alignment.

- **Styling**:
  - Uses Tailwind CSS for layout and component styling.
  - Custom CSS (e.g. : `ModalForm.css`, `Sidebar.css`) enhances modal appearance and ensures responsiveness.

- **State Management**:
  - Centralized in `page.tsx`, managing modal visibility, employee data, and refresh states.
  - `Add New Data` button opens the modal for new entries, while the table refreshes dynamically after updates.

The frontend complements the backend, by building the UI components to display, add, delete, and update employee information, to provide a complete solution for managing employees within the HRMS.


### Future Steps:

As the project progresses, the following features and improvements are planned:

- **Role-based Access Control (RBAC)**:
  - Implementing authentication and authorization to provide role-specific views and permissions (e.g., admin, manager, employee).
  
- **Enhanced Analytics**:
  - Adding dashboards with visualizations for employee data (e.g., attendance trends, department distribution).

- **Notifications System**:
  - Introducing email or in-app notifications for important events like employee onboarding or updates.

- **Employee Attendance Module**:
  - Developing a dedicated interface for tracking and managing employee attendance records.

- **Mobile Optimization**:
  - Further refining responsiveness and usability on mobile devices.

- **Integration Testing**:
  - Expanding test coverage with the help of the testing team to ensure both frontend and backend reliability.

This roadmap ensures continuous improvement and alignment with the HRMS objectives.

