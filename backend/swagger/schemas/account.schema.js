module.exports = {
  Account: {
    type: 'object',
    required: ['username', 'password_hash'],
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: '账户ID'
      },
      username: {
        type: 'string',
        example: 'patient001',
        description: '用户名'
      },
      password_hash: {
        type: 'string',
        example: '$2b$10$N9qo8uLOickgx2ZMRZoMye',
        description: '加密后的密码',
        writeOnly: true
      },
      role: {
        type: 'string',
        enum: ['user', 'admin', 'doctor'],
        example: 'user',
        description: '用户角色'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:30:00Z',
        readOnly: true
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:30:00Z',
        readOnly: true
      }
    }
  },
  
  Profile: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1
      },
      account_id: {
        type: 'integer',
        example: 1
      },
      display_name: {
        type: 'string',
        example: '张三'
      },
      phone: {
        type: 'string',
        example: '13800138000'
      },
      gender: {
        type: 'string',
        enum: ['M', 'F'],
        example: 'M'
      },
      birthday: {
        type: 'string',
        format: 'date',
        example: '1990-01-01'
      },
      address: {
        type: 'string',
        example: '北京市海淀区'
      },
      idcard: {
        type: 'string',
        example: '110101199001011234'
      },
      extra: {
        type: 'object',
        description: '扩展信息',
        example: {
          emergency_contact: '李四',
          emergency_phone: '13900139000',
          allergies: '青霉素'
        }
      }
    }
  },
  
  LoginRequest: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        example: 'patient001'
      },
      password: {
        type: 'string',
        example: 'password123',
        format: 'password'
      }
    }
  },
  
  LoginResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              username: { type: 'string' },
              role: { type: 'string' }
            }
          }
        }
      }
    }
  }
};