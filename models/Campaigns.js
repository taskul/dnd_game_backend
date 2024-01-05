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
                    g.guild_name,
                    g.guild_img
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
        const checkDuplicate = await db.query(
            `SELECT campaign_name,
                    guild_id
            FROM campaign
            WHERE campaign_name = $1 AND guild_id = $2`,
            [campaign_name, guild_id]
        )

        if (!checkDuplicate.rows[0]) {
            const response = await db.query(
                `INSERT INTO campaign
                    (campaign_name,
                    guild_id)
                VALUES ($1, $2)
                RETURNING campaign_id,
                        campaign_name, 
                        guild_id`,
                [campaign_name, guild_id]
            );
            const campaign_id = response.rows[0];
            return campaign_id;
        }
    };

    static async addCampaignMember(campaign_id, guild_id, username, owner) {
        const user = await User.get(username);
        if (user) {
            const checkExistance = await db.query(
                `SELECT campaign_id
                FROM campaign_members
                WHERE user_id = $1 AND campaign_id = $2`,
                [user.user_id, campaign_id]
            )

            // this avoids creating addtional entries for the same users
            if (!checkExistance.rows[0]) {
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
            };
        };
    };

    // deleting campaign
    static async deleteCampaign(campaign_id, username) {

        const correctUser = await db.query(
            `SELECT cm.campaign_id,
                    cm.campaign_owner
            FROM campaign_members cm
            JOIN users u
                ON u.user_id = cm.user_id
            WHERE cm.campaign_id = $1 AND u.username = $2`,
            [campaign_id, username]
        )

        const campaignFound = correctUser.rows[0];

        if (campaignFound) {
            if (campaignFound.campaign_owner) {
                const result = await db.query(
                    `DELETE
                    FROM campaign
                    WHERE campaign_id = $1
                    RETURNING campaign_name`,
                    [campaignFound.campaign_id]
                )

                const campaign_name = result.rows[0];
                return campaign_name;
            }
        }
    }
};

module.exports = Campaigns;