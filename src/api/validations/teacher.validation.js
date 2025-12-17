const { uv7, name, phone, s, l, p, vDate } = require('@/helpers/validate');
const Joi = require('joi');

const id = Joi.object({
  id: uv7.label("Mã giáo viên")
})
const update = Joi.object({
  name: name,
  email: Joi.string().email().required(),
  phone: phone,
  subjects: Joi.array().items(Joi.string()).min(0).optional()
});
const create = id.concat(update)
const creates = Joi.array().items(create);
const logs = Joi.object({
  p: p,
  l: l,
  s: s,
  date: vDate.label("Ngày"),
});



module.exports = {
  id,
  create,
  creates,
  update,
  logs
};