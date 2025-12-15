const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();
const prisma = new PrismaClient({
    log: [
        // { emit: 'stdout', level: 'query' },   // xem các query SQL
        { emit: 'stdout', level: 'info' },    // thông tin chung
        { emit: 'stdout', level: 'warn' },    // cảnh báo
        { emit: 'stdout', level: 'error' }    // lỗi
    ]
});

module.exports = prisma
