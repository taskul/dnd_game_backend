"use strict";

// Routes for maps

const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Guilds = require("../models/Guilds");
const User = require("../models/User");


const router = express.Router();

router.get('/:username', ensureCorrectUser, async function (req, res, next) {
    try {
        const { username } = req.params;
        const response = await Guilds.getGuild(username);
        return res.json({ response });
    } catch (err) {
        return next(err);
    };
});

router.get('/members/:guild_id', ensureCorrectUser, async function (req, res, next) {
    try {
        const { guild_id } = req.params;
        const response = await Guilds.getAllGuildMembers(guild_id);
        return res.json({ response })
    } catch (err) {
        return next(err);
    };
});

router.get('/token/:guild_id', ensureCorrectUser, async function (req, res, next) {
    try {
        const { guild_id } = req.params;
        const response = await Guilds.getGuildToken(guild_id);
        return res.json({ response });
    } catch (err) {
        return next(err);
    };
});

router.post("/create", ensureCorrectUser, async function (req, res, next) {
    try {
        let { guild_name, username } = req.body;
        const new_guild = await Guilds.createGuild(guild_name, username)
        return res.status(201).json({ success: `${new_guild.guild_name} guild was successfully created!`})
    } catch (err) {
        return next(err);
    };
});

router.post("/create/token", ensureCorrectUser, async function (req, res, next) {
    try {
        let { guild_token, guild_id } = req.body;
        const new_guild_token = await Guilds.createGuildInvite(guild_token, guild_id)
        return res.status(201).json({ success: `token was successfully created!`})
    } catch (err) {
        return next(err);
    };
});

router.delete('/leave', ensureCorrectUser, async function (req, res, next) {
    try {
        const {guild_id, username} = req.body;
        const userResponse = await User.get(username);
        const response = await Guilds.leaveGuild(guild_id, userResponse.user_id)
        return res.json({ left: "You have left the guild"})
    } catch (err) {
        return next(err)
    }
})

router.delete("/:guild_id", ensureCorrectUser, async function (req, res, next) {
    try {
        const response = await Guilds.deleteGuild(req.params.guild_id);
        return res.json({ deleted: response})
    } catch (err) {
        return next(err)
    }
})

module.exports = router;