#!/usr/bin/env node

const app = require('../app');
const PORT = process.env.PORT || 3000;

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      🏥 校医院挂号管理系统 API 服务器                    ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   📚 API 文档: http://localhost:${PORT}/api-docs          ║
║   🩺 健康检查: http://localhost:${PORT}/health            ║
║   🔐 认证接口: http://localhost:${PORT}/api/auth/login   ║
║                                                           ║
║   📋 主要端点:                                           ║
║     • /api/doctor      - 医生管理                        ║
║     • /api/patient     - 患者管理                        ║
║     • /api/admin       - 系统管理                        ║
║     • /api/registration- 挂号预约                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

环境: ${process.env.NODE_ENV || 'development'}
时间: ${new Date().toLocaleString()}
`);

app.listen(PORT, () => {
  console.log(`✅ 服务器已启动在端口 ${PORT}`);
});