"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./User");
const Guilds = require("./Guilds");
const Characters = require("./Characters");
const {
    commonBeforeAll,
    commonAfterAll,
    testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
afterAll(commonAfterAll);

async function clearTables() {
    await db.query("DELETE FROM guild");
    await db.query("DELETE FROM guild_users");
    await db.query("DELETE FROM character");
    await db.query("DELETE FROM character_info");
    await db.query("DELETE FROM character_avatar");
    await db.query("DELETE FROM character_base_stats");
    await db.query("DELETE FROM hit_points_armor_class");
    await db.query("DELETE FROM saving_throws");
    await db.query("DELETE FROM skills");
    await db.query("DELETE FROM character_equipment");
    await db.query("DELETE FROM character_weapons");
    await db.query("DELETE FROM character_spells");
    await db.query("DELETE FROM character_proficiencies");
}
clearTables()

describe("create character", function () {
    test("works", async function () {
        const character = await Characters.createCharacter("Character1", "u1")
        expect(character).toEqual({
            char_id: expect.any(Number),
            char_name: "Character1",
        });
    });
});