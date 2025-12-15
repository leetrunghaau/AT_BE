const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query")
const createError = require('http-errors');

class StudentAttendenceService {
  
  async create(data) {
    return await prisma.studentAttendant.create({ data });
  }

  async attendenced(studentId, now) {
    const startOfDate = new Date(now);
    startOfDate.setHours(0, 0, 0, 0);
    const endOfDate = new Date(now);
    endOfDate.setHours(23, 59, 59, 999);
    return await prisma.studentAttendant.findFirst({ where: { studentId: studentId, timeTemp: { gte: startOfDate, lte: endOfDate } } });
  }
  async attendenceds(studentIds, now) {
    const startOfDate = new Date(now);
    startOfDate.setHours(0, 0, 0, 0);
    const endOfDate = new Date(now);
    endOfDate.setHours(23, 59, 59, 999);
    return await prisma.studentAttendant.findMany({ where: { studentId: {in: studentIds}, timeTemp: { gte: startOfDate, lte: endOfDate } } });
  }
  
  async getById(id) {
    const att = await prisma.studentAttendant.findUnique({
      where: { id },
    });
    if (!att) throw createError.NotFound('student log not found');
    return att;
  }

  async update(id, data) {
    return await prisma.studentAttendant.update({ where: { id }, data});
  }

  async delete(id) {
    return  await prisma.studentAttendant.delete({ where: { id } });
    
  }
}

module.exports = new StudentAttendenceService();
