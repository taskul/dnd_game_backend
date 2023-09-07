"use strict"

const { response } = require('express');
const db = require('../db');
const {
    NotFoundError,
    BadRequesetError,
    UnauthorizedError,
} = require("../expressError");
const User = require("./User");

class Characters {

    // get character char_id, char_name, user_id
    static async getCharacters(username) {
        const user = await User.get(username);
        if (user) {
            const reponse = await db.query(
                `SELECT c.char_id,
                        c.char_name,
                        c.user_id,
                        ca.img_url
                FROM character c
                LEFT JOIN character_avatar ca
                    ON c.char_id = ca.char_id
                WHERE c.user_id = $1`,
                [user.user_id]
            )

            const characters = reponse.rows;
            return characters;
        }
    }

    // get char_id, char_race, char_alignment, char_class, exp_points, char_level
    static async getCharactersInfo(char_id) {
        // Base Info -------------------------------------
        const characters = await db.query(
            `SELECT char_id,
                    char_race,
                    char_alignment,
                    char_class,
                    exp_points,
                    char_level
            FROM character_info
            WHERE char_id = $1`,
            [char_id]
        )
        const charactersInfo = characters.rows[0];

        // get character avatar-------------------------------------
        const avatarResponse = await db.query(
            `SELECT img_url
                FROM character_avatar
                WHERE char_id = $1`,
            [char_id]
        )
        const avatar = avatarResponse.rows[0];

        // Base Stats -------------------------------------
        const baseStats = await db.query(
            `SELECT strength,
                    dexterity,
                    constitution,
                    intelligence,
                    wisdom,
                    charisma
            FROM character_base_stats
            WHERE char_id = $1`,
            [char_id]
        )
        const charBaseStats = baseStats.rows[0];

        // Health and Armor -------------------------------------
        const healthArmor = await db.query(
            `SELECT hit_points,
                    temp_hit_points,
                    armor_class,
                    inspiration,
                    initiative,
                    speed,
                    prof_bonus,
                    hit_dice
            FROM hit_points_armor_class
            WHERE char_id = $1`,
            [char_id]
        )
        const health = healthArmor.rows[0]

        // Saving Throws -------------------------------------
        const savingThrowsResponse = await db.query(
            `SELECT str,
                    dex, 
                    con,
                    intel,
                    wis,
                    cha
            FROM saving_throws
            WHERE char_id = $1`,
            [char_id]
        )
        const savingThrows = savingThrowsResponse.rows[0]

        // Skills -------------------------------------
        const skillsResponse = await db.query(
            `SELECT acrobatics,
                    animalHandling,
                    arcana,
                    athletics,
                    deception,
                    history,
                    insight,
                    intimidation,
                    investigation,
                    medicine,
                    nature,
                    perception,
                    performance,
                    persuasion,
                    religion,
                    sleightOfHand,
                    stealth,
                    survival
            FROM skills
            WHERE char_id = $1`,
            [char_id]
        )
        const skills = skillsResponse.rows[0]

        // Character Equipment -------------------------------------
        const equipmentResponse = await db.query(
            `SELECT copper,
                    silver,
                    electrum,
                    gold,
                    platinum,
                    equipment
            FROM character_equipment
            WHERE char_id = $1`,
            [char_id]
        )
        const equipment = equipmentResponse.rows[0]

        // Character Weapons -------------------------------------
        const weaponsResponse = await db.query(
            `SELECT weapon1,
                    atk_bonus,
                    damage_type,
                    weapon2,
                    atk_bonus2,
                    damage_type2,
                    weapon3,
                    atk_bonus3,
                    damage_type3,
                    weapon4,
                    atk_bonus4,
                    damage_type4,
                    weapon5,
                    atk_bonus5,
                    damage_type5
            FROM character_weapons
            WHERE char_id = $1`,
            [char_id]
        )
        const weapons = weaponsResponse.rows[0]

        // Character Spells -------------------------------------
        const spellsResponse = await db.query(
            `SELECT spells
            FROM character_spells
            WHERE char_id = $1`,
            [char_id]
        )
        const spells = spellsResponse.rows[0]

        // Character proficiencies -------------------------------------
        const proficienciesResponse = await db.query(
            `SELECT proficiencies
            FROM character_proficiencies
            WHERE char_id = $1`,
            [char_id]
        )
        const proficiencies = proficienciesResponse.rows[0]


        return { charactersInfo, avatar, charBaseStats, health, savingThrows, skills, equipment, weapons, spells, proficiencies };
    }

