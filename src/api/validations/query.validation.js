const Joi = require('joi');

const querySchema = Joi.object({
  p: Joi.number().integer().allow(null | undefined).min(1).default(1),
  l: Joi.number().integer().allow(null | undefined).min(1).default(10),
  s: Joi.string().allow(null, '').optional().default(null)
});

const v7Id = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] }),
});
module.exports = {
  querySchema,
  v7Id
};