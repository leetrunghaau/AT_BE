const Joi = require('joi');
const { Direction } = require('@prisma/client');

const create = Joi.object({
  studentId: Joi.string().guid({ version: ['uuidv7'] }),
  classMeetingId: Joi.string().guid({ version: ['uuidv7'] }),
  direction: Joi.string().valid(...Object.values(Direction)).required(),
  timestamp: Joi.date().iso().optional(),
});

const listByClass = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] }),
});

const listByStudent = Joi.object({
  studentId: Joi.string().guid({ version: ['uuidv7'] }),
});
const studentQuery = Joi.object({
  p: Joi.number().integer().allow(null | undefined).min(1).default(1),
  l: Joi.number().integer().allow(null | undefined).min(1).default(10),
  s: Joi.string().allow(null, '').optional().default(null),
  classId: Joi.string().guid({ version: ['uuidv7'] }).optional(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});



module.exports = {
  create,
  listByClass,
  listByStudent,
  studentQuery
};
