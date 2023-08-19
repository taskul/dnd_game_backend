"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequesetError,
    UnauthorizedError,
} = require("../expressError");

class GameMaps {
    static async getMap(mapName, username) {
        const response = await db.query(
            `SELECT map_assets
            FROM game_map
            WHERE map_name = $1 AND username = $2`,
            [
                mapName.toLowerCase(),
                username.toLowerCase()
            ]
        )
        const mapAssets = response.rows[0];
        return mapAssets;
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