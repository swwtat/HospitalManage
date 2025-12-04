module.exports = {
  // 通知基础模型
  Notification: {
    type: 'object',
    required: ['account_id', 'event_type'],
    properties: {
      id: {
        type: 'integer',
        example: 1001,
        description: '通知ID'
      },
      account_id: {
        type: 'integer',
        example: 5,
        description: '接收用户ID'
      },
      event_type: {
        type: 'string',
        example: 'order.created',
        description: '事件类型',
        enum: [
          'order.created',        // 订单创建
          'order.confirmed',      // 订单确认
          'order.waiting',        // 进入候补
          'order.promoted',       // 候补转正
          'order.cancelled',      // 订单取消
          'order.completed',      // 订单完成
          'payment.success',      // 支付成功
          'payment.failed',       // 支付失败
          'appointment.reminder', // 就诊提醒
          'appointment.arrival',  // 到院提醒
          'doctor.available',     // 医生排班更新
          'system.announcement',  // 系统公告
          'review.invite'         // 评价邀请
        ]
      },
      title: {
        type: 'string',
        example: '挂号成功',
        description: '通知标题'
      },
      content: {
        type: 'string',
        example: '您已成功预约张医生，就诊时间：2024-01-20 10:30',
        description: '通知内容'
      },
      payload: {
        type: 'object',
        description: '事件原始数据（JSON格式）',
        example: {
          order_id: 1001,
          doctor_name: '张医生',
          appointment_time: '2024-01-20T10:30:00Z',
          department_name: '内科',
          queue_number: 3
        }
      },
      category: {
        type: 'string',
        enum: ['appointment', 'payment', 'system', 'reminder'],
        default: 'appointment',
        example: 'appointment',
        description: '通知分类'
      },
      priority: {
        type: 'string',
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal',
        example: 'normal',
        description: '优先级'
      },
      is_read: {
        type: 'boolean',
        default: false,
        example: false,
        description: '是否已读'
      },
      is_delivered: {
        type: 'boolean',
        default: false,
        example: true,
        description: '是否已送达',
        readOnly: true
      },
      delivered_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:30:05Z',
        description: '送达时间',
        readOnly: true
      },
      read_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:35:00Z',
        description: '阅读时间',
        nullable: true
      },
      expires_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-22T10:30:00Z',
        description: '过期时间'
      },
      action_url: {
        type: 'string',
        example: '/appointments/1001',
        description: '操作链接'
      },
      action_label: {
        type: 'string',
        example: '查看详情',
        description: '操作标签'
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

  // 通知创建请求（系统内部使用）
  NotificationCreateRequest: {
    type: 'object',
    required: ['account_id', 'event_type'],
    properties: {
      account_id: {
        type: 'integer',
        example: 5
      },
      event_type: {
        type: 'string',
        example: 'order.created'
      },
      title: {
        type: 'string',
        example: '挂号成功'
      },
      content: {
        type: 'string',
        example: '您已成功预约张医生'
      },
      payload: {
        type: 'object',
        example: {
          order_id: 1001,
          doctor_name: '张医生'
        }
      },
      category: {
        type: 'string',
        enum: ['appointment', 'payment', 'system', 'reminder'],
        default: 'appointment'
      },
      priority: {
        type: 'string',
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
      },
      expires_at: {
        type: 'string',
        format: 'date-time'
      },
      action_url: {
        type: 'string'
      },
      action_label: {
        type: 'string'
      }
    }
  },

  // 批量通知创建请求
  NotificationBatchCreateRequest: {
    type: 'object',
    required: ['account_ids', 'event_type'],
    properties: {
      account_ids: {
        type: 'array',
        items: {
          type: 'integer'
        },
        minItems: 1,
        example: [5, 6, 7]
      },
      event_type: {
        type: 'string',
        example: 'system.announcement'
      },
      title: {
        type: 'string',
        example: '系统维护通知'
      },
      content: {
        type: 'string',
        example: '系统将于今晚进行维护...'
      },
      payload: {
        type: 'object'
      }
    }
  },

  // 通知更新请求（标记已读等）
  NotificationUpdateRequest: {
    type: 'object',
    properties: {
      is_read: {
        type: 'boolean'
      },
      read_at: {
        type: 'string',
        format: 'date-time'
      }
    }
  },

  // 通知订阅请求
  NotificationSubscriptionRequest: {
    type: 'object',
    required: ['channel'],
    properties: {
      channel: {
        type: 'string',
        enum: ['websocket', 'sse', 'email', 'sms', 'push'],
        example: 'websocket',
        description: '通知通道'
      },
      events: {
        type: 'array',
        items: {
          type: 'string'
        },
        example: ['order.created', 'order.cancelled', 'appointment.reminder'],
        description: '订阅的事件类型'
      },
      endpoint: {
        type: 'string',
        example: 'user123-socket-id',
        description: '推送端点（如WebSocket连接ID、邮箱地址等）'
      },
      preferences: {
        type: 'object',
        properties: {
          quiet_hours_start: {
            type: 'string',
            format: 'time',
            example: '22:00',
            description: '免打扰开始时间'
          },
          quiet_hours_end: {
            type: 'string',
            format: 'time',
            example: '08:00',
            description: '免打扰结束时间'
          },
          enable_email: {
            type: 'boolean',
            default: true,
            description: '启用邮件通知'
          },
          enable_sms: {
            type: 'boolean',
            default: false,
            description: '启用短信通知'
          },
          enable_push: {
            type: 'boolean',
            default: true,
            description: '启用推送通知'
          }
        }
      },
      expires_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-02-15T10:30:00Z',
        description: '订阅过期时间'
      }
    }
  },

  // 通知订阅响应
  NotificationSubscription: {
    type: 'object',
    properties: {
      subscription_id: {
        type: 'string',
        example: 'sub_123456'
      },
      account_id: {
        type: 'integer',
        example: 5
      },
      channel: {
        type: 'string',
        enum: ['websocket', 'sse', 'email', 'sms', 'push']
      },
      events: {
        type: 'array',
        items: { type: 'string' }
      },
      endpoint: {
        type: 'string',
        example: 'user123-socket-id'
      },
      is_active: {
        type: 'boolean',
        example: true
      },
      expires_at: {
        type: 'string',
        format: 'date-time'
      },
      created_at: {
        type: 'string',
        format: 'date-time'
      }
    }
  },

  // 通知统计
  NotificationStats: {
    type: 'object',
    properties: {
      total: {
        type: 'integer',
        example: 150,
        description: '总通知数'
      },
      unread: {
        type: 'integer',
        example: 12,
        description: '未读通知数'
      },
      by_category: {
        type: 'object',
        properties: {
          appointment: { type: 'integer' },
          payment: { type: 'integer' },
          system: { type: 'integer' },
          reminder: { type: 'integer' }
        }
      },
      by_priority: {
        type: 'object',
        properties: {
          urgent: { type: 'integer' },
          high: { type: 'integer' },
          normal: { type: 'integer' },
          low: { type: 'integer' }
        }
      },
      delivery_rate: {
        type: 'number',
        format: 'float',
        example: 98.5,
        description: '送达率（百分比）'
      },
      read_rate: {
        type: 'number',
        format: 'float',
        example: 85.2,
        description: '阅读率（百分比）'
      }
    }
  }
};