    static async getAvatar(char_id) {
        // get character avatar-
        const avatarResponse = await db.query(
            `SELECT img_url
                FROM character_avatar
                WHERE char_id = $1`,
            [char_id]
        )
        const avatar = avatarResponse.rows[0];
        return avatar
    }
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------
    // create new Character
    static async createCharacter(char_name, username) {
        const user = await User.get(username);
        if (user) {
            const response = await db.query(
                `INSERT INTO character
                    (char_name,
                     user_id)
                VALUES ($1, $2)
                RETURNING char_id, char_name`,
                [char_name, user.user_id]
            )

            const newChar = response.rows[0];
            return newChar;
        }
    }

    // create character info 
    static async createCharacterInfo(char_id, char_race, char_alignment, char_class, exp_points, char_level) {
        const response = await db.query(
            `INSERT INTO character_info
                (char_id,
                char_race,
                char_alignment,
                char_class,
                exp_points,
                char_level
                )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING char_id`,
            [char_id, char_race, char_alignment, char_class, exp_points, char_level]
        )

        const newChar = response.rows[0];
        return newChar;
    }

    // update character info
    static async updateCharacterInfo(char_race, char_alignment, char_class, exp_points, char_level, char_id) {
        const response = await db.query(
            `UPDATE character_info
             SET char_race = $1,
                 char_alignment = $2,
                 char_class = $3,
                 exp_points = $4,
                 char_level = $5
            WHERE char_id = $6
            RETURNING char_id`,
            [char_race, char_alignment, char_class, exp_points, char_level, char_id]
        )

        const newChar = response.rows[0];
        return newChar;
    }

    // Create character avatar ------------------------------------
    static async createCharacterAvatar(char_id, img_url) {
        const response = await db.query(
            `INSERT INTO character_avatar
                (char_id, 
                 img_url)
        VALUES ($1, $2)
        RETURNING char_id, img_url`,
            [char_id, img_url]
        )

        const newAvatar = response.rows[0];
        return newAvatar;
    }

    // Update character avatar
    static async updateCharacterAvatar(char_id, img_url) {
        const response = await db.query(
            `UPDATE character_avatar
             SET img_url = $1
             WHERE char_id = $2
             RETURNING char_id, img_url`,
            [img_url, char_id]
        )

        const updatedAvatar = response.rows[0];
        return updatedAvatar;
    }

    // Create character base stats ------------------------------------
    // accepts char_id, strength, dexterity, constitution, inteligence, wisdom, charisma
    // return char_id
    static async createCharacterBaseStats(char_id, strength, dexterity, constitution, intelligence, wisdom, charisma) {
        const response = await db.query(
            `INSERT INTO character_base_stats
                (char_id, 
                strength,
                dexterity,
                constitution,
                intelligence,
                wisdom,
                charisma)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING char_id`,
            [char_id, strength, dexterity, constitution, intelligence, wisdom, charisma]
        )

        const baseStats = response.rows[0];
        return baseStats;
    }

    // Updates character base stats
    // accepts char_id, strength, dexterity, constitution, inteligence, wisdom, charisma
    // return char_id
    static async updateCharacterBaseStats(char_id, strength, dexterity, constitution, intelligence, wisdom, charisma) {
        const response = await db.query(
            `UPDATE character_base_stats
                SET strength = $1,
                    dexterity = $2,
                    constitution = $3,
                    intelligence = $4,
                    wisdom = $5,
                    charisma = $6
                WHERE char_id = $7
                RETURNING char_id`,
            [strength, dexterity, constitution, intelligence, wisdom, charisma, char_id]
        )

        const updatedBaseStats = response.rows[0];
        return updatedBaseStats;
    }


