module.exports = {
  // 医生基础模型
  Doctor: {
    type: 'object',
    required: ['name', 'department_id'],
    properties: {
      id: {
        type: 'integer',
        example: 5,
        description: '医生ID'
      },
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: '张明医生',
        description: '医生姓名'
      },
      account_id: {
        type: 'integer',
        nullable: true,
        example: 100,
        description: '关联的用户账户ID（医生登录用）'
      },
      department_id: {
        type: 'integer',
        example: 3,
        description: '所属科室ID'
      },
      title: {
        type: 'string',
        maxLength: 100,
        example: '主任医师',
        description: '职称'
      },
      bio: {
        type: 'string',
        maxLength: 2000,
        example: '擅长心血管疾病的诊治，拥有20年临床经验...',
        description: '个人简介'
      },
      specialty: {
        type: 'string',
        maxLength: 500,
        example: '高血压、冠心病、心律失常',
        description: '专业擅长'
      },
      contact: {
        type: 'string',
        maxLength: 50,
        example: '13800138000',
        description: '联系电话'
      },
      email: {
        type: 'string',
        format: 'email',
        maxLength: 100,
        example: 'zhangming@hospital.edu.cn',
        description: '电子邮箱'
      },
      photo_url: {
        type: 'string',
        example: '/images/doctors/zhangming.jpg',
        description: '照片URL'
      },
      consultation_fee: {
        type: 'number',
        minimum: 0,
        example: 50.00,
        description: '诊费（元）'
      },
      is_available: {
        type: 'boolean',
        default: true,
        example: true,
        description: '是否在职'
      },
      is_approved: {
        type: 'boolean',
        default: true,
        example: true,
        description: '是否已审核通过',
        readOnly: true
      },
      rating: {
        type: 'number',
        minimum: 0,
        maximum: 5,
        example: 4.8,
        description: '评分',
        readOnly: true
      },
      review_count: {
        type: 'integer',
        minimum: 0,
        example: 128,
        description: '评价数量',
        readOnly: true
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00Z',
        readOnly: true
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00Z',
        readOnly: true
      },
      // 关联信息（查询时可选返回）
      department_name: {
        type: 'string',
        example: '内科',
        description: '科室名称',
        readOnly: true
      },
      department_code: {
        type: 'string',
        example: 'NEIKE',
        description: '科室代码',
        readOnly: true
      },
      account_username: {
        type: 'string',
        example: 'dr_zhangming',
        description: '关联账户用户名',
        readOnly: true
      }
    }
  },

  // 医生创建请求（管理员用）
  DoctorCreateRequest: {
    type: 'object',
    required: ['name', 'department_id'],
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: '王医生'
      },
      department_id: {
        type: 'integer',
        example: 3
      },
      account_id: {
        type: 'integer',
        nullable: true,
        example: 100
      },
      title: {
        type: 'string',
        maxLength: 100,
        example: '副主任医师'
      },
      bio: {
        type: 'string',
        maxLength: 2000,
        example: '专业擅长...'
      },
      specialty: {
        type: 'string',
        maxLength: 500,
        example: '糖尿病、甲状腺疾病'
      },
      contact: {
        type: 'string',
        maxLength: 50,
        example: '13900139000'
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'wang@hospital.edu.cn'
      },
      photo_url: {
        type: 'string',
        example: '/images/doctors/wang.jpg'
      },
      consultation_fee: {
        type: 'number',
        minimum: 0,
        example: 30.00
      }
    }
  },

  // 医生更新请求
  DoctorUpdateRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100
      },
      department_id: {
        type: 'integer'
      },
      title: {
        type: 'string',
        maxLength: 100
      },
      bio: {
        type: 'string',
        maxLength: 2000
      },
      specialty: {
        type: 'string',
        maxLength: 500
      },
      contact: {
        type: 'string',
        maxLength: 50
      },
      email: {
        type: 'string',
        format: 'email'
      },
      photo_url: {
        type: 'string'
      },
      consultation_fee: {
        type: 'number',
        minimum: 0
      },
      is_available: {
        type: 'boolean'
      }
    }
  },

  // 医生为自己更新信息的请求
  DoctorSelfUpdateRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        maxLength: 100
      },
      bio: {
        type: 'string',
        maxLength: 2000
      },
      specialty: {
        type: 'string',
        maxLength: 500
      },
      contact: {
        type: 'string',
        maxLength: 50
      },
      email: {
        type: 'string',
        format: 'email'
      },
      photo_url: {
        type: 'string'
      }
    }
  },

  // 医生详情（带关联信息）
  DoctorDetail: {
    type: 'object',
    allOf: [
      { $ref: '#/components/schemas/Doctor' }
    ],
    properties: {
      department: {
        $ref: '#/components/schemas/Department'
      },
      account: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          username: { type: 'string' },
          role: { type: 'string' }
        },
        nullable: true
      },
      today_availability: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Availability'
        },
        description: '今日排班'
      },
      upcoming_availability: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Availability'
        },
        description: '近期排班'
      },
      statistics: {
        type: 'object',
        properties: {
          total_appointments: { type: 'integer' },
          today_appointments: { type: 'integer' },
          waiting_appointments: { type: 'integer' },
          average_rating: { type: 'number' }
        }
      },
      reviews: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            patient_name: { type: 'string' },
            rating: { type: 'number' },
            comment: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        description: '最新评价'
      }
    }
  },

  // 医生列表项（简化版）
  DoctorListItem: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      title: { type: 'string' },
      department_name: { type: 'string' },
      specialty: { type: 'string' },
      photo_url: { type: 'string', nullable: true },
      rating: { type: 'number' },
      review_count: { type: 'integer' },
      consultation_fee: { type: 'number' },
      is_available: { type: 'boolean' },
      available_slots_today: {
        type: 'integer',
        description: '今日可用号源'
      }
    }
  }
};