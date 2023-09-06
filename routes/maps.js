"use strict";

// Routes for maps

const express = require("express");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const GameMaps = require("../models/GameMaps");

const router = express.Router();

router.get('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { username } = req.params;
        const response = await GameMaps.getMap(username);
        return res.json({ response });
    } catch (err) {
        return next(err);
    }   
})

router.get('/assets/:game_map_id/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { game_map_id } = req.params;
        const mapAssets = await GameMaps.getMapById(game_map_id);
        return res.json({ mapAssets });
    } catch (err) {
        return next(err);
    }
})

router.post("/create/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        let { map_name, map_assets } = req.body;
        let { username } = req.params
        const mapExists = await GameMaps.checkExistingMap(map_name, username)
        if (mapExists) {
            const newMap = await GameMaps.updateExistingMap(map_name, username, map_assets);
            return res.status(201).json({ success: "Map was updated" });
        } else {
            const newMap = await GameMaps.createMap(map_name, username, map_assets);
            return res.status(201).json({ success: "Map was created" });
        }
    } catch (err) {
        return next(err);
    };
});

router.delete("/:game_map_id/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { game_map_id } = req.params
        const response = await GameMaps.deleteMap(game_map_id);
        console.log(response)
        return res.json({ deleted: response })
    } catch (err) {
        return next(err)
    }
})

module.exports = router;