    // Create character hit_points_armor_class ------------------------------------
    // accepts char_id, hit_points, temp_hit_points, armor_class, inspiration, speed, prof_bonus, hit_dice
    // return char_id
    static async createCharacterHealthArmor(char_id, hit_points, temp_hit_points, armor_class, inspiration, initiative, speed, prof_bonus, hit_dice) {
        const response = await db.query(
            `INSERT INTO hit_points_armor_class
                (char_id,
                hit_points,
                temp_hit_points,
                armor_class,
                inspiration,
                initiative,
                speed,
                prof_bonus,
                hit_dice)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING char_id`,
            [char_id, hit_points, temp_hit_points, armor_class, inspiration, initiative, speed, prof_bonus, hit_dice]
        )

        const healthArmor = response.rows[0];
        return healthArmor;
    }

    // Updates character hit_points_armor_class
    // accepts char_id, hit_points, temp_hit_points, armor_class, inspiration, speed, prof_bonus, hit_dice
    // return char_id
    static async updateCharacterHealthArmor(char_id, hit_points, temp_hit_points, armor_class, inspiration, initiative, speed, prof_bonus, hit_dice) {
        const response = await db.query(
            `UPDATE hit_points_armor_class
                SET hit_points = $1,
                    temp_hit_points = $2,
                    armor_class = $3,
                    inspiration = $4,
                    initiative = $5,
                    speed = $6,
                    prof_bonus = $7,
                    hit_dice = $8
            WHERE char_id = $9
            RETURNING char_id`,
            [hit_points, temp_hit_points, armor_class, inspiration, initiative, speed, prof_bonus, hit_dice, char_id]
        )

        const updatedHealthArmor = response.rows[0];
        return updatedHealthArmor;
    }


    // Create character SavingThrows ------------------------------------
    // char_id, str, dex, con, intel, wis, cha
    // return char_id
    static async createCharacterSavingThrows(char_id, str, dex, con, intel, wis, cha) {
        const response = await db.query(
            `INSERT INTO saving_throws
                (char_id,
                str,
                dex,
                con,
                intel,
                wis,
                cha)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING char_id`,
            [char_id, str, dex, con, intel, wis, cha]
        )

        const SavingThrows = response.rows[0];
        return SavingThrows;
    }

    // Updates character SavingThrows
    // char_id, str, dex, con, intel, wis, cha
    // return char_id
    static async updateCharacterSavingThrows(char_id, str, dex, con, intel, wis, cha) {
        const response = await db.query(
            `UPDATE saving_throws
                SET str = $1,
                    dex = $2,
                    con = $3,
                    intel = $4,
                    wis = $5,
                    cha = $6
            WHERE char_id = $7
            RETURNING char_id`,
            [str, dex, con, intel, wis, cha, char_id]
        )

        const updatedSavingThrows = response.rows[0];
        return updatedSavingThrows;
    }


    // Create character skills ------------------------------------
    // acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival
    // return char_id
    static async createCharacterSkills(char_id, acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival) {
        const response = await db.query(
            `INSERT INTO skills
                (char_id,
                acrobatics,
                animalHandling,
                arcana,
                athletics,
                deception,
                history,
                insight,
                intimidation,
                investigation,
                medicine,
                nature,
                perception,
                performance,
                persuasion,
                religion,
                sleightOfHand,
                stealth,
                survival)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            RETURNING char_id`,
            [char_id, acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival]
        )

        const skills = response.rows[0];
        return skills;
    }

