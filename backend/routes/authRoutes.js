const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [认证]
 *     summary: 用户注册
 *     description: 注册新用户账户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "zhangsan"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [user, doctor]
 *                 default: "user"
 *                 example: "user"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "zhangsan@example.com"
 *     responses:
 *       201:
 *         description: 注册成功
 *       400:
 *         description: 参数错误
 *       409:
 *         description: 用户名已存在
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [认证]
 *     summary: 用户登录
 *     description: 用户登录获取访问令牌
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: "zhangsan"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 登录成功
 *       401:
 *         description: 用户名或密码错误
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     tags: [认证]
 *     summary: 修改密码
 *     description: 用户修改自己的密码
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: 密码修改成功
 *       401:
 *         description: 未授权或原密码错误
 */
router.post('/change-password', require('../middlewares/authMiddleware'), AuthController.changePassword);

module.exports = router;
