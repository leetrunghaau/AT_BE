const { p, l, s } = require('@/helpers/validate');
const Joi = require('joi');

const querySchema = Joi.object({
  p: p,
  l: l,
  s: s
});


module.exports = {
  querySchema
};