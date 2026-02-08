import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    console.log('Connecting to database...');
    try {
        await prisma.$connect();
        console.log('Connected successfully!');
        const tables = await prisma.$queryRaw`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
        console.log('Tables:', tables);
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
