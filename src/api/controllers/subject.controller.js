const SubjectService = require("@services/subject.service.js");

class SubjectController {

  async getAll(req, res, next) {
    try {
      const { p, l, ...filters } = req.useQuery;
      const subjects = await SubjectService.getAll(p, l, filters);
      res.ok(subjects.data, subjects.pagination);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.useParams;
      const updatedSubject = await SubjectService.update(id, req.body);
      res.ok(updatedSubject);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubjectController();