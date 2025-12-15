const Joi = require('joi');
const { Color } = require('@prisma/client');


const id = Joi.object({
  id: Joi.string().min(3).max(10)
});

const update = Joi.object({
  color: Joi.string().valid(...Object.values(Color)).optional(),
});

module.exports = {
  id,
  update,
};