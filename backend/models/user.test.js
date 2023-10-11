"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate user", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      id: expect.any(Number),
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register user", function () {
  const newUser = {
    username: "new",
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual({...newUser, id: expect.any(Number)});
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get USER */

describe("get user", function () {
  test("works", async function () {
    let user = await User.get(testUserIds[0]);
    expect(user).toEqual({
      username: "u1",
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      codes: expect.any(Array),
      id: expect.any(Number)
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get(111);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update USER*/

describe("update user", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewF",
    email: "new@email.com",
    password: "password1"
  };

  test("works", async function () {
    let user = await User.updateUser(testUserIds[0], updateData);
    expect(user).toEqual({
      id: expect.any(Number),
      username: "u1",
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email
    });
  });

  
  test("not found if no such user", async function () {
    try {
      await User.updateUser(891, {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.updateUser(testUserIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get USER CODES*/

describe("get user codes", function () {
  test("works for all codes", async function () {
    let codes = await User.getUserCodes(testUserIds[0]);
    expect(codes[0]).toEqual({
      id: expect.any(Number),
      description: 'blabla',
      url: 'https://quickchart.io/qr?text=Hello&size=200',
      lastEdited: '4/22/22',
    });
  });

  test("works for single code", async function () {
    let allCodes = await User.getUserCodes(testUserIds[0]);
    let singleCodeId = allCodes[0].id;
    let code = await User.getUserCode(singleCodeId);
    expect(code).toEqual({
      id: expect.any(Number),
      description: 'blabla',
      url: 'https://quickchart.io/qr?text=Hello&size=200',
      lastEdited: '4/22/22',
    });
  });
});

/************************************** addNewCode*/

describe("create code", function () {
  let newCode = {
    userId: testUserIds[1],
    description: 'testCode',
    lastEdited: '6/16/16',
    url: 'https://quickchart.io/qr?text=TEST&size=200'
  };

  test("works", async function () {
    let code = await User.addNewCode(newCode);
    expect(code).toEqual({
      description: newCode.description,
      lastEdited: newCode.lastEdited,
      id: expect.any(Number),
    });
  });
});

/************************************** updateCode*/

describe("update code", function () {
  let data = {
    description: 'new description'
  };

  test("works for description", async function () {
    let code = await User.getUserCodes(testUserIds[0]);
    let codeId = code[0].id;
    let updatedCode = await User.updateCode(codeId, data);
    expect(updatedCode.description).toEqual('new description');
  });

  test("works for url", async function () {
    let code = await User.getUserCodes(testUserIds[0]);
    let codeId = code[0].id;
    let updatedCode = await User.updateCode(codeId, {url: 'https://quickchart.io/qr?text=UPDATE&size=100' });
    expect(updatedCode.url).toEqual('https://quickchart.io/qr?text=UPDATE&size=100');
  });

});