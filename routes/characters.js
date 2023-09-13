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
router.get('/:username', ensureLoggedIn, async function (req, res, next) {
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
router.get('/info/:char_id/:username', ensureLoggedIn, async function (req, res, next) {
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
router.get('/avatar/:char_id', async function (req, res, next) {
    try {
        const { char_id } = req.params;
        const response = await Characters.getAvatar(char_id);
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


// -----------------------------------------Character Saving Throws
// Create character Saving Throws
router.post('/create/saving_throws/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, str, dex, con, intel, wis, cha } = req.body;

        const SavingThrows = await Characters.createCharacterSavingThrows(char_id, str, dex, con, intel, wis, cha);
        return res.status(201).json({ SavingThrows });
    } catch (err) {
        return next(err);
    };
});

// Update character Saving Throws
router.put('/patch/saving_throws/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, str, dex, con, intel, wis, cha } = req.body;

        const updatedSavingThrows = await Characters.updateCharacterSavingThrows(char_id, str, dex, con, intel, wis, cha);
        return res.status(201).json({ updatedSavingThrows });
    } catch (err) {
        return next(err);
    };
});


// -----------------------------------------Character Skills
// Create character Skills
router.post('/create/skills/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival } = req.body;

        const skills = await Characters.createCharacterSkills(char_id, acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival);
        return res.status(201).json({ skills });
    } catch (err) {
        return next(err);
    };
});

// Update character Skills
router.put('/patch/skills/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival } = req.body;

        const updatedSkills = await Characters.updateCharacterSkills(char_id, acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival);
        return res.status(201).json({ updatedSkills });
    } catch (err) {
        return next(err);
    };
});


// -----------------------------------------Character Equipment
// Create character Equipment
router.post('/create/equipment/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, copper, silver, electrum, gold, platinum, equipment } = req.body;

        const charEquipment = await Characters.createCharacterEquipment(char_id, copper, silver, electrum, gold, platinum, equipment);
        return res.status(201).json({ charEquipment });
    } catch (err) {
        return next(err);
    };
});

// Update character Equipment
router.put('/patch/equipment/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, copper, silver, electrum, gold, platinum, equipment } = req.body;

        const updatedCharEquipment = await Characters.updateCharacterEquipment(char_id, copper, silver, electrum, gold, platinum, equipment);
        return res.status(201).json({ updatedCharEquipment });
    } catch (err) {
        return next(err);
    };
});

// -----------------------------------------Character Weapons
// Create character weapons
router.post('/create/weapons/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, weapon1, atk_bonus, damage_type, weapon2, atk_bonus2, damage_type2, weapon3, atk_bonus3, damage_type3, weapon4, atk_bonus4, damage_type4, weapon5, atk_bonus5, damage_type5 } = req.body;

        const weapons = await Characters.createCharacterWeapons(char_id, weapon1, atk_bonus, damage_type, weapon2, atk_bonus2, damage_type2, weapon3, atk_bonus3, damage_type3, weapon4, atk_bonus4, damage_type4, weapon5, atk_bonus5, damage_type5);
        return res.status(201).json({ weapons });
    } catch (err) {
        return next(err);
    };
});

// Update character weapons
router.put('/patch/weapons/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, weapon1, atk_bonus, damage_type, weapon2, atk_bonus2, damage_type2, weapon3, atk_bonus3, damage_type3, weapon4, atk_bonus4, damage_type4, weapon5, atk_bonus5, damage_type5 } = req.body;

        const updatedWeapons = await Characters.updateCharacterWeapons(char_id, weapon1, atk_bonus, damage_type, weapon2, atk_bonus2, damage_type2, weapon3, atk_bonus3, damage_type3, weapon4, atk_bonus4, damage_type4, weapon5, atk_bonus5, damage_type5);
        return res.status(201).json({ updatedWeapons });
    } catch (err) {
        return next(err);
    };
});

// -----------------------------------------Character Spells
// Create character spells
router.post('/create/spells/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, spells } = req.body;

        const charSpells = await Characters.createCharacterSpells(char_id, spells);
        return res.status(201).json({ charSpells });
    } catch (err) {
        return next(err);
    };
});

// Update character spells
router.put('/patch/spells/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, spells } = req.body;

        const updatedCharSpells = await Characters.updateCharacterSpells(char_id, spells);
        return res.status(201).json({ updatedCharSpells });
    } catch (err) {
        return next(err);
    };
});

// -----------------------------------------Character proficiencies
// Create character proficiencies
router.post('/create/proficiencies/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, proficiencies } = req.body;

        const charProficiencies = await Characters.createCharacterProficiencies(char_id, proficiencies);
        return res.status(201).json({ charProficiencies });
    } catch (err) {
        return next(err);
    };
});

// Update character proficiencies
router.put('/patch/proficiencies/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { char_id, proficiencies } = req.body;

        const updatedProficiencies = await Characters.updateCharacterProficiencies(char_id, proficiencies);
        return res.status(201).json({ updatedProficiencies });
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