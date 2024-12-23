const pool = require('../config/db');

async function createUser(firstName, lastName, email, passwordHash, role) {
  const query = `
    INSERT INTO users (first_name, last_name, email, password_hash, role, active)
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING id;
  `;
  const values = [firstName, lastName, email, passwordHash, role];
  const result = await pool.query(query, values);
  return result.rows[0].id;
}

async function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

async function updateUser(userId, { firstName, lastName, passwordHash }) {
  let query = `UPDATE users SET `;
  const updates = [];
  const values = [];

  if (firstName !== undefined) {
    values.push(firstName);
    updates.push(`first_name = $${values.length}`);
  }

  if (lastName !== undefined) {
    values.push(lastName);
    updates.push(`last_name = $${values.length}`);
  }

  if (passwordHash !== undefined) {
    values.push(passwordHash);
    updates.push(`password_hash = $${values.length}`);
  }

  query += updates.join(', ') + ` WHERE id = $${values.length + 1} RETURNING *`;
  values.push(userId);

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function activateUser(userId, active) {
  const query = `UPDATE users SET active = $1 WHERE id = $2 RETURNING *`;
  const result = await pool.query(query, [active, userId]);
  return result.rows[0];
}

async function getAllUsersFromDB() {
  const result = await pool.query('SELECT id, first_name, last_name, email, role, active FROM users');
  return result.rows;
}

module.exports = {
  createUser,
  getUserByEmail,
  updateUser,
  activateUser,
  getAllUsersFromDB,
};
