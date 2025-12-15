const Joi = require('joi');

const create = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] }),
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  subjects: Joi.array().items(Joi.string()).min(0).optional()
});

const creates = Joi.array().items(create);

const id = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] })
})

const update = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+?\d{7,15}$/).optional().allow(null, '').optional(),
  subjects: Joi.array().items(Joi.string()).min(0).optional()
});

module.exports = {
  id,
  create,
  creates,
  update,
};