module.exports = {
  // 科室基础模型
  Department: {
    type: 'object',
    required: ['name'],
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: '科室ID'
      },
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: '内科',
        description: '科室名称'
      },
      code: {
        type: 'string',
        pattern: '^[A-Z0-9_]+$',
        maxLength: 50,
        example: 'NEIKE',
        description: '科室代码（唯一）'
      },
      parent_id: {
        type: 'integer',
        nullable: true,
        example: null,
        description: '父科室ID，null表示一级科室'
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
      // 统计信息（查询时可选返回）
      doctor_count: {
        type: 'integer',
        example: 10,
        description: '医生总数',
        readOnly: true
      },
      available_doctors: {
        type: 'integer',
        example: 8,
        description: '可用医生数',
        readOnly: true
      },
      sub_department_count: {
        type: 'integer',
        example: 3,
        description: '子科室数量',
        readOnly: true
      }
    }
  },

  // 科室创建请求
  DepartmentCreateRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: '心血管内科'
      },
      code: {
        type: 'string',
        pattern: '^[A-Z0-9_]+$',
        maxLength: 50,
        example: 'XXGN'
      },
      parent_id: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: '父科室ID，null表示一级科室'
      }
    }
  },

  // 科室更新请求
  DepartmentUpdateRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100
      },
      code: {
        type: 'string',
        pattern: '^[A-Z0-9_]+$',
        maxLength: 50
      },
      parent_id: {
        type: 'integer',
        nullable: true
      }
    }
  },

  // 带父级信息的科室
  DepartmentWithParent: {
    type: 'object',
    allOf: [
      { $ref: '#/components/schemas/Department' }
    ],
    properties: {
      parent: {
        $ref: '#/components/schemas/Department',
        nullable: true,
        description: '父科室信息'
      }
    }
  },

  // 带子科室的科室
  DepartmentWithChildren: {
    type: 'object',
    allOf: [
      { $ref: '#/components/schemas/Department' }
    ],
    properties: {
      children: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Department'
        },
        description: '子科室列表'
      }
    }
  },

  // 科室详情（带医生列表）
  DepartmentDetail: {
    type: 'object',
    allOf: [
      { $ref: '#/components/schemas/Department' }
    ],
    properties: {
      parent: {
        $ref: '#/components/schemas/Department',
        nullable: true
      },
      children: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Department'
        }
      },
      doctors: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Doctor'
        },
        description: '科室医生列表'
      },
      statistics: {
        type: 'object',
        properties: {
          total_doctors: { type: 'integer' },
          available_doctors: { type: 'integer' },
          total_appointments_today: { type: 'integer' },
          available_slots_today: { type: 'integer' }
        }
      }
    }
  }
};