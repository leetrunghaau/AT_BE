
const TeacherService = require("@services/teacher.service.js");
const createError = require('http-errors');
const FaceService = require("../services/face.service");
const { storeDir, saveImages } = require("@/helpers/file");


class TeacherController {
  async create(req, res, next) {
    try {
      const teacher = await TeacherService.create(req.body);
      const meta = await TeacherService.getMeta()
      res.ok(teacher, meta)
    } catch (error) {
      next(error);
    }
  }
  async createBulk(req, res, next) {
    try {
      const teacher = await TeacherService.createBulk(req.body);
      const meta = await TeacherService.getMeta()
      res.ok(teacher, meta)
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { p, l } = req.useQuery
      const teachers = await TeacherService.getAll(p, l)
      const meta = await TeacherService.getMeta()
      res.ok(teachers, meta)
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.useParams;
      const teacher = await TeacherService.getById(id);
      const meta = await TeacherService.getMeta()

      res.ok(teacher, meta)
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.useParams;
      const teacher = await TeacherService.update(id, req.body);
      const meta = await TeacherService.getMeta()

      res.ok(teacher, meta)
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.useParams;
      await TeacherService.delete(id);
      const meta = await TeacherService.getMeta()
      res.ok(null, meta, `Teacher ${id} deleted successfully`)
    } catch (error) {
      next(error);
    }
  }

  async training(req, res, next) {
    try {
      // Lấy ID từ params
      const { id } = req.params;
      const teacher = await TeacherService.getById(id);
      const { images, landmarks } = req.body;
      if (!images || !Array.isArray(images)) {
        return next(createError.BadRequest("images must be an array"));
      }
      const uploadDir = storeDir({ teacher: teacher.id })
      saveImages(images, uploadDir, teacher.id)
      const ai_rs = await FaceService.registerUser(teacher.id, images, landmarks);
      if (ai_rs?.status == "ok") {
        await TeacherService.update(teacher.id, { trained: true })
        return res.ok({ ...teacher, trained: true });
      }
      return res.ok(false);
    } catch (err) {
      next(err);
    }
  }


}

module.exports = new TeacherController();