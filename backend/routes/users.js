"use strict";

/** Routes for users. */

const express = require("express");
const jsonschema = require("jsonschema");
const { ensureCorrectUser } = require("../middleware/auth");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const codeSaveSchema = require("../schemas/codeSaveSchema.json");
const codeUpdateSchema = require("../schemas/codeUpdateSchema.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const router = express.Router({ mergeParams: true });

/** GET /[userId] => { user }
 *
 * Returns { username, firstName, lastName, email, codes }
 *   where codes is an array of user's QR Code data
 *
 * Authorization required: same user-as-:username
 **/

router.get("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(+req.params.userId);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[userId]=> { user }
 *  
 * Updates the user profile
 * Returns { username, firstName, lastName, email } 
 *  
 * Authorization required: same user-as-:userId
 **/

router.patch("/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    try {
      await User.passwordCheck(+req.params.userId, req.body.password);
    } catch (error) {
      // Handle the invalid password error here
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: "Invalid password" });
      }
      throw error;
    }
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.updateUser(+req.params.userId, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET /[userId]/codes => { codes }
 *
 * Returns { id, link, format, margin, size, codeColor, bgColor, img, imgRatio,
 *          description, lasEdited, url } for all user's QR codes
 *  
 * Authorization required: same user-as-:username
 **/

router.get("/:userId/codes", ensureCorrectUser, async function (req, res, next) {
  try {
    const codes = await User.getUserCodes(+req.params.userId);
    return res.json({ codes });
  } catch (err) {
    return next(err);
  }
});

/** POST /[userId]/codes => { code }
 *
 * Returns { userId, description, lastEdited, url } for newly saved QR Code
 * Authorization required: same user-as-:username
 **/

router.post("/:userId/codes", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, codeSaveSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const userId = +req.params.userId;
    const code = await User.addNewCode({userId, ...req.body});
    return res.status(201).json({code});
  } catch (err) {
    return next(err);
  }
});

/** GET /[userId]/[codeId] => { code }
 *
 * Returns { id, description, lasEdited, url } for single QR Code 
 *  
 * Authorization required: same user-as-:username
 **/

router.get("/:userId/:codeId", ensureCorrectUser, async function (req, res, next) {
  try {
    const code = await User.getUserCode(+req.params.codeId);
    return res.json({ code });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[userId]/[codeId] => { code }
 *  
 * Updates the description or url of an existing QR Code
 * Returns { id, description, lasEdited, url } for single QR Code 
 *  
 * Authorization required: same user-as-:userId
 **/
router.patch("/:userId/:codeId", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, codeUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const code = await User.updateCode(req.params.codeId, req.body);
    return res.json({ code });
  } catch (err) {
    return next(err);
  }
});

  /** Delete given user's qr code from database; returns undefined.
   *
   * Throws NotFoundError if qr code not found.
   **/

router.delete("/:userId/:codeId", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.deleteUserCode(+req.params.codeId);
    return res.json({ deleted: `Code ${req.params.code}`}) 
  } catch (err) {
    return next(err);
  }
})

module.exports = router;