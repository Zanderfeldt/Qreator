"use strict";

const db = require("../db.js");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // Clear user table
  await db.query("DELETE FROM users");
  // Clear qr_code table
  await db.query("DELETE FROM qr_codes");

  // Register a test user
  const user = await User.register({
    username: 'u1',
    password: 'password1',
    firstName: 'U1F',
    lastName: 'U1L',
    email: 'user1@user.com',
  });

  return { testUserId: user.id, u1Token: createToken({ id: user.id }) };
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
};
