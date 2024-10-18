# POC_HRMS_NextJS_ExpressJS

This project is a proof of concept (POC) for a Human Resource Management System (HRMS), designed to manage employees, attendance, and related data. It uses **Next.js** for the frontend and **Express** for the backend, both written in TypeScript.

## Features

- Backend API with Express.js
- Frontend application with Next.js
- Both backend and frontend written in TypeScript
- Database integration using Prisma ORM
- Hot-reloading for backend using `tsx`

## Technologies Used

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

## Prisma Client Usage

The backend utilizes a singleton pattern for the Prisma Client to ensure type-safe, consistent database access. This is implemented in the client.ts file, which should be used wherever Prisma is required in the application.

To use Prisma, always import it from the client.ts file, like so:

```bash
import prisma from "../prisma/client";

// Usage
const users = await prisma.user.findMany();
```

This pattern ensures that only one instance of the Prisma Client is active at any time during development, preventing potential issues with database connection limits due to multiple instances.

## Current State & Future Steps

The current state of the project includes a basic setup for both the backend and frontend, using Express and Next.js respectively, both written in TypeScript.

### Environment Setup:

- Setup environment variables in appropriate `.env` or `.env.local` files for both backend and frontend configurations.

### Backend:

- Start the database and create the Prisma model.
- Create controllers and routes for managing employee data.
- Implement more detailed CRUD operations for managing employee data.

### Frontend:

- Build the UI components to display, add, delete, and update employee information.
- Develop user interfaces for managing authentication and user roles.
