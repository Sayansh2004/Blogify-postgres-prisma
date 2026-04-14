import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;  //  pg doesn't support named exports 

const pool = new Pool({
   connectionString: process.env.DATABASE_URL + "?sslmode=verify-full"
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;