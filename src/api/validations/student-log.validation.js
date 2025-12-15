const {  Direction } = require('@prisma/client');
const Joi = require('joi');

const studentLog = Joi.object({
  driverId: Joi.string().guid({ version: ['uuidv7'] }),
  studentId: Joi.string().pattern(/^HS-\d{6}$/).required(),
  direction: Joi.string().valid(...Object.values(Direction)).required()
});
module.exports = {
  studentLog,
};