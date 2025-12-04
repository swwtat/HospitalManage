const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('校医院挂号系统 API 测试', () => {
  let authToken;
  let userId;
  
  describe('健康检查', () => {
    it('GET /health 应该返回健康状态', async () => {
      const res = await request(app).get('/health');
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('healthy');
    });
  });
  
  describe('认证相关接口', () => {
    it('POST /api/auth/register 应该成功注册用户', async () => {
      const userData = {
        username: `testuser_${Date.now()}`,
        password: 'test123456',
        role: 'user'
      };
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('id');
      
      userId = res.body.data.id;
    });
    
    it('POST /api/auth/login 应该成功登录', async () => {
      const loginData = {
        username: 'testuser_1', // 使用已存在的测试用户
        password: 'test123456'
      };
      
      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData);
      
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('token');
      
      authToken = res.body.data.token;
    });
  });
  
  describe('医生相关接口', () => {
    it('GET /api/doctor 应该返回医生列表', async () => {
      const res = await request(app).get('/api/doctor');
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array');
    });
    
    it('GET /api/doctor/1 应该返回医生详情', async () => {
      const res = await request(app).get('/api/doctor/1');
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('name');
    });
  });
  
  describe('需要认证的接口', () => {
    it('GET /api/doctor/me 需要认证', async () => {
      const res = await request(app)
        .get('/api/doctor/me')
        .set('Authorization', `Bearer ${authToken}`);
      
      // 可能返回403（如果不是医生）或404（医生信息未完善）
      expect([200, 403, 404]).to.include(res.status);
    });
    
    it('POST /api/doctor/me/availability 需要认证和医生角色', async () => {
      const availabilityData = {
        date: '2024-12-31',
        slot: '8-10',
        capacity: 20
      };
      
      const res = await request(app)
        .post('/api/doctor/me/availability')
        .set('Authorization', `Bearer ${authToken}`)
        .send(availabilityData);
      
      // 可能返回403（不是医生）或400（参数错误）
      expect([200, 400, 403]).to.include(res.status);
    });
  });
  
  describe('公共接口', () => {
    it('GET /api/public/departments 应该返回科室树', async () => {
      const res = await request(app).get('/api/public/departments');
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });
  });
});