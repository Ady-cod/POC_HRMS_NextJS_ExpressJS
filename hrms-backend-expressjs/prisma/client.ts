import { PrismaClient } from "@prisma/client";


// Prevent multiple instances of Prisma Client in development
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
const prisma = global.prisma;

export default prisma;