
const StudentService = require("@services/student.service.js");
const { storeDir, saveImages } = require("@/helpers/file");
const faceService = require("../services/face.service");
const createError = require('http-errors');

class StudentController {
  async create(req, res, next) {
    try {
      const newStudent = await StudentService.create(req.body);
      const meta = await StudentService.getMeta()
      res.ok(newStudent, meta);
    } catch (error) {
      next(error);
    }
  }

  async createBulk(req, res, next) {
    try {
      await StudentService.createBulk(req.body);
      const newStudents = await StudentService.getAll(1, 10, { id: req.body.map(item => item.id) });
      const meta = await StudentService.getMeta()
      res.ok(newStudents, meta);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { p, l, s } = req.useQuery;
      console.log(req.useQuery)
      const students = await StudentService.getAll(p, l, { name: s });
      const meta = await StudentService.getMeta()
      res.ok(students, meta);
    } catch (error) {
      next(error);
    }
  }
  async logs(req, res, next) {
    try {
      const { p, l, s, date, classId } = req.useQuery;
      const students = await StudentService.logs(p,l,new Date(date),classId,s);
      const meta = await StudentService.getMeta()
      res.ok(students, meta);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.useParams;
      const student = await StudentService.getById(id);
      const meta = await StudentService.getMeta()
      res.ok(student, meta);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { id } = req.useParams;
      const updatedStudent = await StudentService.update(id, req.body);
      const meta = await StudentService.getMeta()
      res.ok(updatedStudent, meta);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.useParams;
      await StudentService.delete(id);
      const meta = await StudentService.getMeta()
      res.ok(id, meta, `Student ${id} deleted successfully`);
    } catch (error) {
      next(error);
    }
  }

  async training(req, res, next) {
    try {
      // Lấy ID từ params
      const { id } = req.params;
      const student = await StudentService.getById(id);
      const { images, landmarks } = req.body;
      if (!images || !Array.isArray(images)) {
        return next(createError.BadRequest("images must be an array"));
      }
      const uploadDir = storeDir({ student: student.id })
      saveImages(images, uploadDir, student.id)
      const ai_rs = await faceService.registerUser(student.id, images, landmarks);
      if (ai_rs?.status == "ok") {
        await StudentService.update(student.id, { trained: true })
        return res.ok({ ...student, trained: true });
      }

      return next(createError.BadRequest("Lỗi "));;
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudentController();