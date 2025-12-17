const express = require('express');
const router = express.Router();

// const attendanceRouter = require('./attendance.route');
const studentRoutes = require('./student.route.js');
const classRoutes = require('./class.route.js');
const subjectRoutes = require('./subject.route.js');
const teacherRoutes = require('./teacher.route.js');
const scheduleRoutes = require('./schedule.route');
const driverRoutes = require('./driver.route');
const attendance = require('./attendance.route.js');
const test = require('./test.route.js');

// Gắn các route riêng lẻ vào router chính
// router.use('/attendance', attendanceRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/subjects', subjectRoutes);
router.use('/teachers', teacherRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/drivers', driverRoutes);
router.use('/attendance', attendance);
router.use('/test', test);

module.exports = router;