"use strict";

// Routes for maps

const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Campaigns = require('../models/Campaigns')

const router = express.Router();

router.get('/:username', ensureCorrectUser, async function (req, res, next) {
    try {
        let {username} = req.params;
        console.log(username)
        const campaigns = await Campaigns.getCampaign(username);
        return res.json({ campaigns });
    } catch (err) {
        return next(err)
    }
})

router.post('/create', ensureCorrectUser, async function (req, res, next) {
    try {
        let { campaign_name, guild_id } = req.body;
        const newCampaign = await Campaigns.createCampaign(campaign_name, guild_id);
        return res.status(201).json({ newCampaign });
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