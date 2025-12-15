const { LESSON_PERIODS } = require('@/src/config/constants');
const Joi = require('joi');

const create = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] }),
  classId: Joi.string().guid({ version: ['uuidv7'] }),
  subjectId: Joi.string().required(),
  teacherId: Joi.string().guid({ version: ['uuidv7'] }),
  dayOfWeek: Joi.number().min(0).max(6),
  period: Joi.number().min(1).max(9).required(),
  startDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  endDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});

const creates = Joi.array().items(create).min(1).max(LESSON_PERIODS.length * 7);

const id = Joi.object({
  id: Joi.string().guid({ version: ['uuidv7'] })
})

const search = Joi.object({
  classId: Joi.string().guid({ version: ['uuidv7'] }),
  startDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  endDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
})

const comparison = Joi.object({
  classId: Joi.string().guid({ version: ['uuidv7'] }),
  aStartDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  aEndDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  bStartDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  bEndDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
})
const history = Joi.object({
  classId: Joi.string().guid({ version: ['uuidv7'] })

})
const dateOfClass = Joi.object({
  classId: Joi.string().guid({ version: ['uuidv7'] }),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
})
const update = Joi.object({
  classId: Joi.string().guid({ version: ['uuidv7'] }),
  subjectId: Joi.string().required(),
  teacherId: Joi.string().guid({ version: ['uuidv7'] }),
  dayOfWeek: Joi.number().min(0).max(6),
  period: Joi.number().min(1).max(9).required()
});

const modify = Joi.object({
  dayOfWeek: Joi.number().min(0).max(6),
  period: Joi.number().min(1).max(9).required()
});

module.exports = {
  id,
  modify,
  search,
  create,
  creates,
  update,
  history,
  comparison,
  dateOfClass
};