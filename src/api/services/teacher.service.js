const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query.js");
const createError = require('http-errors');

class TeacherService {

    async getMeta() {
        const now = new Date();
       
        const total = await prisma.teacher.count();
        const totalSubject = await prisma.subject.count({
            where: {
                teachers: {
                    some: {}
                }
            }
        });;
        const totalLession = await prisma.timetableEntry.count({
            where: {
                startDate: {
                    lte: now,
                },
                endDate: {
                    gte: now
                }
            }
        });
        return { total, totalSubject, totalLession }
    }
    async create(data) {
        const { subjects, ...teacherData } = data;

        return await prisma.teacher.create({
            data: {
                ...teacherData,
                subjects: subjects
                    ? {
                        connect: subjects.map(id => ({ id }))
                    }
                    : undefined
            },
            include: {
                subjects: true
            }
        });
    }
    async createBulk(datas) {
        const results = [];

        for (const data of datas) {
            const { subjects, ...teacherData } = data;

            const teacher = await prisma.teacher.create({
                data: {
                    ...teacherData,
                    subjects: subjects
                        ? {
                            connect: subjects.map(id => ({ id }))
                        }
                        : undefined
                }
            });

            results.push(teacher);
        }

        return results;
    }


    async getAll(page = 1, limit = 10, filters = {}) {
        const { skip, take } = buildPagination(page, limit);
        const where = buildWhere(filters);
        return await prisma.teacher.findMany({
            skip,
            take,
            where,
            include: {
                subjects: true
            }
        });
    }
    async getById(id) {
        const rs = await prisma.teacher.findUnique({
            where: { id }, include: {
                subjects: true
            }
        });
        if (!rs) throw createError.NotFound('Teacher not found');
        return rs
    }

    async update(id, teacher) {
        const { subjects, ...teacherData } = teacher;

        return await prisma.teacher.update({
            where: { id },
            data: {
                ...teacherData,
                subjects: subjects
                    ? {
                        set: subjects.map(subId => ({ id: subId }))
                    }
                    : undefined
            }, include: {
                subjects: true
            }
        });
    }

    async delete(id) {
        await prisma.teacher.delete({ where: { id } });

    }
}

module.exports = new TeacherService();