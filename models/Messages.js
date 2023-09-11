"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequesetError,
    UnauthorizedError,
} = require("../expressError");
const User = require("./User")
const Campaigns = require("./Campaigns")

class Messages {

    // first checks to see if user exists
    // then checks if the user is part of the campaign before they can join
    static async getChatRoom(campaign_name, campaign_id, username) {
        const user = await User.get(username);
        if (user) {
            const campaign = await Campaigns.getCampaign(username);
            if (campaign.campaign_id) {
                const response = await db.query(
                    `SELECT chat_id,
                            chat_name,
                            campaign_id
                    FROM group_chats
                    WHERE chat_name = $1 AND campaign_id = $2`,
                    [campaign_name, campaign_id]
                );
                const game_chat = response.rows[0];
                return game_chat;
            };
        };
    };

    // first checks to see if user exists
    // then checks if the user is the campaign owner
    // if they are the owner, then they can create the chat room
    static async createChatRoom(campaign_name, campaign_id, username) {
        const user = await User.get(username);
        if (user) {
            const campaign = await Campaigns.getCampaign(username);
            if (campaign.campaign_owner) {
                const response = await db.query(
                    `INSERT INTO group_chats
                    (chat_name,
                    campaign_id)
                VALUES ($1, $2)
                RETURNING chat_id,
                        chat_name,
                        campaign_id`,
                    [campaign_name, campaign_id]
                );
                const game_chat = response.rows[0];
                return game_chat;
            }
        }
    };
}

module.exports = Messages;