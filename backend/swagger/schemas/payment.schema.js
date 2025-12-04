module.exports = {
  Payment: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 5001,
        description: '支付ID'
      },
      account_id: {
        type: 'integer',
        example: 5,
        description: '支付账户ID'
      },
      order_id: {
        type: 'integer',
        example: 1001,
        description: '关联订单ID'
      },
      amount: {
        type: 'number',
        format: 'float',
        example: 25.00,
        description: '支付金额'
      },
      currency: {
        type: 'string',
        example: 'CNY',
        description: '货币类型'
      },
      status: {
        type: 'string',
        enum: ['created', 'paid', 'failed', 'refunded'],
        example: 'paid',
        description: '支付状态'
      },
      provider_info: {
        type: 'object',
        description: '支付提供商信息',
        properties: {
          provider: {
            type: 'string',
            enum: ['wechat', 'alipay', 'unionpay', 'cash']
          },
          transaction_id: { type: 'string' },
          prepay_id: { type: 'string' },
          qr_code: { type: 'string' },
          payer_account: { type: 'string' }
        }
      },
      paid_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:31:00Z',
        description: '支付时间'
      },
      created_at: {
        type: 'string',
        format: 'date-time'
      },
      updated_at: {
        type: 'string',
        format: 'date-time'
      }
    }
  }
};