    // Updates character skills
    // acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival
    // return char_id
    static async updateCharacterSkills(char_id, acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival) {
        const response = await db.query(
            `UPDATE skills
             SET acrobatics = $1,
                animalHandling = $2,
                arcana = $3,
                athletics = $4,
                deception = $5,
                history = $6,
                insight = $7,
                intimidation = $8,
                investigation = $9,
                medicine  = $10,
                nature = $11,
                perception = $12,
                performance = $13,
                persuasion = $14,
                religion = $15,
                sleightOfHand  = $16,
                stealth = $17,
                survival = $18
            WHERE char_id = $19
            RETURNING char_id`,
            [acrobatics, animalHandling, arcana, athletics, deception, history, insight, intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, sleightOfHand, stealth, survival, char_id]
        )

        const updatedSkills = response.rows[0];
        return updatedSkills;
    }


    // Create character equipment ------------------------------------
    // char_id,copper,silver,electrum,gold,platinum,equipment
    // return char_id
    static async createCharacterEquipment(char_id, copper, silver, electrum, gold, platinum, equipment) {
        const response = await db.query(
            `INSERT INTO character_equipment
                (char_id,
                copper,
                silver,
                electrum,
                gold,
                platinum,
                equipment)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING char_id`,
            [char_id, copper, silver, electrum, gold, platinum, equipment]
        )

        const charEquipment = response.rows[0];
        return charEquipment;
    }

    // Updates character equipment
    // char_id,copper,silver,electrum,gold,platinum,equipment
    // return char_id
    static async updateCharacterEquipment(char_id, copper, silver, electrum, gold, platinum, equipment) {
        const response = await db.query(
            `UPDATE character_equipment
                SET copper = $1,
                    silver = $2,
                    electrum = $3,
                    gold = 4,
                    platinum = $5,
                    equipment = $6
            WHERE char_id = $7
            RETURNING char_id`,
            [copper, silver, electrum, gold, platinum, equipment, char_id]
        )

        const updatedCharEquipment = response.rows[0];
        return updatedCharEquipment;
    }

    // Create character character_weapons ------------------------------------
    // accepts char_id,weapon1,atk_bonus,damage_type,weapon2,atk_bonus2,damage_type2,weapon3,atk_bonus3,damage_type3,weapon4,atk_bonus4,damage_type4,weapon5,atk_bonus5,damage_type5
    // return char_id
    static async createCharacterWeapons(char_id, weapon1, atk_bonus, damage_type, weapon2, atk_bonus2, damage_type2, weapon3, atk_bonus3, damage_type3, weapon4, atk_bonus4, damage_type4, weapon5, atk_bonus5, damage_type5) {
        const response = await db.query(
            `INSERT INTO character_weapons
                    (char_id,
                    weapon1,
                    atk_bonus,
                    damage_type,
                    weapon2,
                    atk_bonus2,
                    damage_type2,
                    weapon3,
                    atk_bonus3,
                    damage_type3,
                    weapon4,
                    atk_bonus4,
                    damage_type4,
                    weapon5,
                    atk_bonus5,
                    damage_type5)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING char_id`,
            [char_id, weapon1, atk_bonus, damage_type, weapon2, atk_bonus2, damage_type2, weapon3, atk_bonus3, damage_type3, weapon4, atk_bonus4, damage_type4, weapon5, atk_bonus5, damage_type5]
        )

        const weapons = response.rows[0];
        return weapons;
    }

