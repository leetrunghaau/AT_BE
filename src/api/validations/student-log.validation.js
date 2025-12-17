const { studentId, uv7 } = require('@/helpers/validate');
const {  Direction } = require('@prisma/client');
const Joi = require('joi');

const studentLog = Joi.object({
  driverId: uv7.label("Mã thiết bị"),
  studentId: studentId,
  direction: Joi.string().valid(...Object.values(Direction)).required()
});
module.exports = {
  studentLog,
};