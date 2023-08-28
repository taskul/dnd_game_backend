"use strict";

// Routes for maps

const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Campaigns = require('../models/Campaigns')

const router = express.Router();

router.get('/')

router.post('/create', ensureCorrectUser, async function (req, res, next) {
    try {
        let { campaign_name, guild_id } = req.body;
        const newCampaign = await Campaigns.createCampaign(campaign_name, guild_id);
        return res.status(201).json({ success: `${newCampaign.campaign_name} campaign has been successfully created` });
    } catch (err) {
        return next(err)
    };
});

router.post('/add_campaign_member', ensureCorrectUser, async function (req, res, next) {
    try {
        let { campaign_id, guild_id, username, owner } = req.body;
        const newMember = await Campaigns.addCampaignMember(campaign_id, guild_id, username, owner);
        return res.status(201).json({ newMember });
    } catch (err) {
        return next(err);
    };
});

module.exports = router;