    // Updates character hit_points_armor_class
    // accepts char_id,weapon1,atk_bonus,damage_type,weapon2,atk_bonus2,damage_type2,weapon3,atk_bonus3,damage_type3,weapon4,atk_bonus4,damage_type4,weapon5,atk_bonus5,damage_type5
    // return char_id
    static async updateCharacterWeapons(char_id, weapon1, atk_bonus, damage_type, weapon2, atk_bonus2, damage_type2, weapon3, atk_bonus3, damage_type3, weapon4, atk_bonus4, damage_type4, weapon5, atk_bonus5, damage_type5) {
        const response = await db.query(
            `UPDATE character_weapons
                SET weapon1 = $1,
                    atk_bonus = $2,
                    damage_type = $3,
                    weapon2 = $4,
                    atk_bonus2 = $5,
                    damage_type2 = $6,
                    weapon3 = $7,
                    atk_bonus3 = $8,
                    damage_type3 = $9,
                    weapon4 = $10,
                    atk_bonus4 = $11,
                    damage_type4 = $12,
                    weapon5 = $13,
                    atk_bonus5 = $14,
                    damage_type5 = $15
            WHERE char_id = $16
            RETURNING char_id`,
            [weapon1, atk_bonus, damage_type, weapon2, atk_bonus2, damage_type2, weapon3, atk_bonus3, damage_type3, weapon4, atk_bonus4, damage_type4, weapon5, atk_bonus5, damage_type5, char_id]
        )

        const updatedWeapons = response.rows[0];
        return updatedWeapons;
    }

    // Create character spells ------------------------------------
    // char_id,copper,silver,electrum,gold,platinum,equipment
    // return char_id
    static async createCharacterEquipment(char_id, copper, silver, electrum, gold, platinum, equipment) {
        const response = await db.query(
            `INSERT INTO character_equipment
                (char_id,
                copper,
                silver,
                electrum,
                gold,
                platinum,
                equipment)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING char_id`,
            [char_id, copper, silver, electrum, gold, platinum, equipment]
        )

        const charEquipment = response.rows[0];
        return charEquipment;
    }

    // Updates character equipment
    // char_id,copper,silver,electrum,gold,platinum,equipment
    // return char_id
    static async updateCharacterEquipment(char_id, copper, silver, electrum, gold, platinum, equipment) {
        const response = await db.query(
            `UPDATE character_equipment
                SET copper = $1,
                    silver = $2,
                    electrum = $3,
                    gold = 4,
                    platinum = $5,
                    equipment = $6
            WHERE char_id = $7
            RETURNING char_id`,
            [copper, silver, electrum, gold, platinum, equipment, char_id]
        )

        const updatedCharEquipment = response.rows[0];
        return updatedCharEquipment;
    }

    // Create character spells ------------------------------------
    static async createCharacterSpells(char_id, spells) {
        const response = await db.query(
            `INSERT INTO character_spells
                (char_id, 
                 spells)
        VALUES ($1, $2)
        RETURNING char_id`,
            [char_id, spells]
        )

        const newSpells = response.rows[0];
        return newSpells;
    }

    // Update character spells
    static async updateCharacterSpells(char_id, spells) {
        const response = await db.query(
            `UPDATE character_spells
                SET spells = $1
                WHERE char_id = $2
                RETURNING char_id`,
            [spells, char_id]
        )

        const updatedSpells = response.rows[0];
        return updatedSpells;
    }

    // Create character character_proficiencies ------------------------------------
    static async createCharacterProficiencies(char_id, proficiencies) {
        const response = await db.query(
            `INSERT INTO character_proficiencies
                (char_id, 
                 proficiencies)
        VALUES ($1, $2)
        RETURNING char_id`,
            [char_id, proficiencies]
        )

        const newProficiencies = response.rows[0];
        return newProficiencies;
    }

    // Update character character_proficiencies
    static async updateCharacterProficiencies(char_id, proficiencies) {
        const response = await db.query(
            `UPDATE character_proficiencies
                SET proficiencies = $1
                WHERE char_id = $2
                RETURNING char_id`,
            [proficiencies, char_id]
        )

        const updatedProficiencies = response.rows[0];
        return updatedProficiencies;
    }


    // delete character
    static async deleteCharacter(char_id) {
        const result = await db.query(
            `DELETE 
                FROM character
                WHERE char_id = $1
                RETURNING char_name`,
            [char_id]
        )

        const char_name = result.rows[0];
        return char_name;
    }

}

module.exports = Characters;