const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AccountModel = require('../schemas/accountModels');
const config = require('../config/default');

const SECRET = config.jwtSecret || 'change_this_secret';

const AuthService = {
  async register(username, password) {
    const existing = await AccountModel.findByUsername(username);
    if (existing) {
      console.log('Registration attempt with existing username:', username);
      throw new Error('用户名已存在');
    }

    const hash = await bcrypt.hash(password, 10);
    const userId = await AccountModel.create(username, hash);
    console.log('New user registered with ID:', userId);
    return { id: userId, username };
  },

  async login(username, password) {
    const user = await AccountModel.findByUsername(username);
    if (!user) {
      console.log('User not found for login:', username);
      throw new Error('用户不存在');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      console.log('Invalid password attempt for user:', username);
      throw new Error('密码错误');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: '2h' }
    );

    return { success: true, data: { token, role: user.role, id: user.id } };
  }
  ,
  async changePassword(userId, oldPassword, newPassword) {
    const user = await AccountModel.findById(userId);
    if (!user) throw new Error('用户不存在');
    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) throw new Error('旧密码不正确');
    const hash = await bcrypt.hash(newPassword, 10);
    await AccountModel.updatePassword(userId, hash);
    return true;
  }
};

module.exports = AuthService;
