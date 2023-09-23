"use strict";

/** Routes for users. */

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

const router = express.Router();

/** GET /[userId] => { user }
 *
 * Returns { username, firstName, lastName, email, codes }
 *   where codes is an array of user's QR Code data
 *
 * Authorization required: same user-as-:username
 **/

router.get("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.userId);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET /[userId]/codes => { codes }
 *
 * Returns { id, link, format, margin, size, codeColoe, bgColor, img, imgRatio,
 *          description, lasEdited, url } for all user's QR codes
 *  
 * Authorization required: same user-as-:username
 **/

router.get("/:userId/codes", ensureCorrectUser, async function (req, res, next) {
  try {
    const codes = await User.getUserCodes(req.params.userId);
    return res.json({ codes });
  } catch (err) {
    return next(err);
  }
});

/** GET /[userId]/[codeId] => { code }
 *
 * Returns { id, link, format, margin, size, codeColoe, bgColor, img, imgRatio,
 *          description, lasEdited, url } for single QR Code 
 *  
 * Authorization required: same user-as-:username
 **/

router.get("/:userId/:codeId", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.getUserCode(req.params.codeId);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;