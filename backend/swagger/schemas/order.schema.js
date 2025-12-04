module.exports = {
  Order: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1001,
        description: '订单ID'
      },
      account_id: {
        type: 'integer',
        example: 5,
        description: '患者账户ID'
      },
      department_id: {
        type: 'integer',
        example: 3,
        description: '科室ID'
      },
      sub_department_id: {
        type: 'integer',
        example: 10,
        description: '子科室ID'
      },
      doctor_id: {
        type: 'integer',
        example: 20,
        description: '医生ID'
      },
      availability_id: {
        type: 'integer',
        example: 50,
        description: '排班ID'
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
      is_waitlist: {
        type: 'boolean',
        example: false,
        description: '是否为候补'
      },
      priority: {
        type: 'integer',
        example: 0,
        description: '候补优先级'
      },
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'waiting', 'cancelled', 'completed'],
        example: 'confirmed'
      },
      queue_number: {
        type: 'integer',
        example: 5,
        description: '排队号'
      },
      note: {
        type: 'string',
        example: '提前10分钟到达'
      },
      payment_id: {
        type: 'integer',
        example: 5001,
        description: '支付ID'
      }
    }
  }
};