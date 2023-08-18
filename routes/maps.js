"use strict";

// Routes for maps

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const GameMaps = require("../models/GameMaps");

const router = express.Router();

router.get('/:mapName', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const mapAssets = await GameMaps.getMap(req.params.mapName, req.params.username);
        return res.json({ mapAssets });
    } catch (err) {
        return next(err);
    }
})

router.get('/:map_id', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const mapAssets = await GameMaps.getMap(req.params.map_id);
        return res.json({ mapAssets });
    } catch (err) {
        return next(err);
    }
})

router.post("/create", ensureCorrectUserOrAdmin, async function (req, res, next) {
    console.log(req)
    try {
        const { mapName, username, assets } = req.body;
        const newMap = await GameMaps.createMap(mapName, username, assets);
        return res.status(201).json({ mapName });
    } catch (err) {
        return next(err);
    };
});

module.exports = router;