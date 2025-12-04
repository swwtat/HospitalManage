const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/patient/me:
 *   get:
 *     tags: [患者]
 *     summary: 获取我的患者资料
 *     description: 获取当前登录患者的个人资料信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取患者资料
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Profile'
 *                     - type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "请先完善个人资料"
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 account_id: 5
 *                 display_name: "张三"
 *                 phone: "13800138000"
 *                 gender: "M"
 *                 birthday: "1990-01-01"
 *                 address: "北京市海淀区"
 *                 idcard: "110101199001011234"
 *                 extra:
 *                   emergency_contact: "李四"
 *                   emergency_phone: "13900139000"
 *                 created_at: "2024-01-15T10:30:00Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: 患者资料不存在
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "请先完善个人资料"
 */
router.get('/me', auth, patientController.getMyProfile);

/**
 * @swagger
 * /api/patient/submit:
 *   post:
 *     tags: [患者]
 *     summary: 提交/更新患者资料
 *     description: 患者提交或更新个人资料信息
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [display_name, phone, gender]
 *             properties:
 *               display_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "张三"
 *                 description: "显示姓名"
 *               phone:
 *                 type: string
 *                 pattern: '^1[3-9]\d{9}$'
 *                 example: "13800138000"
 *                 description: "手机号码"
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 example: "M"
 *                 description: "性别"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *                 description: "出生日期"
 *               address:
 *                 type: string
 *                 maxLength: 255
 *                 example: "北京市海淀区中关村"
 *                 description: "联系地址"
 *               idcard:
 *                 type: string
 *                 pattern: '^\d{17}[\dX]$'
 *                 example: "110101199001011234"
 *                 description: "身份证号码"
 *               extra:
 *                 type: object
 *                 description: "扩展信息"
 *                 properties:
 *                   emergency_contact:
 *                     type: string
 *                     example: "李四"
 *                   emergency_phone:
 *                     type: string
 *                     example: "13900139000"
 *                   allergies:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["青霉素", "花粉"]
 *                   medical_history:
 *                     type: string
 *                     example: "高血压病史3年"
 *     responses:
 *       200:
 *         description: 资料提交成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "个人资料已保存"
 *               data:
 *                 id: 1
 *                 display_name: "张三"
 *                 updated_at: "2024-01-15T10:30:00Z"
 *       400:
 *         description: 参数验证失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "手机号码格式不正确"
 *               code: 400
 *               details:
 *                 - field: "phone"
 *                   message: "手机号码格式不正确"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/submit', auth, patientController.submitProfile);

module.exports = router;