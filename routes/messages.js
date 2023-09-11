"use strict";

// Routes for maps

const express = require("express");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Messages = require('../models/Messages')

const router = express.Router();

router.get('/:campaign_id/:campaign_name/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        let { username, campaign_name, campaign_id } = req.params;
        const gameChat = await Messages.getChatRoom(campaign_name, campaign_id, username);
        return res.json({ gameChat });
    } catch (err) {
        return next(err)
    }
})


router.post('/create/:username', ensureLoggedIn, async function (req, res, next) {
    try {
        let { campaign_name, campaign_id } = req.body;
        let { username } = req.params;
        const gameChat = await Messages.createChatRoom(campaign_name, campaign_id, username);
        return res.status(201).json({ gameChat });
    } catch (err) {
        return next(err)
    };
});

module.exports = router;