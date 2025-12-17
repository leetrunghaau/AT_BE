const Joi = require('joi');

const studentId = Joi.string()
    .pattern(/^HS-\d{6}$/)
    .required()
    .messages({
        'string.empty': 'Mã học sinh là bắt buộc',
        'string.pattern.base': 'Mã học sinh phải có định dạng HS-xxxxxx (6 chữ số)',
        'any.required': 'Mã học sinh là bắt buộc',
    })
const name = Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
        'string.empty': 'Họ và tên là bắt buộc',
        'string.min': 'Họ và tên phải ít nhất 2 ký tự',
        'string.max': 'Họ và tên không quá 50 ký tự',
        'any.required': 'Họ và tên là bắt buộc',
    })

const phone = Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .allow(null, '')
    .messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ',
    })
const uv7 = Joi.string()
    .guid({ version: ['uuidv7'] })
    .required()
    .messages({
        'string.guid': '{#label} phải là UUID hợp lệ',
        'any.required': '{#label} là bắt buộc',
    })
const gender = Joi.string()
    .valid('male', 'female')
    .required()
    .messages({
        'any.only': 'Giới tính phải là "male" hoặc "female"',
        'any.required': 'Giới tính là bắt buộc',
    })
const p = Joi.number()
    .integer()
    .min(1)
    .allow(null | undefined)
    .optional()
    .default(1)
    .messages({
        'number.base': 'Trang phải là một số',
        'number.integer': 'Trang phải là số nguyên',
        'number.min': 'Trang phải lớn hơn hoặc bằng 1',
    })
const l = Joi.number()
    .integer()
    .min(1)
    .allow(null | undefined)
    .optional()
    .default(10)
    .messages({
        'number.base': 'Số lượng phải là một số',
        'number.integer': 'Số lượng phải là số nguyên',
        'number.min': 'Số lượng phải lớn hơn hoặc bằng 1',
    })
const s = Joi.string()
    .allow(null, '')
    .optional()
    .default(null)
    .messages({
        'string.base': 'Từ khóa tìm kiếm phải là chuỗi',
    })
const vDate = Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
        'string.empty': '{#label} là bắt buộc',
        'string.pattern.base': '{#label} phải có định dạng YYYY-MM-DD',
        'any.required': '{#label} là bắt buộc',
    })
const dayOfWeek = Joi.number()
    .min(0)
    .max(6)
    .required()
    .messages({
        'number.base': 'Ngày trong tuần phải là số',
        'number.min': 'Ngày trong tuần phải từ 0 (Chủ nhật) trở đi',
        'number.max': 'Ngày trong tuần phải nhỏ hơn hoặc bằng 6 (Thứ 7)',
        'any.required': 'Ngày trong tuần là bắt buộc',
    })

const period = Joi.number()
    .min(1)
    .max(9)
    .required()
    .messages({
        'number.base': 'Tiết học phải là số',
        'number.min': 'Tiết học phải từ 1 trở đi',
        'number.max': 'Tiết học tối đa là 9',
        'any.required': 'Tiết học là bắt buộc',
    })

    module.exports = {
        p,
        l,
        s,
        studentId,
        name,
        phone,
        uv7,
        gender,
        vDate,
        dayOfWeek,
        period
    }