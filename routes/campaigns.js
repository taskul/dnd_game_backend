"use strict";

// Routes for maps

const express = require("express");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Campaigns = require('../models/Campaigns')

const router = express.Router();

router.get('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        let { username } = req.params;
        console.log(username)
        const campaigns = await Campaigns.getCampaign(username);
        return res.json({ campaigns });
    } catch (err) {
        return next(err)
    }
})

router.post('/create', ensureLoggedIn, async function (req, res, next) {
    try {
        let { campaign_name, guild_id } = req.body;
        const newCampaign = await Campaigns.createCampaign(campaign_name, guild_id);
        return res.status(201).json({ newCampaign });
    } catch (err) {
        return next(err)
    };
});

router.post('/add_campaign_member/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        let { campaign_id, guild_id, owner } = req.body;
        let { username } = req.params;
        const newMember = await Campaigns.addCampaignMember(campaign_id, guild_id, username, owner);
        return res.status(201).json({ newMember });
    } catch (err) {
        return next(err);
    };
});

router.delete('/:campaign_id/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { campaign_id, username } = req.params;
        const campaignName = await Campaigns.deleteCampaign(campaign_id, username);
        return campaignName;
    } catch (err) {
        return next(err)
    }
})

module.exports = router; 