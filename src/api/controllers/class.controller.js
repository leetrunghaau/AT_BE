const ClassService = require("@services/class.service.js");

class ClassController {
  async create(req, res, next) {
    try {
      const newClass = await ClassService.create(req.body);
      const meta = await ClassService.getMeta()
      res.ok(newClass, meta)
    } catch (error) {
      next(error);
    }
  }
  async createBulk(req, res, next) {
    try {
      const newClasses = await ClassService.create(req.body);
      const meta = await ClassService.getMeta()
      res.ok(newClasses, meta)
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {

      const { p, l, s } = req.useQuery
      const classes = await ClassService.getAll(p, l, { name: s })
      const meta = await ClassService.getMeta()
      res.ok(classes, {
        ...meta,
        page: p,
        limit: l,
        totalPages: Math.ceil(meta.total / l),
      })
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.useParams;
      const classItem = await ClassService.getById(id);
      const meta = await ClassService.getMeta()
      res.ok(classItem, meta)
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.useParams;
      const updatedClass = await ClassService.update(id, req.body);
      const meta = await ClassService.getMeta()
      res.ok(updatedClass, meta)
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.useParams;
      await ClassService.delete(id);
      const meta = await ClassService.getMeta()
      res.ok(null, meta, `Class ${id} deleted successfully`)
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClassController();