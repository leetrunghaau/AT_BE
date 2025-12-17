const { uv7, phone } = require('@/helpers/validate');
const Joi = require('joi');
const id = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] }),
});
const update = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: phone,
  phoneParent: phone.optional(),
  classId: uv7.label("Mã lớp học")
});
const create = id.concat(update)
const creates = Joi.array().items(create);

module.exports = {
  id,
  create,
  creates,
  update,
};