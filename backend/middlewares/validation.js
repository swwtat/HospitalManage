const Joi = require('joi');

const schemas = {
  // 认证相关
  login: Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    password: Joi.string().min(6).max(100).required()
  }),
  
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid('user', 'doctor').default('user'),
    email: Joi.string().email().optional()
  }),
  
  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(100).required()
  }),
  
  // 医生相关
  doctorCreate: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    department_id: Joi.number().integer().positive().required(),
    title: Joi.string().max(100).optional(),
    bio: Joi.string().max(1000).optional(),
    contact: Joi.string().max(50).optional(),
    account_id: Joi.number().integer().positive().optional()
  }),
  
  // 排班相关
  availability: Joi.object({
    date: Joi.date().iso().required(),
    slot: Joi.string().valid('8-10', '10-12', '14-16', '16-18').required(),
    capacity: Joi.number().integer().min(1).max(50).default(20),
    extra: Joi.object().optional()
  }),
  
  // 预约相关
  createRegistration: Joi.object({
    doctor_id: Joi.number().integer().positive().optional(),
    department_id: Joi.number().integer().positive().optional(),
    sub_department_id: Joi.number().integer().positive().optional(),
    date: Joi.date().iso().required(),
    slot: Joi.string().valid('8-10', '10-12', '14-16', '16-18').required(),
    note: Joi.string().max(500).optional()
  }),
  
  // 支付相关
  createPayment: Joi.object({
    order_id: Joi.number().integer().positive().optional(),
    amount: Joi.number().positive().precision(2).required(),
    currency: Joi.string().default('CNY')
  }),
  
  // 患者资料
  patientProfile: Joi.object({
    display_name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required(),
    gender: Joi.string().valid('M', 'F').required(),
    birthday: Joi.date().iso().max('now').optional(),
    address: Joi.string().max(255).optional(),
    idcard: Joi.string().pattern(/^\d{17}[\dX]$/).optional(),
    extra: Joi.object().optional()
  })
};

function validate(schemaName) {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return next(new Error(`验证模式 ${schemaName} 不存在`));
    }
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));
      
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors
      });
    }
    
    // 将验证后的数据存储到请求对象
    req.validatedBody = value;
    next();
  };
}

module.exports = {
  validate,
  schemas
};