"use strict";

// Routes for user

const jsonschema = require('jsonschema');

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email }
 *
 * Authorization required: admin or same user-as-:username
 **/
router.get('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    };
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.patch('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    };
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.delete('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    };
});

module.exports = router;