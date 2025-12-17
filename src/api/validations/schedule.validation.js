const { uv7, dayOfWeek, period, vDate, l, p, s } = require('@/helpers/validate');
const { LESSON_PERIODS } = require('@/src/config/constants');
const Joi = require('joi');

const id = Joi.object({
  id: uv7.label("Mã TKB")
})
const update = Joi.object({
  classId: uv7.label("Mã lớp học"),
  subjectId: Joi.string().required(),
  teacherId: uv7.label("Mã giáo viên"),
  dayOfWeek: dayOfWeek,
  period: period
});

const create = id.concat(update).concat(
  Joi.object({
    startDate: vDate.label("Ngày bắt đầu"),
    endDate: vDate.label("Ngày kết thúc"),
  })
);


const creates = Joi.array().items(create).min(1).max(LESSON_PERIODS.length * 7);

const search = Joi.object({
  classId: uv7.label("Mã lớp học"),
  startDate: vDate.label("Ngày bắt đầu"),
  endDate: vDate.label("Ngày kết thúc")
})

const comparison = Joi.object({
  classId: uv7.label("Mã lớp học"),
  aStartDate: vDate.label("Ngày bắt đầu version a"),
  aEndDate: vDate.label("Ngày kết thúc version a"),
  bStartDate: vDate.label("Ngày bắt đầu version b"),
  bEndDate: vDate.label("Ngày kết thúc version b")
})
const history = Joi.object({
  classId: uv7.label("Mã lớp học"),

})

const teachers = Joi.object({
  subjectId: Joi.string().required(),

  startDate: vDate.label("Thời gian bắt đầu"),
  endDate: vDate.label("thười gian kết thúc"),
  dayOfWeek: dayOfWeek,
  period: period,

  teacherId: uv7.label("Mã GV").allow("").optional().default(null),

})
const dateOfClass = Joi.object({
  classId: uv7.label("Mã lớp học"),
  date: vDate.label("Ngày"),
})


const modify = Joi.object({
  dayOfWeek: dayOfWeek,
  period: period
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
  dateOfClass,
  teachers
};