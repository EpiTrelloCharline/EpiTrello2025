const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing Prisma connection...');
        await prisma.$connect();
        console.log('Successfully connected to the database!');
        const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
        console.log('Tables found:', tables);
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
