"use strict";

// Routes for maps

const express = require("express");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Messages = require('../models/Messages')

const router = express.Router();

// ------------------------Getting info about the chat
router.get('/:campaign_id/:campaign_name/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        let { username, campaign_name, campaign_id } = req.params;
        const gameChat = await Messages.getChatRoom(campaign_name, campaign_id, username);
        return res.json({ gameChat });
    } catch (err) {
        return next(err)
    }
})

// ------------------------Creating a new chat
router.post('/create/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        let { campaign_name, campaign_id } = req.body;
        let { username } = req.params;
        const gameChat = await Messages.createChatRoom(campaign_name, campaign_id, username);
        return res.status(201).json({ gameChat });
    } catch (err) {
        return next(err)
    };
});

// ------------------------Getting chat messages
router.get('/msg/:chat_id/:campaign_name/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        let { chat_id, username } = req.params;
        const gameChat = await Messages.getMessages(chat_id, username);
        return res.json({ gameChat });
    } catch (err) {
        return next(err)
    }
})

// ------------------------Creating a new message
router.post('/msg/create/:chat_id/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        let { chat_id, username } = req.params;
        let { message } = req.body;
        const newMessage = await Messages.createMessages(chat_id, username, message);
        return res.status(201).json({ success: "saved message" });
    } catch (err) {
        return next(err)
    };
});

module.exports = router;