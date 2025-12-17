const Joi = require('joi');
const { Direction } = require('@prisma/client');
const { p, l, s, uv7, vDate, studentId } = require('@/helpers/validate');

const create = Joi.object({
  studentId: studentId,
  classMeetingId: uv7,
  direction: Joi.string().valid(...Object.values(Direction)).required(),
  timestamp: Joi.date().iso().optional(),
});

const listByClass = Joi.object({
  id: uv7.label("Mã lớp học"),
});

const listByStudent = Joi.object({
  studentId: studentId,
});
const studentQuery = Joi.object({
  p: p,
  l: l,
  s: s,
  classId: uv7.label("Mã lớp học").optional(),
  date: vDate.label("Ngày"),
});



module.exports = {
  create,
  listByClass,
  listByStudent,
  studentQuery
};
