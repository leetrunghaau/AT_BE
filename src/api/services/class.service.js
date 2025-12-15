const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query");
const createError = require('http-errors');

class ClassService {

  async getMeta() {
    const total = await prisma.schoolClass.count();
    const totalStudent = await prisma.student.count();
    const averageStudent = total > 0
      ? totalStudent / total
      : 0;
    return { total, totalStudent, averageStudent }
  }


  async create(classData) {
    return await prisma.schoolClass.create({ data: classData })
  }
  async createBulk(classData) {
    return await prisma.schoolClass.createMany({ data: classData, skipDuplicates: true })
  }

  async getAll(page = 1, limit = 10, filters = {}) {
    const { skip, take } = buildPagination(page, limit);
    const where = buildWhere(filters);

    const data = await prisma.schoolClass.findMany({
      skip,
      take,
      where,
      include: {
        _count: {
          select: { students: true },
        },
      },
    });

    return  data.map(c => ({
      id: c.id,
      name: c.name,
      grade: c.grade,
      studentCount: c._count.students,
    }));

    
  }

  async getById(id) {
    const rs = await prisma.schoolClass.findUnique({ where: { id } });
    if (!rs) throw createError.NotFound('Class not found');
    return rs
  }

  async update(id, data) {
    return await prisma.schoolClass.update({ where: { id: id }, data: data })

  }

  async delete(id) {
    await prisma.schoolClass.delete({ where: { id } });

  }
}

module.exports = new ClassService();
