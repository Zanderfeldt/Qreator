"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT id,
                  username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email
          )
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          email,
        ],
    );

    const user = result.rows[0];

    return user;
  }

  //Method for getting a single User's info
  static async get(userId) {
    const userRes = await db.query(
          `SELECT id,
                  username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email
           FROM users
           WHERE id = $1`,
        [userId],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${userId}`);
    
    const userCodesRes = await db.query(
      `SELECT q.id
        FROM qr_codes as q
        WHERE q.user_id = $1`, [userId]);

    user.codes = userCodesRes.rows.map(q => q.id);
    return user;
  }

  //Method for retrieving all QR Codes belonging to single user
  static async getUserCodes(userId) {
    const codeRes = await db.query(
        `SELECT description,
                url,
                last_edited as "lastEdited"
          FROM qr_codes
          WHERE user_id = $1`, [userId]);

    const codes = codeRes.rows;

    if (!codes) throw new NotFoundError(`No QR Codes yet`);

    return codes;
  }

  //Method for retrieving single QR Code belonging to user
  static async getUserCode(codeId) {
    const codeRes = await db.query(
        `SELECT description,
                url,
                last_edited AS "lastEdited
        FROM qr_codes
        where id = $1`, [codeId]);
    
    return codeRes.rows[0];
  }

  static async addNewCode({userId, description, lastEdited, url}) {
    const result = await db.query(
        `INSERT INTO qr_codes
        (user_id, description, last_edited, url)
        VALUES ($1, $2, $3, $4)
        RETURNING id, description, last_edited AS "lastEdited"`,
        [
          userId,
          description,
          lastEdited,
          url
        ]
    );
    const code = result.rows[0];

    return code;
  }

  //Method for updating a single QR Code
  static async updateCode(codeId, data) {
    const { setCols, values } = sqlForPartialUpdate(
        {lastEdited:  new Date().toLocaleDateString("en-US"), ...data}, 
        {lastEdited: "last_edited"});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE qr_codes
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id, description, url, last_edited AS "lastEdited"`;
    const result = await db.query(querySql, [...values, codeId]);
    const code = result.rows[0];

    return code;
  }

  //Method for deleting a single QR Code
  static async deleteUserCode(codeId) {
    const result = await db.query(
        `DELETE
        FROM qr_codes
        WHERE id = $1
        RETURNING id`, [codeId]);
    const code = result.rows[0];

    if (!code) throw new NotFoundError(`No QR Code: ${codeId}`);
  }  
}

module.exports = User;
