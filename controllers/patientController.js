const patientService = require('../services/patientService');

exports.getMyProfile = async (req, res) => {
  try {
    const accountId = req.user && req.user.id;
    if (!accountId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const profile = await patientService.getProfileByAccountId(accountId);
    res.json({ success: true, data: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitProfile = async (req, res) => {
  try {
    const accountId = req.user && req.user.id;
    if (!accountId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const payload = req.body || {};

    // 验证表单必填项
    if (!payload.idcard && !payload.idNumber) {
      return res.status(400).json({ success: false, message: '需提供身份证号或工号以验证' });
    }

    // 验证是否在教职工名单中
    const verified = patientService.verifyAgainstStaffList({ name: payload.display_name, idNumber: payload.idNumber || payload.idcard });
    if (!verified) {
      return res.status(400).json({ success: false, message: '未在教职工名单中，请核对信息' });
    }

    const saved = await patientService.saveProfile(accountId, payload);
    res.json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
