const db = require('../db');

async function createDoctor(payload) {
  const { name, account_id, department_id, title, bio, contact } = payload;
  const [r] = await db.query('INSERT INTO doctors (name, account_id, department_id, title, bio, contact) VALUES (?, ?, ?, ?, ?, ?)', [name, account_id || null, department_id || null, title || null, bio || null, contact || null]);
  const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [r.insertId]);
  return rows[0];
}

async function getDoctorById(id) {
  const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [id]);
  return rows[0];
}

async function listDoctors() {
  const [rows] = await db.query('SELECT * FROM doctors');
  return rows;
}

async function updateDoctor(id, payload) {
  const fields = [];
  const values = [];
  ['name','account_id','department_id','title','bio','contact'].forEach(k => {
    if (k in payload) { fields.push(`${k} = ?`); values.push(payload[k]); }
  });
  if (fields.length === 0) return getDoctorById(id);
  values.push(id);
  await db.query(`UPDATE doctors SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
  return getDoctorById(id);
}

module.exports = { createDoctor, getDoctorById, listDoctors, updateDoctor };
