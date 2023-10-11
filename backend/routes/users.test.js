"use strict";

const request = require("supertest");
const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

let testUserId;
let u1Token;

beforeAll(async () => {
  const { testUserId: userId, u1Token: token } = await commonBeforeAll();
  testUserId = userId;
  u1Token = token;
});

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users */

describe("GET /users/:userId", function () {
  test("works for user", async function () {
    const resp = await request(app)
      .get(`/users/${testUserId}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user:
      {username: 'u1',
      firstName: "U1F",
      lastName: 'U1L',
      email: 'user1@user.com',
      id: testUserId,
      codes: expect.any(Array)}
    });
  });
});
