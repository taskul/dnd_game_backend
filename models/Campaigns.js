"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequesetError,
    UnauthorizedError,
} = require("../expressError");
const User = require("./User");

class Campaigns {

    static async getCampaign(guild_id) {
        const response = await db.query(
            `SELECT campaign_id,
                    campaign_name,
                    guild_id
             FROM campaign
             WHERE guild_id = $1`,
            [guild_id]
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
            RETURNING campaign_name, campaign_id`,
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