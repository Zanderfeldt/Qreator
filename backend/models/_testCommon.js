const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testUserIds = [];

async function commonBeforeAll() {
 
  await db.query("DELETE FROM qr_codes");
  
  await db.query("DELETE FROM users");

  const resultsUsers = await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING id`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);
      testUserIds.splice(0, 0, ...resultsUsers.rows.map(r => r.id));

  await db.query(`
        INSERT INTO qr_codes(user_id, description, last_edited, url)
        VALUES ($1, 'blabla', '4/22/22', 'https://quickchart.io/qr?text=Hello&size=200')`,
      [testUserIds[0]]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
};