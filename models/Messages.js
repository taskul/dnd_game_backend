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
            const existingCampaign = campaign[0]
            if (existingCampaign.campaign_id) {
                const response = await db.query(
                    `SELECT chat_id,
                            chat_name,
                            campaign_id
                    FROM group_chats
                    WHERE campaign_id = $1`,
                    [campaign_id]
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
            const campaigns = await Campaigns.getCampaign(username);
            const existingCampaign = campaigns[0]
            if (existingCampaign.campaign_owner) {
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

    static async createChatRoomParticipants(chat_id, username) {
        const user = await User.get(username);
        if (user) {
            const response = await db.query(
                `INSERT INTO participants
                            (user_id,
                            chat_id)
                VALUES ($1, $2)
                RETURNING participant_id,
                          chat_id`,
                [user.user_id, chat_id]
            );
            const chat_participant = response.rows[0];
            return chat_participant;
        }
    };


    static async getChatRoomParticipants(chat_id, username) {
        const user = await User.get(username);
        if (user) {
            const response = await db.query(
                `SELECT user_id,
                        chat_id
                    FROM participants
                    WHERE user_id = $1 AND chat_id = $2`,
                [user.user_id, chat_id]
            );
            const participant = response.rows[0];
            return participant;
        };
    };

    // Chat room characters
    static async createChatCharacter(chat_id, char_id, char_name, username) {
        const response = await db.query(
            `INSERT INTO group_chats_characters
                        (chat_id,
                         char_id,
                         char_name,
                         username)
            VALUES ($1, $2, $3, $4)
            RETURNING chat_id,
                      char_id`,
            [chat_id, char_id, char_name, username]
        );
        const chat_character = response.rows[0];
        return chat_character;
    };

    // Update chat character
    static async updateChatCharacter(chat_id, char_id, char_name, username) {
        const response = await db.query(
            `UPDATE group_chats_characters
                SET char_id = $1,
                SET char_name = $2
                WHERE chat_id = $3 AND username = $4
                RETURNING char_id`,
            [char_id, char_name, chat_id, username]
        )

        const updatedCharacter = response.rows[0];
        return updatedCharacter;
    }

    static async getChatCharacter(chat_id, username) {
        const user = await User.get(username);
        if (user) {
            const response = await db.query(
                `SELECT chat_id,
                        char_id,
                        char_name,
                        username
                FROM group_chats_characters
                WHERE chat_id = $1 AND username = $2`,
                [chat_id, username]
            );
            const character = response.rows[0];
            return character;
        }
    };

    static async createMessages(chat_id, username, message) {
        const user = await User.get(username);
        if (user) {
            const response = await db.query(
                `INSERT INTO group_messages
                            (sender_id,
                            chat_id,
                            message,
                            username)
                VALUES ($1, $2, $3, $4)
                RETURNING message`,
                [user.user_id, chat_id, message, username]
            );
            const newMessage = response.rows[0];
            return newMessage;
        }
    };

    static async getMessages(chat_id, username) {
        const user = await User.get(username);
        if (user) {
            const response = await db.query(
                `SELECT sender_id,
                            username,
                            chat_id,
                            message
                    FROM group_messages
                    WHERE chat_id = $1`,
                [chat_id,]
            );
            const messages = response.rows;
            return messages;
        }
    };
}

module.exports = Messages;