module.exports = {
  // 医生排班基础模型
  Availability: {
    type: 'object',
    required: ['doctor_id', 'date', 'slot'],
    properties: {
      id: {
        type: 'integer',
        example: 50,
        description: '排班ID'
      },
      doctor_id: {
        type: 'integer',
        example: 5,
        description: '医生ID'
      },
      date: {
        type: 'string',
        format: 'date',
        example: '2024-01-20',
        description: '排班日期'
      },
      slot: {
        type: 'string',
        enum: ['8-10', '10-12', '14-16', '16-18'],
        example: '8-10',
        description: '时间段'
      },
      capacity: {
        type: 'integer',
        minimum: 1,
        maximum: 50,
        default: 20,
        example: 20,
        description: '总容量'
      },
      booked: {
        type: 'integer',
        minimum: 0,
        default: 0,
        example: 5,
        description: '已预约数',
        readOnly: true
      },
      available: {
        type: 'integer',
        example: 15,
        description: '剩余可预约数（计算字段）',
        readOnly: true
      },
      extra: {
        type: 'object',
        description: '扩展信息（JSON格式）',
        properties: {
          capacity_types: {
            type: 'object',
            additionalProperties: {
              type: 'integer',
              minimum: 0
            },
            description: '各类型的容量配置',
            example: {
              '普通': 15,
              '专家': 5,
              '特需': 2
            }
          },
          booked_types: {
            type: 'object',
            additionalProperties: {
              type: 'integer',
              minimum: 0
            },
            description: '各类型的已预约数',
            example: {
              '普通': 3,
              '专家': 1,
              '特需': 0
            }
          },
          price_by_type: {
            type: 'object',
            additionalProperties: {
              type: 'number',
              minimum: 0
            },
            description: '各类型的价格',
            example: {
              '普通': 20.00,
              '专家': 50.00,
              '特需': 100.00
            }
          },
          notes: {
            type: 'string',
            description: '排班备注',
            example: '仅限复诊患者'
          }
        },
        example: {
          capacity_types: { '普通': 15, '专家': 5 },
          booked_types: { '普通': 3, '专家': 1 },
          price_by_type: { '普通': 20.00, '专家': 50.00 }
        }
      },
      available_by_type: {
        type: 'object',
        additionalProperties: {
          type: 'integer',
          minimum: 0
        },
        description: '各类型剩余数量（计算字段）',
        readOnly: true,
        example: {
          '普通': 12,
          '专家': 4
        }
      },
      is_available: {
        type: 'boolean',
        default: true,
        example: true,
        description: '是否可用'
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
      },
      // 关联信息（查询时可选返回）
      doctor_name: {
        type: 'string',
        example: '张医生',
        description: '医生姓名',
        readOnly: true
      },
      department_name: {
        type: 'string',
        example: '内科',
        description: '科室名称',
        readOnly: true
      }
    }
  },

  // 排班创建请求
  AvailabilityCreateRequest: {
    type: 'object',
    required: ['doctor_id', 'date', 'slot'],
    properties: {
      doctor_id: {
        type: 'integer',
        example: 5
      },
      date: {
        type: 'string',
        format: 'date',
        example: '2024-01-20'
      },
      slot: {
        type: 'string',
        enum: ['8-10', '10-12', '14-16', '16-18'],
        example: '8-10'
      },
      capacity: {
        type: 'integer',
        minimum: 1,
        maximum: 50,
        default: 20,
        example: 20
      },
      extra: {
        type: 'object',
        description: '扩展信息',
        example: {
          capacity_types: { '普通': 15, '专家': 5 },
          price_by_type: { '普通': 20.00, '专家': 50.00 }
        }
      },
      is_available: {
        type: 'boolean',
        default: true
      }
    }
  },

  // 排班更新请求
  AvailabilityUpdateRequest: {
    type: 'object',
    properties: {
      capacity: {
        type: 'integer',
        minimum: 1,
        maximum: 50
      },
      extra: {
        type: 'object'
      },
      is_available: {
        type: 'boolean'
      }
    }
  },

  // 医生为自己创建排班的请求（不需要doctor_id）
  AvailabilitySelfCreateRequest: {
    type: 'object',
    required: ['date', 'slot'],
    properties: {
      date: {
        type: 'string',
        format: 'date',
        example: '2024-01-20'
      },
      slot: {
        type: 'string',
        enum: ['8-10', '10-12', '14-16', '16-18'],
        example: '8-10'
      },
      capacity: {
        type: 'integer',
        minimum: 1,
        maximum: 50,
        default: 20
      },
      extra: {
        type: 'object',
        description: '扩展信息'
      }
    }
  },

  // 排班响应（带关联信息）
  AvailabilityWithDetails: {
    type: 'object',
    allOf: [
      { $ref: '#/components/schemas/Availability' }
    ],
    properties: {
      doctor: {
        $ref: '#/components/schemas/Doctor'
      },
      department: {
        $ref: '#/components/schemas/Department'
      },
      upcoming_bookings: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Order'
        },
        description: '即将到来的预约'
      }
    }
  }
};