const express = require('express');
const attendanceController = require('../controllers/attendance.controller');
const validate = require('../middlewares/validation.middleware');
const { listByClass, studentQuery } = require('../validations/attendance.validation');
const { v7Id, querySchema } = require('../validations/query.validation');
const router = express.Router();

router.post("/", attendanceController.attendance);
router.get("/students",  validate(studentQuery, "query"), attendanceController.forStudents);
module.exports = router;