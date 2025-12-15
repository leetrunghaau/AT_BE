const Joi = require('joi');

const create = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] }),
  name: Joi.string().min(2).max(10).required(),
  grade: Joi.number().valid(10, 11, 12).default(10)
});

const creates = Joi.array().items(create);

const id = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] })
})

const update = Joi.object({
  name: Joi.string().min(2).max(10).optional(),
  grade: Joi.number().valid(10, 11, 12).default(10)
});

module.exports = {
  id,
  create,
  creates,
  update,
};