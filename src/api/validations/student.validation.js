const Joi = require('joi');

const create = Joi.object({
  id: Joi.string().pattern(/^HS-\d{6}$/).required(),
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  phoneParent: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  classId: Joi.string().guid({ version: ['uuidv7'] }).required()
});

const creates = Joi.array().items(create);

const id = Joi.object({
  id: Joi.string().pattern(/^HS-\d{6}$/).required(),
});

const update = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  phoneParent: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  classId: Joi.string().guid({ version: ['uuidv7'] }).required()
});

const logs = Joi.object({
  p: Joi.number().integer().allow(null | undefined).min(1).default(1),
  l: Joi.number().integer().allow(null | undefined).min(1).default(10),
  s: Joi.string().allow(null, '').optional().default(null),
  classId: Joi.string().min(2).max(50).optional().default(null),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});

module.exports = {
  logs,
  id,
  create,
  creates,
  update,
};