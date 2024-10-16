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
- **tsx** (Development Hot-Reloading)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Ady-cod/POC_HRMS_NextJS_ExpressJS
   ```

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

This will start the Express server with hot-reloading enabled.

Other available backend scripts:

- **`pnpm start`**: Runs the compiled JavaScript from the `dist` folder.
- **`pnpm build`**: Compiles TypeScript to JavaScript in the `dist` folder.
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
