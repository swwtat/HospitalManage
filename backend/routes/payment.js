const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * /api/payment/create:
 *   post:
 *     tags: [支付]
 *     summary: 创建支付订单
 *     description: |
 *       为挂号订单创建支付订单
 *       
 *       **注意：**
 *       1. 一个挂号订单只能有一个未完成的支付订单
 *       2. 支付成功后会更新 orders 表的 payment_id 字段
 *       3. 支付状态为 created、paid、failed、refunded
 *       4. account_id 自动从登录用户获取，无需手动传入
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order_id, amount]
 *             properties:
 *               order_id:
 *                 type: integer
 *                 format: int64
 *                 example: 8
 *                 description: "关联的挂号订单ID（必填）"
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0.01
 *                 maximum: 99999.99
 *                 multipleOf: 0.01
 *                 example: 25.00
 *                 description: "支付金额（元）"
 *               currency:
 *                 type: string
 *                 default: "CNY"
 *                 example: "CNY"
 *                 description: "货币类型"
 *               description:
 *                 type: string
 *                 example: "挂号费 - 内科 - 张医生"
 *                 description: "支付描述"
 *               provider_data:
 *                 type: object
 *                 description: "支付提供商初始数据"
 *                 example:
 *                   provider: "wechat"
 *                   trade_type: "JSAPI"
 *     responses:
 *       201:
 *         description: 支付订单创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "支付订单创建成功"
 *               data:
 *                 id: 5
 *                 account_id: 10
 *                 order_id: 8
 *                 amount: 25.00
 *                 currency: "CNY"
 *                 status: "created"
 *                 provider_info:
 *                   provider: "wechat"
 *                   prepay_id: "wx20240115103000"
 *                 created_at: "2024-01-15T10:30:00Z"
 *                 updated_at: "2024-01-15T10:30:00Z"
 *       400:
 *         description: 参数错误或订单已支付
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "缺少必填参数"
 *               code: 400
 *               details:
 *                 - field: "amount"
 *                   message: "支付金额不能为空"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: 只能为自己的订单创建支付
 *       404:
 *         description: 关联的挂号订单不存在
 *       409:
 *         description: 订单已有支付记录
 */
router.post('/create', paymentController.createPayment);

/**
 * @swagger
 * /api/payment/{id}:
 *   get:
 *     tags: [支付]
 *     summary: 获取支付详情
 *     description: 根据支付ID获取支付订单详细信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: 支付订单ID
 *     responses:
 *       200:
 *         description: 成功获取支付详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: 5
 *                 account_id: 10
 *                 order_id: 8
 *                 amount: 25.00
 *                 currency: "CNY"
 *                 status: "paid"
 *                 provider_info:
 *                   provider: "wechat"
 *                   transaction_id: "42000000120240115103000"
 *                   payer_openid: "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o"
 *                 paid_at: "2024-01-15T10:31:00Z"
 *                 created_at: "2024-01-15T10:30:00Z"
 *                 updated_at: "2024-01-15T10:31:00Z"
 *                 # 关联的挂号订单信息
 *                 order_info:
 *                   id: 8
 *                   date: "2024-01-20"
 *                   slot: "8-10"
 *                   doctor_name: "张医生"
 *                   department_name: "内科"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: 只能查看自己的支付记录
 *       404:
 *         description: 支付订单不存在
 */
router.get('/:id', paymentController.getPayment);

/**
 * @swagger
 * /api/payment/{id}/pay:
 *   post:
 *     tags: [支付]
 *     summary: 执行支付
 *     description: |
 *       执行支付操作（模拟或调用支付网关）
 *       
 *       **支付成功后会：**
 *       1. 更新支付订单状态为 paid
 *       2. 记录 paid_at 时间
 *       3. 更新关联的挂号订单的 payment_id
 *       4. 在 order_history 中记录状态变更
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: 支付订单ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider_info:
 *                 type: object
 *                 description: "支付提供商返回的数据"
 *                 properties:
 *                   transaction_id:
 *                     type: string
 *                     example: "42000000120240115103000"
 *                   payer_openid:
 *                     type: string
 *                     example: "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o"
 *                   bank_type:
 *                     type: string
 *                     example: "CMB_CREDIT"
 *               simulate_success:
 *                 type: boolean
 *                 default: true
 *                 description: "是否模拟支付成功（测试用）"
 *     responses:
 *       200:
 *         description: 支付成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "支付成功"
 *               data:
 *                 id: 5
 *                 status: "paid"
 *                 provider_info:
 *                   transaction_id: "42000000120240115103000"
 *                   paid_at: "2024-01-15T10:31:00Z"
 *                 paid_at: "2024-01-15T10:31:00Z"
 *                 updated_at: "2024-01-15T10:31:00Z"
 *                 # 同时会更新挂号订单的 payment_id
 *                 order_updated: true
 *       400:
 *         description: 支付订单状态不正确或金额错误
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: 不能支付他人的订单
 *       404:
 *         description: 支付订单不存在
 *       409:
 *         description: 支付订单已支付或已关闭
 */
router.post('/:id/pay', paymentController.pay);

/**
 * @swagger
 * /api/payment/account/{account_id}:
 *   get:
 *     tags: [支付]
 *     summary: 获取账户支付记录
 *     description: |
 *       获取指定账户的所有支付记录
 *       
 *       **注意：** 只能查看自己的支付记录
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: account_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "账户ID"
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [created, paid, failed, refunded]
 *         description: 按支付状态筛选
 *       - name: start_date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: 开始日期（YYYY-MM-DD）
 *       - name: end_date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: 结束日期（YYYY-MM-DD）
 *       - name: order_id
 *         in: query
 *         schema:
 *           type: integer
 *           format: int64
 *         description: 按挂号订单ID筛选
 *     responses:
 *       200:
 *         description: 成功获取支付记录
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               data: [
 *                 {
 *                   id: 5,
 *                   order_id: 8,
 *                   amount: 25.00,
 *                   currency: "CNY",
 *                   status: "paid",
 *                   provider_info: {
 *                     provider: "wechat"
 *                   },
 *                   paid_at: "2024-01-15T10:31:00Z",
 *                   created_at: "2024-01-15T10:30:00Z",
 *                   # 关联订单信息
 *                   order_info: {
 *                     date: "2024-01-20",
 *                     slot: "8-10",
 *                     doctor_name: "张医生"
 *                   }
 *                 },
 *                 {
 *                   id: 6,
 *                   order_id: 9,
 *                   amount: 50.00,
 *                   currency: "CNY",
 *                   status: "created",
 *                   created_at: "2024-01-15T11:30:00Z"
 *                 }
 *               ]
 *               pagination:
 *                 page: 1
 *                 limit: 20
 *                 total: 35
 *                 totalPages: 2
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: 只能查看自己的支付记录
 *       404:
 *         description: 账户不存在
 */
router.get('/account/:account_id', paymentController.listByAccount);

module.exports = router;