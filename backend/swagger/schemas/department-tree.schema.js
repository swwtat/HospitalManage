module.exports = {
  DepartmentTree: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      code: { type: 'string' },
      parent_id: { 
        type: 'integer',
        nullable: true 
      },
      children: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/DepartmentTree'
        }
      },
      doctor_count: {
        type: 'integer',
        description: '医生数量'
      },
      available_doctors: {
        type: 'integer',
        description: '可用医生数量'
      },
      doctors: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Doctor'
        },
        description: '医生列表（当include_doctors=true时）'
      }
    }
  }
};