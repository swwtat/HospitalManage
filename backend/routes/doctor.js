const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

/**
 * @swagger
 * /api/doctor:
 *   get:
 *     tags: [医生]
 *     summary: 获取医生列表
 *     description: 获取所有医生信息，支持筛选
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: department_id
 *         in: query
 *         schema:
 *           type: integer
 *         description: 按科室筛选
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *         description: 按姓名搜索
 *     responses:
 *       200:
 *         description: 成功获取医生列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', doctorController.list);

/**
 * @swagger
 * /api/doctor/me:
 *   get:
 *     tags: [医生]
 *     summary: 获取当前医生信息
 *     description: 获取当前登录医生的信息（需要医生角色）
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取医生信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 5
 *                 name: "张医生"
 *                 department_id: 3
 *                 title: "主任医师"
 *                 bio: "擅长心血管疾病..."
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: 需要医生角色
 *       404:
 *         description: 医生信息未完善
 */
router.get('/me', auth, doctorController.getMyDoctor);

/**
 * @swagger
 * /api/doctor/me:
 *   put:
 *     tags: [医生]
 *     summary: 更新医生个人信息
 *     description: 医生更新自己的个人信息
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "张明医生"
 *               title:
 *                 type: string
 *                 example: "副主任医师"
 *               bio:
 *                 type: string
 *                 example: "更新后的个人简介..."
 *               contact:
 *                 type: string
 *                 example: "13800138000"
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/me', auth, doctorController.updateMe);

/**
 * @swagger
 * /api/doctor/me/registrations:
 *   get:
 *     tags: [医生]
 *     summary: 获取我的预约列表
 *     description: 医生查看分配给自己的所有预约
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/dateParam'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, waiting, cancelled, completed]
 *           description: 按状态筛选
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: 成功获取预约列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/me/registrations', auth, doctorController.getRegistrationsForMe);

/**
 * @swagger
 * /api/doctor/me/availability:
 *   post:
 *     tags: [医生]
 *     summary: 设置医生排班
 *     description: 医生为自己设置排班信息
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, slot]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-20"
 *               slot:
 *                 type: string
 *                 enum: [8-10, 10-12, 14-16, 16-18]
 *                 example: "8-10"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 50
 *                 default: 20
 *               extra:
 *                 type: object
 *                 description: 扩展信息
 *                 example:
 *                   capacity_types:
 *                     普通: 15
 *                     专家: 5
 *     responses:
 *       200:
 *         description: 排班设置成功
 *       400:
 *         description: 参数错误
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: 需要医生角色
 *       409:
 *         description: 该时间段已存在排班
 */
router.post('/me/availability', auth, doctorController.upsertAvailabilityForMe);

/**
 * @swagger
 * /api/doctor/me/availability/{id}:
 *   delete:
 *     tags: [医生]
 *     summary: 删除排班
 *     description: 医生删除自己的排班
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 排班ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: 排班不存在
 *       403:
 *         description: 只能删除自己的排班
 */
router.delete('/me/availability/:id', auth, doctorController.deleteAvailabilityForMe);

/**
 * @swagger
 * /api/doctor/me/leave:
 *   post:
 *     tags: [医生]
 *     summary: 申请请假
 *     description: 医生提交请假申请
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [from_date, to_date, reason]
 *             properties:
 *               from_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-20"
 *               to_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-22"
 *               reason:
 *                 type: string
 *                 example: "参加学术会议"
 *               note:
 *                 type: string
 *                 example: "紧急情况请联系助理"
 *     responses:
 *       201:
 *         description: 请假申请提交成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/me/leave', auth, doctorController.createLeaveRequest);

/**
 * @swagger
 * /api/doctor/{id}:
 *   get:
 *     tags: [医生]
 *     summary: 获取医生详情
 *     description: 根据ID获取医生详细信息
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 医生ID
 *     responses:
 *       200:
 *         description: 成功获取医生信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', doctorController.get);

/**
 * @swagger
 * /api/doctor/{id}/availability:
 *   get:
 *     tags: [医生]
 *     summary: 获取医生排班
 *     description: 获取指定医生的排班信息
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 医生ID
 *       - $ref: '#/components/parameters/dateParam'
 *     responses:
 *       200:
 *         description: 成功获取排班信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data: [
 *                 {
 *                   id: 1,
 *                   doctor_id: 5,
 *                   date: "2024-01-20",
 *                   slot: "8-10",
 *                   capacity: 20,
 *                   booked: 5,
 *                   available: 15,
 *                   is_available: true
 *                 }
 *               ]
 */
router.get('/:id/availability', doctorController.getAvailability);

/**
 * @swagger
 * /api/doctor/{id}/registrations:
 *   get:
 *     tags: [医生]
 *     summary: 获取医生的预约列表（管理员或本人）
 *     description: 获取指定医生的所有预约，需要管理员权限或是医生本人
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 医生ID
 *       - $ref: '#/components/parameters/dateParam'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, waiting, cancelled, completed]
 *     responses:
 *       200:
 *         description: 成功获取预约列表
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/:id/registrations', auth, doctorController.getRegistrationsByDoctorId);

// ===================== 管理员接口 =====================

/**
 * @swagger
 * /api/doctor:
 *   post:
 *     tags: [管理员]
 *     summary: 创建医生（管理员）
 *     description: 管理员创建医生账户
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *           example:
 *             name: "李医生"
 *             department_id: 3
 *             title: "主任医师"
 *             bio: "擅长内科疾病诊治"
 *             contact: "13900139000"
 *             account_id: 100
 *     responses:
 *       201:
 *         description: 医生创建成功
 *       400:
 *         description: 参数错误
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: 医生已存在
 */
router.post('/', auth, admin, doctorController.create);

/**
 * @swagger
 * /api/doctor/{id}:
 *   put:
 *     tags: [管理员]
 *     summary: 更新医生信息（管理员）
 *     description: 管理员更新医生信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 医生ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', auth, admin, doctorController.update);

module.exports = router;