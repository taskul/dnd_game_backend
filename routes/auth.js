"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require('../models/User');
const Guilds = require('../models/Guilds');
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/login:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    };

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  };
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/signup", async function (req, res, next) {
  try {

    // getting a guild token from url params to sign up user for a specific guild
    const {guildToken} = req.body;
    const {_guildToken} = req.query;
    
    let newGuildToken = guildToken || _guildToken;
    // validate input fields
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.signup({ ...req.body, is_admin: false });

    // if there is a GuildToken, then add user to the guild they were invited to
    if (newGuildToken) {
      const response = await Guilds.getGuildIdFromToken(newGuildToken);
      const newGuildMember = await Guilds.createNewGuildMember(response.guild_id, newUser.user_id)
    }

    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
