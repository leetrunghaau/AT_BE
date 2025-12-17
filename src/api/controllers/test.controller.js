const studentService = require("../services/student.service");

class TestController {

    async meta(req, res, next) {
        try {

            const start = new Date(req.body.date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(req.body.date);
            end.setHours(23, 59, 59, 999);
            const where = {
                timeTemp: { gte: start, lte: end }
            }
            const meta = await studentService.getMeta1(where);
            res.ok(meta);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TestController();