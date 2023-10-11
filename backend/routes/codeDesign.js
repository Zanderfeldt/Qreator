"use strict";

/** Route for designing QR Codes. */

const jsonschema = require("jsonschema");
const codeNewSchema = require("../schemas/codeNewSchema.json");
const express = require("express");
const { BadRequestError } = require("../expressError");
const axios = require('axios');
const { ensureLoggedIn } = require("../middleware/auth");
const router = new express.Router();
const { objectToQueryString } = require("../helpers/objToQueryString");


router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, codeNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    

    let BASE_URL = "https://quickchart.io/qr?";
    let qString = objectToQueryString(req.body);
    let fullUrl = BASE_URL+qString;
    
    const response = await axios.get(fullUrl, {
      responseType: 'arraybuffer', // Ensure binary response
    });
    res.setHeader('Content-Type', 'image/png'); // Set the response content type

    const responseData = {
      url: response.config.url,
      description: req.body.description,
      lastEdited: new Date().toLocaleDateString("en-US")
    }
   
    res.status(201).json(responseData);

  } catch (err) {
    return next(err);
  }
});

module.exports = router;
