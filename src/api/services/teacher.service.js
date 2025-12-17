const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query.js");
const createError = require('http-errors');

class TeacherService {
    async getMeta(now = new Date(), s = null) {
        const startOfDate = new Date(now);
        startOfDate.setHours(0, 0, 0, 0);

        const endOfDate = new Date(now);
        endOfDate.setHours(23, 59, 59, 999);

        const where = {};
        if (s) where.name = { contains: s };

        const atts = await prisma.teacher.findMany({
            where,
            select: {
                teacherAttendants: {
                    where: {
                        timeTemp: {
                            gte: startOfDate,
                            lte: endOfDate,
                        },
                    },
                    select: { status: true }
                }
            }
        })

        const total = atts.length;

        const stats = atts.reduce((acc, att) => {
            const s = (() => {
                const set = new Set(att.teacherAttendants.map(a => a.status));
                if (!set.size) return "absent";
                if (set.size === 1 && set.has("absent")) return "excused";
                return ["late", "present"].find(x => set.has(x)) ?? "absent";
            })();
            acc[s] = (acc[s] || 0) + 1;
            return acc;
        }, {});

        return { total, ...stats };
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


    async logs(page = 1, limit = 10, now = new Date(), classId = null, s = null) {
        const { skip, take } = buildPagination(page, limit);

        const startOfDate = new Date(now);
        startOfDate.setHours(0, 0, 0, 0);

        const endOfDate = new Date(now);
        endOfDate.setHours(23, 59, 59, 999);

        const where = {};
        if (s) where.name = { contains: s };
        return await prisma.teacher.findMany({
            skip,
            take,
            where,
            include: {
                teacherLogs: {
                    where: {
                        logTime: {
                            gte: startOfDate,
                            lte: endOfDate,
                        },
                    },
                    orderBy: { logTime: "asc" },
                },
                teacherAttendants: {
                    where: {
                        timeTemp: {
                            gte: startOfDate,
                            lte: endOfDate,
                        },
                    },
                },
                timetableEntries: {
                    where: {
                        dayOfWeek: now.getDay() || 7,
                        startDate: { lte: now },
                        endDate: { gte: now },
                    },
                    include: {
                        subject: true,
                        schoolClass: true,
                    },
                    orderBy: { period: "asc" },
                },
            },
        })
    }

    async lastLog(ids = []) {

        return await prisma.teacher.findMany({
            where: {
                id: { in: ids }
            },
            select: {
                teacherLogs: {
                    take: 1,
                    orderBy: { logTime: "desc" },
                    select: {
                        teacherId: true,
                        direction: true,
                        logTime: true
                    }
                },

            }
        })
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