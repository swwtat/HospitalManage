const path = require('path');
const accountSchema = require('./schemas/account.schema');
const doctorSchema = require('./schemas/doctor.schema');
const departmentSchema = require('./schemas/department.schema');
const availabilitySchema = require('./schemas/availability.schema');
const orderSchema = require('./schemas/order.schema');
const paymentSchema = require('./schemas/payment.schema');
const notificationSchema = require('./schemas/notification.schema');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '校医院挂号管理系统 API',
    version: '1.0.0',
    description: '校医院在线挂号系统 RESTful API 文档，支持患者挂号、医生排班、管理员管理等功能',
    contact: {
      name: '技术支持',
      email: 'tech@hospital.edu.cn',
      url: 'https://hospital.edu.cn'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '本地开发服务器'
    },
    {
      url: 'https://api.hospital.edu.cn/api',
      description: '生产服务器'
    },
    
  ],
  tags: [
    {
      name: '认证',
      description: '用户注册、登录、密码管理'
    },
    {
      name: '公共',
      description: '公开访问的接口，如科室信息'
    },
    {
      name: '患者',
      description: '患者相关操作，如个人信息、挂号'
    },
    {
      name: '医生',
      description: '医生相关操作，如排班管理、查看预约'
    },
    {
      name: '管理员',
      description: '系统管理功能，需要管理员权限'
    },
    {
      name: '支付',
      description: '在线支付相关接口'
    },
    {
      name: '通知',
      description: '系统通知订阅与管理'
    },
    {
      name: 'AI助手',
      description: 'AI智能问诊和建议'
    },
    {
      name: '消息队列',
      description: '消息队列测试和管理'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT 访问令牌，格式: Bearer <token>'
      }
    },
    schemas: {
      // 导入所有数据模型
      ...accountSchema,
      ...doctorSchema,
      ...departmentSchema,
      ...availabilitySchema,
      ...orderSchema,
      ...paymentSchema,
      ...notificationSchema,
      
       // AI 相关
    AIChatRequest: {
      type: 'object',
      required: ['message'],
      properties: {
        message: {
          type: 'string',
          minLength: 1,
          maxLength: 1000
        },
        conversationContext: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', enum: ['user', 'assistant'] },
              content: { type: 'string' }
            }
          }
        }
      }
    },
    
    AIChatResponse: {
      type: 'object',
      properties: {
        reply: { type: 'string' },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['navigate', 'book', 'remind'] },
              label: { type: 'string' },
              data: { type: 'object' }
            }
          }
        },
        suggestions: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    },
    
    // MQ 相关
    MQPublishRequest: {
      type: 'object',
      required: ['routingKey', 'message'],
      properties: {
        routingKey: { type: 'string' },
        message: { type: 'object' },
        options: {
          type: 'object',
          properties: {
            persistent: { type: 'boolean', default: true }
          }
        }
      }
    },
    
    MQStatus: {
      type: 'object',
      properties: {
        connected: { type: 'boolean' },
        url: { type: 'string' },
        stats: {
          type: 'object',
          properties: {
            published: { type: 'integer' },
            consumed: { type: 'integer' },
            errors: { type: 'integer' }
          }
        },
        queues: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              messages: { type: 'integer' },
              consumers: { type: 'integer' }
            }
          }
        },
        disabled: { type: 'boolean' }
      }
    },
      // 通用响应模型
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: '操作成功'
          },
          data: {
            oneOf: [
              { type: 'object' },
              { type: 'array' },
              { type: 'string' },
              { type: 'number' },
              { type: 'boolean' }
            ],
            description: '返回的数据'
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 20 },
              total: { type: 'integer', example: 100 },
              totalPages: { type: 'integer', example: 5 },
              hasNext: { type: 'boolean', example: true }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            example: '错误信息描述'
          },
          code: {
            type: 'integer',
            example: 400
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' }
              }
            }
          }
        }
      },
        // 挂号相关
    Registration: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        account_id: { type: 'integer' },
        doctor_id: { type: 'integer', nullable: true },
        department_id: { type: 'integer', nullable: true },
        sub_department_id: { type: 'integer', nullable: true },
        availability_id: { type: 'integer', nullable: true },
        date: { type: 'string', format: 'date' },
        slot: { 
          type: 'string',
          enum: ['8-10', '10-12', '14-16', '16-18']
        },
        is_waitlist: { type: 'boolean' },
        priority: { type: 'integer' },
        status: {
          type: 'string',
          enum: ['pending', 'confirmed', 'waiting', 'cancelled', 'completed']
        },
        queue_number: { type: 'integer', nullable: true },
        note: { type: 'string', nullable: true },
        symptoms: {
          type: 'array',
          items: { type: 'string' }
        },
        doctor_name: { type: 'string', nullable: true },
        department_name: { type: 'string', nullable: true },
        payment_status: { 
          type: 'string',
          enum: ['none', 'pending', 'paid', 'refunded']
        },
        created_at: { type: 'string', format: 'date-time' }
      }
    },
    
    RegistrationCreateRequest: {
      type: 'object',
      required: ['date', 'slot'],
      properties: {
        doctor_id: { type: 'integer', nullable: true },
        department_id: { type: 'integer', nullable: true },
        sub_department_id: { type: 'integer', nullable: true },
        date: { type: 'string', format: 'date' },
        slot: { 
          type: 'string',
          enum: ['8-10', '10-12', '14-16', '16-18']
        },
        note: { type: 'string', maxLength: 500 },
        symptoms: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    },
    ...require('./schemas/payment.schema'),
    ...require('./schemas/department-tree.schema'),
    ...require('./schemas/notification.schema')
    },
    parameters: {
      // 通用参数定义
      pageParam: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', default: 1, minimum: 1 },
        description: '页码'
      },
      limitParam: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
        description: '每页数量'
      },
      dateParam: {
        name: 'date',
        in: 'query',
        schema: { type: 'string', format: 'date' },
        description: '日期 (YYYY-MM-DD)'
      },
      doctorIdParam: {
        name: 'doctorId',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
        description: '医生ID'
      },
      orderIdParam: {
        name: 'orderId',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
        description: '订单ID'
      },
      departmentIdParam: {
        name: 'departmentId',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
        description: '科室ID'
      }
    },
    responses: {
      // 通用响应定义
      UnauthorizedError: {
        description: '未授权访问',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            },
            example: {
              success: false,
              error: '未提供有效的访问令牌',
              code: 401
            }
          }
        }
      },
      ForbiddenError: {
        description: '权限不足',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            },
            example: {
              success: false,
              error: '权限不足，需要管理员权限',
              code: 403
            }
          }
        }
      },
      NotFoundError: {
        description: '资源不存在',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            },
            example: {
              success: false,
              error: '资源不存在',
              code: 404
            }
          }
        }
      },
      ValidationError: {
        description: '参数验证失败',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            },
            example: {
              success: false,
              error: '参数验证失败',
              code: 400,
              details: [
                { field: 'username', message: '用户名不能为空' }
              ]
            }
          }
        }
      }
    }
  },
  externalDocs: {
    description: '了解更多关于校医院挂号系统',
    url: 'https://docs.hospital.edu.cn'
  }
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js'),
    path.join(__dirname, './tags/*.js')
  ]
};

module.exports = options;