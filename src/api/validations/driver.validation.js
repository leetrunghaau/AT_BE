const Joi = require('joi');

const create = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] }),
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  phoneParent: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  classId: Joi.string().guid({ version: ['uuidv7'] }).required()
});

const creates = Joi.array().items(create);

const id = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] }),
});

const update = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  phoneParent: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  classId: Joi.string().guid({ version: ['uuidv7'] }).required()
});

module.exports = {
  id,
  create,
  creates,
  update,
};