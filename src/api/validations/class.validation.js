const { uv7 } = require('@/helpers/validate');
const Joi = require('joi');

const id = Joi.object({
  id: uv7.label("Mã lớp học"),
})
const update = Joi.object({
  name: Joi.string().min(2).max(10).optional(),
  grade: Joi.number().valid(10, 11, 12).default(10)

});
const create = id.concat(update)
const creates = Joi.array().items(create);

module.exports = {
  id,
  create,
  creates,
  update,
};