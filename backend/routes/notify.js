const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/notifyController');
const auth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/notify/subscribe:
 *   post:
 *     tags: [通知]
 *     summary: 订阅通知
 *     description: 用户订阅系统通知（如WebSocket、SSE等）
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channel:
 *                 type: string
 *                 enum: [websocket, sse, email, sms]
 *                 default: "websocket"
 *                 description: "通知通道"
 *               events:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "订阅的事件类型"
 *                 example: ["order.created", "order.cancelled", "appointment.reminder"]
 *               endpoint:
 *                 type: string
 *                 description: "推送端点（如WebSocket连接ID、邮箱地址等）"
 *                 example: "user123-socket-id"
 *     responses:
 *       200:
 *         description: 订阅成功
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
 *                     subscriptionId:
 *                       type: string
 *                       example: "sub_123456"
 *                     channel:
 *                       type: string
 *                       example: "websocket"
 *                     events:
 *                       type: array
 *                       items:
 *                         type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-22T10:30:00Z"
 *             example:
 *               success: true
 *               data:
 *                 subscriptionId: "sub_123456"
 *                 channel: "websocket"
 *                 events: ["order.created", "order.cancelled"]
 *                 expiresAt: "2024-01-22T10:30:00Z"
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "无效的通知通道"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/subscribe', auth, notifyController.subscribe);

module.exports = router;
