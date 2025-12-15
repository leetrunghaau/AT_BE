const prisma = require("@/helpers/prisma.client");
const { buildWhere, buildPagination } = require("@/helpers/prisma.query")
const createError = require('http-errors');

class DriverService {
  async getMeta() {
    const total = await prisma.driver.count();
    return { total }


  }
  async create(data) {
    const driver = await prisma.driver.create({ data, include: { schoolClass: true } });
    const pagination = await this.getMeta()
    return {
      data: driver,
      pagination
    }
  }

  async createBulk(data) {
    return await prisma.driver.createMany({ data: data });
  }

  async getAll(page = 1, limit = 10, filters = {}) {
    console.log(filters)
    const { skip, take } = buildPagination(page, limit);
    const where = buildWhere(filters);
    console.log(where)

    const [data, total] = await prisma.$transaction([
      prisma.driver.findMany({
        skip,
        take,
        where,
        include: {
          schoolClass: true
        },
      }),
      prisma.driver.count({ where }),
    ]);
    const meta = await this.getMeta()
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      meta
    };
  }
  async gets(page = 1, limit = 10, filters = {}) {
    console.log(filters)
    const { skip, take } = buildPagination(page, limit);
    const where = buildWhere(filters);
    console.log(where)

    const [data, total] = await prisma.$transaction([
      prisma.driver.findMany({
        skip,
        take,
        where,
        include: {
          schoolClass: true
        },
      }),
      prisma.driver.count({ where }),
    ]);
    const meta = await this.getMeta()
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      meta
    };
  }

  async getById(id) {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        schoolClass: true,
      }
    });
    if (!driver) throw createError.NotFound('Driver not found');
    return driver;
  }

  async update(id, data) {
    const driver = await prisma.driver.update({ where: { id }, data, include: { schoolClass: true } });
    const pagination = await this.getMeta()
    return {
      data: driver,
      pagination
    }
  }

  async delete(id) {
    const driver = await prisma.driver.delete({ where: { id } });
    const pagination = await this.getMeta()
    return {
      data: driver,
      pagination
    }
  }
}

module.exports = new DriverService();
