"use strict";

// Routes for maps

const express = require("express");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/User");
const Characters = require("../models/Characters")

const router = express.Router();

// Get Character
// returns char_id, char_name, user_id
router.get('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { username } = req.params;
        const response = await Characters.getCharacters(username);
        return res.json({ response });
    } catch (err) {
        return next(err);
    };
});

// Create New Character
router.post('/create', ensureLoggedIn, async function (req, res, next) {
    try {
        let { char_name, username } = req.body;
        const newChar = await Characters.createCharacter(char_name, username);
        return res.status(201).json({ newChar });
    } catch (err) {
        return next(err);
    };
});

// -----------------------------------------Character Info
// Get Character info
// returns char_id, char_race, char_alignment, char_class, exp_points, char_level
router.get('/info/:char_id/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, username } = req.params;
        const response = await Characters.getCharactersInfo(char_id);
        return res.json({ response });
    } catch (err) {
        return next(err);
    };
});

// Chreate Character info that includes:
// char_id, char_race, char_alignment, char_class, exp_points, char_level
router.post('/create/info/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        // const { username } = req.params;
        const { char_id, char_race, char_alignment, char_class, exp_points, char_level } = req.body;
        const updatedChar = await Characters.createCharacterInfo(char_id, char_race, char_alignment, char_class, exp_points, char_level);
        return res.status(201).json({ updatedChar });
    } catch (err) {
        return next(err);
    };
});

// Update Character info
// char_id, char_race, char_alignment, char_class, exp_points, char_level
router.put('/patch/info/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { username } = req.params;
        const { char_race, char_alignment, char_class, exp_points, char_level, char_id } = req.body;

        const updatedChar = await Characters.updateCharacterInfo(char_race, char_alignment, char_class, exp_points, char_level, char_id);
        return res.status(201).json({ updatedChar });
    } catch (err) {
        return next(err);
    };
});

// -----------------------------------------Character Avatar
// get character avatar 
router.get('/avatar/:char_id/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, username } = req.params;
        const response = await Characters.getCharacterAvatar(char_id);
        return res.json({ response });
    } catch (err) {
        return next(err);
    };
});

// Create character avatar
router.post('/create/avatar/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, img_url } = req.body;
        const newAvatar = await Characters.createCharacterAvatar(char_id, img_url);
        return res.status(201).json({ newAvatar });
    } catch (err) {
        return next(err);
    };
});

// Update character avatar
router.put('/patch/avatar/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, img_url } = req.body;

        const updatedAvatar = await Characters.updateCharacterAvatar(char_id, img_url);
        return res.status(201).json({ updatedAvatar });
    } catch (err) {
        return next(err);
    };
});


// -----------------------------------------Character Base Stats
// Create character Base Stats
router.post('/create/base_stats/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, strength, dexterity, constitution, intelligence, wisdom, charisma } = req.body;
        const baseStats = await Characters.createCharacterBaseStats(char_id, strength, dexterity, constitution, intelligence, wisdom, charisma);
        return res.status(201).json({ baseStats });
    } catch (err) {
        return next(err);
    };
});

// Update character Base Stats
router.put('/patch/base_stats/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, strength, dexterity, constitution, intelligence, wisdom, charisma } = req.body;

        const updatedBaseStats = await Characters.updateCharacterBaseStats(char_id, strength, dexterity, constitution, intelligence, wisdom, charisma);
        return res.status(201).json({ updatedBaseStats });
    } catch (err) {
        return next(err);
    };
});


// -----------------------------------------Character Health and Armor
// Create character Health and Armor
router.post('/create/health/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, hit_points, temp_hit_points, armor_class, inspiration, initiative, speed, prof_bonus, hit_dice } = req.body;

        const health = await Characters.createCharacterHealthArmor(char_id, hit_points, temp_hit_points, armor_class, inspiration, initiative, speed, prof_bonus, hit_dice);
        return res.status(201).json({ health });
    } catch (err) {
        return next(err);
    };
});

// Update character Health and Armor
router.put('/patch/health/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, hit_points, temp_hit_points, armor_class, inspiration, initiative, speed, prof_bonus, hit_dice } = req.body;

        const updatedHealth = await Characters.updateCharacterHealthArmor(char_id, hit_points, temp_hit_points, armor_class, inspiration, initiative, speed, prof_bonus, hit_dice);
        return res.status(201).json({ updatedHealth });
    } catch (err) {
        return next(err);
    };
});


// Delete Character
router.delete('/:char_id/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, username } = req.params;
        const deletedChar = await Characters.deleteCharacter(char_id);
        return res.json({ deletedChar })
    } catch (err) {
        return next(err);
    }
})


module.exports = router;