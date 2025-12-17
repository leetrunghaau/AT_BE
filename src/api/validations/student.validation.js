const { studentId, name, phone, uv7, gender, p, l, s, vDate } = require('@/helpers/validate');
const Joi = require('joi');
const update = Joi.object({
  id: studentId,
  name: name,
  phone: phone,
  phoneParent: phone,
  classId: uv7.label("Mã lớp"),
  gender: gender,
});

const id = Joi.object({
  id: studentId,
});
const create = id.concat(update)
const creates = Joi.array().items(create);
const logs = Joi.object({
  p: p,
  l: l,
  s: s,
  classId: uv7.label("Mã lớp").optional(),
  date: vDate.label("Ngày"),
});
module.exports = {
  logs,
  id,
  create,
  creates,
  update,
};