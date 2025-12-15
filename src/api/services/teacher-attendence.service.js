const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query")
const createError = require('http-errors');

class TeacherAttendenceService {
  
  async create(data) {
    return await prisma.teacherAttendant.create({ data });
  }

  async attendenced(teacherId, now) {
    const startOfDate = new Date(now);
    startOfDate.setHours(0, 0, 0, 0);
    const endOfDate = new Date(now);
    endOfDate.setHours(23, 59, 59, 999);

    return await prisma.teacherAttendant.findFirst({ where: { teacherId: teacherId, timeTemp: { gte: startOfDate, lte: endOfDate } } });
  }
  
  async getById(id) {
    const att = await prisma.teacherAttendant.findUnique({
      where: { id },
    });
    if (!att) throw createError.NotFound('teacher log not found');
    return att;
  }

  async update(id, data) {
    return await prisma.teacherAttendant.update({ where: { id }, data});
  }

  async delete(id) {
    return  await prisma.teacherAttendant.delete({ where: { id } });
    
  }
}

module.exports = new TeacherAttendenceService();
