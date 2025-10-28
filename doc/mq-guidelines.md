# MQ 开发规范与使用指南（RabbitMQ）

目的：为后续围绕“挂号订单”的扩展服务（通知、统计、审计、医保对接等）提供统一的消息总线接入规范与参考实现。

目录
- 事件约定
- 路由键（routing key）与交换机
- 发布（producer）示例
- 订阅（consumer）示例
- 错误处理与重试策略
- 幂等与去重建议
- 监控与运维建议
- Docker / Compose 示例（快速本地调试）

## 事件约定
当前事件集中在 `hospital.events` 交换机（topic 类型）。针对订单，约定 routing key 前缀为 `order.`，并在 payload 中包含基础字段：

{ event: string, data: object, ts: number }

常见事件：
- `order.created` — 新订单已创建（confirmed 或 waiting）
- `order.waiting` — 订单加入候补队列
- `order.confirmed` — 订单从候补/待定变为 confirmed（如果需要单独事件）
- `order.cancelled` — 订单已取消
- `order.promoted` — 候补订单被提升为 confirmed（可选）

注意：event 字段与 routing key 建议保持一致，便于调试与路由。

## 路由键与交换机
- 交换机：`hospital.events`（已在后端 MQ 模块中声明）
- routing key：使用 `topic` 风格，例如 `order.created`, `order.#` 等

## 后端模块（已实现）
- `backend/mq/index.js`：MQ 连接管理（connect, publish, subscribe, close）
- `backend/mq/publisher.js`：封装的事件发布接口（示例：`publishOrderEvent(type, data)`）
- `backend/mq/subscriber.js`：对外暴露订阅注册（`registerOrderSubscriber(bindingKey, handler)`）

使用示例（发布）：

```js
const mqPublisher = require('../mq/publisher');
await mqPublisher.publishOrderEvent('created', orderRecord);
```

使用示例（订阅）：

```js
const orderSub = require('../mq/subscriber');
await orderSub.registerOrderSubscriber('order.#', async (body, meta) => {
  // body: { event, data, ts }
  // meta.routingKey 包含具体路由
  // 处理业务逻辑（通知、写入日志、触发审计等）
});
```

## 错误处理与重试
- 当前简单实现：在 handler 出错时将 message nack 且不重入队列（避免死亡循环）。
- 推荐改进：使用死信交换机（DLX）+ 死信队列记录失败消息，并单独建立重试流程（带延迟/指数退避）。
- 发布端应保证短暂的网络失败不会丢失消息（使用 `persistent` 标志并在必要时实现 confirm 模式）。

## 幂等与去重
- 订单事件通常需要幂等处理：订阅方应以事件内的业务主键（如 orderId）做去重或用唯一约束保护数据库写入。
- 在事件内传递足够的上下文（orderId, account_id, status, availability_id 等）以支持幂等写入。

## 监控与运维
- 在生产中部署 RabbitMQ 时建议启用管理插件（管理 UI）并接入 Prometheus/Grafana 监控队列深度、消息速率、连接数。
- 记录并报警：队列长度异常增长、消费者离线、消息进入 DLX。

## 本地开发快速启动（docker-compose）
在 `docker-compose.yml` 中加入 rabbitmq 服务（示例）：

```yaml
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
```

然后在后端容器或本地执行前，确保 `MQ_URL` 环境变量指向 `amqp://guest:guest@rabbitmq:5672` 或本地 `amqp://guest:guest@localhost:5672`。

## 扩展建议与常见场景
- 通知服务：订阅 `order.created` 与 `order.cancelled` 发送短信/站内信
- 对账/审计：把关键事件写入审计库或 ES 以便查询
- 第三方对接：如医保或第三方平台，使用专门队列与重试策略

## 开发规范（要点）
- 事件内容：尽量以业务实体为中心，包含主键与必要字段，避免传输过大对象
- 版本策略：事件 schema 可演进，建议在 event.data 中加入 `schema_version` 字段
- 安全与隐私：不要在事件中泄露敏感字段（如完整身份证号），若必须传输，应加密或做脱敏处理

如果需要，我可以：
- 把 `docker-compose.yml` 增加 RabbitMQ 服务并配置网络
- 为重要事件增加确认与重试（publisher confirm / DLX + retry queues）
- 为订阅方增加示例的通知/审计处理实现
