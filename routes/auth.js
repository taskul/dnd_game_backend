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
      throw new Error('BROKEN', errs)
    };
    // getting a guild token if exists to sign up user for a specific guild
    const { username, password, guildToken } = req.body;
    const user = await User.authenticate(username, password);

    // if there is a GuildToken, then add user to the guild they were invited to
    console.log('GUILD TOKEN', guildToken)
    if (guildToken) {
      console.log(guildToken)
      const response = await Guilds.getGuildIdFromToken(guildToken);
      const newGuildMember = await Guilds.createNewGuildMember(response.guild_id, user.user_id)
    }

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

    // getting a guild token if exists to sign up user for a specific guild
    const { guildToken } = req.body;

    // validate input fields
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new Error('BROKEN', errs)
    }

    const newUser = await User.signup({ ...req.body, is_admin: false });

    // if there is a GuildToken, then add user to the guild they were invited to
    if (guildToken) {
      const response = await Guilds.getGuildIdFromToken(guildToken);
      const newGuildMember = await Guilds.createNewGuildMember(response.guild_id, newUser.user_id)
    }

    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
