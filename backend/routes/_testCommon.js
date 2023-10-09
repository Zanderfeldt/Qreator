"use strict";

const db = require("../db.js");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  //clear user table
  await db.query("DELETE FROM users");
  //clear qr_code table
  await db.query("DELETE FROM qr_codes");

  //register test user
  await User.register({
    username: 'u1',
    password: 'password1',
    firstName: 'U1F',
    lastName: 'U1L',
    email: 'user1@user.com',
  });
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

const u1Token = createToken({id: 98});

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
};
