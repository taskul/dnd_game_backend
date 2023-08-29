"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequesetError,
    UnauthorizedError,
} = require("../expressError");
const User = require("./User");

class Campaigns {

    static async getCampaign(username) {
        const response = await db.query(
            `SELECT cm.guild_id,
                    cm.campaign_owner,
                    c.campaign_id,
                    c.campaign_name,
                    g.guild_name
            FROM users u
            JOIN campaign_members cm
                ON u.user_id = cm.user_id
            JOIN campaign c
                ON cm.campaign_id = c.campaign_id
            JOIN guild g
                ON cm.guild_id = g.guild_id
             WHERE u.username = $1`,
            [username]
        )

        const campaigns = response.rows;
        return campaigns;
    };

    static async createCampaign(campaign_name, guild_id) {
        const response = await db.query(
            `INSERT INTO campaign
                (campaign_name,
                guild_id)
            VALUES ($1, $2)
            RETURNING campaign_id,
                      campaign_name, 
                      campaign_id`,
            [campaign_name, guild_id]
        );
        const campaign_id = response.rows[0];
        return campaign_id;
    };

    static async addCampaignMember(campaign_id, guild_id, username, owner) {
        const user = await User.get(username);
        if (user) {
            const response = await db.query(
                `INSERT INTO campaign_members
                    (campaign_id,
                    guild_id,
                    user_id,
                    campaign_owner)
                VALUES ($1, $2, $3, $4)
                RETURNING campaign_owner`,
                [campaign_id, guild_id, user.user_id, owner]
            );
            const campaign_owner = response.rows[0];
            return campaign_owner;
        }
    };
};

module.exports = Campaigns;