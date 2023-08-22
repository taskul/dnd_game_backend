"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequesetError,
    UnauthorizedError,
} = require("../expressError");

class GameMaps {
    static async getMap(username) {
        const response = await db.query(
            `SELECT game_map_id, map_name
            FROM game_map
            WHERE username = $1`,
            [username.toLowerCase()]
        )
        const mapInfo = response.rows;
        return mapInfo;
    }

    static async checkExistingMap(map_name, username) {
        const response = await db.query(
            `SELECT game_map_id, map_name
            FROM game_map
            WHERE map_name = $1 AND username = $2`,
            [map_name, username.toLowerCase()]
        )
        const mapExists = response.rows[0];
        return mapExists;
    }

    static async getMapById(mapId) {
        const response = await db.query(
            `SELECT map_assets
            FROM game_map
            WHERE game_map_id = $1`,
            [mapId]
        )
        const mapAssets = response.rows[0];
        return mapAssets;
    }

    static async updateExistingMap(map_name, username, assets) {
        const response = await db.query(
            `UPDATE game_map
            SET map_assets=$1
            WHERE map_name = $2 AND username = $3`,
            [assets, map_name, username.toLowerCase()]
        )
        const mapExists = response.rows[0];
        return mapExists;
    }

    static async createMap(mapName, username, assets) {
        const result = await db.query(
            `INSERT INTO game_map
                (map_name,
                 username,
                 map_assets)
            VALUES ($1, $2, $3)
            RETURNING map_name, map_assets`,
            [mapName, username, assets]
        )

        const map_name = result.rows[0]
        return map_name;
    }
}

module.exports = GameMaps;