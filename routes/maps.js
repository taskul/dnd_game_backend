"use strict";

// Routes for maps

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const GameMaps = require("../models/GameMaps");

const router = express.Router();

router.get('/:username', ensureLoggedIn, async function (req, res, next) {
    try {
        const { username } = req.params;
        const response = await GameMaps.getMap(username);
        return res.json({ response });
    } catch (err) {
        return next(err);
    }
})

router.get('/assets/:game_map_id', async function (req, res, next) {
    try {
        console.log(req.params)
        const mapAssets = await GameMaps.getMapById(req.params.game_map_id);
        console.log(mapAssets)
        return res.json({ mapAssets });
    } catch (err) {
        return next(err);
    }
})

router.post("/create", async function (req, res, next) {
    try {
        let { map_name, username, map_assets } = req.body;
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

router.delete("/:game_map_id", async function (req, res, next) {
    try {
        const response = await GameMaps.deleteMap(req.params.game_map_id);
        console.log(response)
        return res.json({ deleted: response})
    } catch (err) {
        return next(err)
    }
})

module.exports = router;