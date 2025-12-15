const AttendanceService = require("@services/attendance.service");
const faceService = require("../services/face.service");
const { matchPercentage } = require("@/helpers/ai");
const studentService = require("../services/student.service");
const studentAttendenceService = require("../services/student-attendence.service");

class AttendanceController {

  async attendance(req, res, next) {
    try {
      const { image, landmarks, schoolClassId, direction } = req.body;
      const detected = await faceService.recognize(image, landmarks)
      if (!detected.user_id) return res.ok(null)
      const rs = detected.user_id.startsWith("HS-") ?
        await AttendanceService.student(detected.user_id, schoolClassId, direction) :
        await AttendanceService.teacher(detected.user_id, schoolClassId, direction)

      return res.ok({
        ...rs,
        confidence: matchPercentage(detected.distance),
      })
    } catch (error) {
      next(error);
    }
  }

  async test(req, res, next) {
    try {
      const { user_id, schoolClassId, direction } = req.body;
      const rs = user_id.startsWith("HS-") ?
        await AttendanceService.student(user_id, schoolClassId, direction) :
        await AttendanceService.teacher(user_id, schoolClassId, direction)

      return res.ok({
        ...rs,
        confidence: matchPercentage(0.514678458),
      })
    } catch (error) {
      next(error);
    }
  }

  async forStudents(req, res, next) {
    try {
      console.log(new Date(1765258350567))
      const { p, l, classId, date } = req.useQuery;
      const students = await studentService.att(classId,date)
      // console.log(students)
      return res.ok(students)
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new AttendanceController();