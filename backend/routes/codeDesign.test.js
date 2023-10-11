"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserId,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /create */

describe("POST /create", function () {
  test("works", async function () {
    const resp = await request(app)
        .post('/create')
        .send({
          text: "TEST",
          margin: 4,
          size: 200,
          dark: "#000000",
          light: "#ffffff",
          centerImageUrl: "",
          centerImageSizeRatio: 0.3,
          description: "TEST DESCRIPTION"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    const responseData = JSON.parse(Buffer.from(resp.body).toString('utf-8'));
    expect(responseData).toEqual({
        url: expect.any(String),
        description: 'TEST DESCRIPTION',
        lastEdited: new Date().toLocaleDateString("en-US")
    });
  });
});