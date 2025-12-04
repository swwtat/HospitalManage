const express = require('express');
const router = express.Router();
const mqController = require('../controllers/mqController');

/**
 * @swagger
 * /api/mq/publish:
 *   post:
 *     tags: [消息队列]
 *     summary: 发布测试消息
 *     description: 手动发布消息到消息队列进行测试（仅开发环境使用）
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [routingKey, message]
 *             properties:
 *               routingKey:
 *                 type: string
 *                 example: "order.created"
 *                 description: "路由键"
 *               message:
 *                 type: object
 *                 description: "消息内容"
 *                 example:
 *                   data:
 *                     order_id: 1001
 *                     account_id: 5
 *                     status: "confirmed"
 *               options:
 *                 type: object
 *                 description: "发布选项"
 *                 properties:
 *                   persistent:
 *                     type: boolean
 *                     default: true
 *     responses:
 *       200:
 *         description: 消息发布成功
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "消息已发布"
 *               routingKey: "order.created"
 *               timestamp: "2024-01-15T10:30:00Z"
 *       400:
 *         description: 参数错误
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: 消息队列服务异常
 */
router.post('/publish', mqController.publishTest);

/**
 * @swagger
 * /api/mq/status:
 *   get:
 *     tags: [消息队列]
 *     summary: 获取消息队列状态
 *     description: 查看消息队列的连接状态和统计信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取状态信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     connected:
 *                       type: boolean
 *                       example: true
 *                     url:
 *                       type: string
 *                       example: "amqp://guest:guest@localhost:5672"
 *                     stats:
 *                       type: object
 *                       properties:
 *                         published:
 *                           type: integer
 *                           example: 150
 *                         consumed:
 *                           type: integer
 *                           example: 120
 *                         errors:
 *                           type: integer
 *                           example: 3
 *                     queues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           messages:
 *                             type: integer
 *                           consumers:
 *                             type: integer
 *                     disabled:
 *                       type: boolean
 *                       example: false
 *             example:
 *               success: true
 *               data:
 *                 connected: true
 *                 url: "amqp://guest:guest@localhost:5672"
 *                 stats:
 *                   published: 150
 *                   consumed: 120
 *                   errors: 3
 *                 queues:
 *                   - name: "order.queue"
 *                     messages: 5
 *                     consumers: 2
 *                 disabled: false
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       503:
 *         description: 消息队列服务不可用
 */
router.get('/status', mqController.status);

module.exports = router;