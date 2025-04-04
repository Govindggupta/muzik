import { PrismaClient } from "@prisma/client"

export const prismaClient = new PrismaClient();
// we should introduce a singleton here , we'll see it later 
