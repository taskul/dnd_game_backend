"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequesetError,
    UnauthorizedError,
} = require("../expressError");
const User = require("./User")

class Guilds {

    // get guild, user information and if user owns the guild
    static async getGuild(username) {
        const response = await db.query(
            `SELECT 
                g.guild_id, 
                g.guild_name, 
                u.username, 
                gu.guild_owner
            FROM guild g
            JOIN guild_users gu
                ON g.guild_id = gu.guild_id
            JOIN users u
                ON gu.user_id = u.user_id
            WHERE u.username = $1`,
            [username.toLowerCase()]
        )
        const guildInfo = response.rows
        ;
        return guildInfo;
    }

    static async getAllGuildMembers(guild_id) {
        const response = await db.query(
            `SELECT 
                gu.guild_id,
                u.username,
                u.first_name
             FROM guild_users gu
             JOIN users u
                ON gu.user_id = u.user_id
             WHERE gu.guild_id = $1 AND gu.guild_owner = $2`,
             [guild_id, false]
        )
        const allUsers = response.rows;
        return allUsers;
    }

    // creating a new guild
    static async createGuild(guild_name, username) {
        const response = await User.get(username);
        if (response) {
            const user_id = response.user_id;
            const result = await db.query(
                `INSERT INTO guild
                    (guild_name,
                    user_id)
                VALUES ($1, $2)
                RETURNING guild_id`,
                [guild_name, user_id]
                )

            const newGuild = result.rows[0]

            const result2 = await db.query(
                `INSERT INTO guild_users
                    (guild_id,
                    user_id,
                    guild_owner,
                    joined)
                VALUES ($1, $2, $3, $4)
                RETURNING guild_id`,
                [newGuild.guild_id, user_id, true, true]
            )
            const guildId = result2.rows[0]
            return guildId;
        }
    }

    // creating a new Guild member
    static async createNewGuildMember(guild_id, user_id) {
        const response = await db.query(
            `INSERT INTO guild_users
                (guild_id,
                user_id,
                guild_owner,
                joined)
            VALUES ($1, $2, $3, $4)
            RETURNING guild_id`,
            [guild_id, user_id, false, true]
        )
    }

    // used for inviting other users to join the specific guild
    static async createGuildInvite(guild_token, guild_id) {
        const result = await db.query(
            `INSERT INTO guild_invitation
                (invitation_token,
                 guild_id)
            VALUES ($1, $2)
            RETURNING guild_id`,
            [guild_token, guild_id]
        )

        const guildId = result.rows[0];
        return guildId;
    }

    // used to retrieve guild token that can be resent to users
    static async getGuildToken(guild_id) {
        const result = await db.query(
            `SELECT invitation_token
             FROM guild_invitation
             WHERE guild_id = $1`,
             [guild_id]
        )
        const guildToken = result.rows[0];
        return guildToken;
    }

    // adding user to the guild after they sign up using a guild token
    static async getGuildIdFromToken(guildToken) {
        const result = await db.query(
            `SELECT guild_id
             FROM guild_invitation
             WHERE invitation_token = $1`,
             [guildToken]
        )
        const guildId = result.rows[0];
        return guildId;
    }

    // when user that is not the owner of the guild want to leave the guild
    static async leaveGuild(guild_id, user_id) {
        const result = await db.query(
            `DELETE
                FROM guild_users
                WHERE guild_id = $1 AND user_id = $2`,
                [guild_id, user_id]
        )
    }

    // deleting the guild
    static async deleteGuild(guild_id) {
        const result = await db.query(
            `DELETE 
                FROM guild
                WHERE guild_id = $1
                RETURNING guild_name`,
                [guild_id]
        )

        const guild_name = result.rows[0];
        return guild_name;
    }
}

module.exports = Guilds;