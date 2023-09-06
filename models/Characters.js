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
                `SELECT char_id,
                        char_name,
                        user_id
                FROM character
                WHERE user_id = $1`,
                [user.user_id]
            )

            const characters = reponse.rows;
            return characters;
        }
    }

    // get char_id, char_race, char_alignment, char_class, exp_points, char_level
    static async getCharactersInfo(char_id) {
        // Base Info
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

        // Base Stats
        const baseStats = await db.query(
            `SELECT strength,
                    dexterity,
                    constitution,
                    inteligence,
                    wisdom,
                    charisma
            FROM character_base_stats
            WHERE char_id = $1`,
            [char_id]
        )

        const charBaseStats = baseStats.rows[0];

        // Health and Armor
        const healthArmor = await db.query(
            `SELECT hit_points,
                    temp_hit_points,
                    armor_class,
                    inspiration,
                    speed,
                    prof_bonus,
                    hit_dice
            FROM hit_points_armor_class
            WHERE char_id = $1`,
            [char_id]
        )

        const health = healthArmor.rows[0]

        return { charactersInfo, charBaseStats, health };
    }

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

    // get character avatar
    static async getCharacterAvatar(char_id) {
        const response = await db.query(
            `SELECT img_url
            FROM character_avatar
            WHERE char_id = $1`,
            [char_id]
        )

        const avatar = response.rows[0];
        return avatar;
    }

    // Create character avatar
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

    // Create character base stats
    // accepts char_id, strength, dexterity, constitution, inteligence, wisdom, charisma
    // return char_id
    static async createCharacterBaseStats(char_id, strength, dexterity, constitution, intelligence, wisdom, charisma) {
        const response = await db.query(
            `INSERT INTO character_base_stats
                (char_id, 
                strength,
                dexterity,
                constitution,
                inteligence,
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
                    inteligence = $4,
                    wisdom = $5,
                    charisma = $6
                WHERE char_id = $7
                RETURNING char_id`,
            [strength, dexterity, constitution, intelligence, wisdom, charisma, char_id]
        )

        const updatedBaseStats = response.rows[0];
        return updatedBaseStats;
    }


    // Create character hit_points_armor_class
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
            [hit_points, temp_hit_points, armor_class, inspiration, speed, prof_bonus, hit_dice, char_id]
        )

        const updatedHealthArmor = response.rows[0];
        return updatedHealthArmor;
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