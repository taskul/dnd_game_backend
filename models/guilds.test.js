"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./User");
const Guilds = require("./Guilds");
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
}
clearTables()

// ---------------------------GUILDS

describe("create guild", function () {
    test("works", async function () {
        const guild = await Guilds.createGuild("Guild1", "https://example.com/guild1.jpg", "u1");
        expect(guild).toEqual({
            guild_id: expect.any(Number)
        });
    });
});
describe("get guild using username", function () {
    test("works", async function () { 
        const guild = await Guilds.getGuild("u1");
        expect(guild).toEqual([{
            guild_id: expect.any(Number),
            guild_name: "Guild1",
            guild_img: "https://example.com/guild1.jpg",
            username: "u1",
            guild_owner: true,
        }]);
    });
})

describe("create new guild member", function () {
    test("works", async function () {
        let user = await User.get("u2");
        const guild = await Guilds.getGuild("u1");
        const newGuildMember = await Guilds.createNewGuildMember(guild[0].guild_id, user.user_id);
        expect(newGuildMember).toEqual({
            guild_id: expect.any(Number)
        });
    });
})

describe("get all guild members that are not owners of the guild", function () {
    test("works", async function () { 
        const guild = await Guilds.getGuild("u2");
        const guildMembers = await Guilds.getAllGuildMembers(guild[0].guild_id);
        expect(guildMembers).toEqual([{
            guild_id: expect.any(Number),
            username: "u2",
            first_name: "U2F",
        }]);
    });
})

// used for inviting other users to join the specific guild
describe("create guild invite", function () {
    test("works", async function () {
        const guild = await Guilds.getGuild("u1");
        const guildToken = '1234567890';
        const guildInvite = await Guilds.createGuildInvite(guildToken, guild[0].guild_id);
        expect(guildInvite).toEqual({
            guild_id: guild[0].guild_id
        });
    });
})

// used to retrieve guild token that can be resent to users
describe("get existing guild token", function () {
    test("works", async function () {
        const guild = await Guilds.getGuild("u1");
        const guildToken = await Guilds.getGuildToken(guild[0].guild_id);
        expect(guildToken).toEqual({
            invitation_token: '1234567890'
        });
    });
});

// adding user to the guild after they sign up using a guild token
describe("get guild id from token", function () {
    test("works", async function () {
        const guild = await Guilds.getGuild("u1");
        const guildToken = await Guilds.getGuildToken(guild[0].guild_id);
        const guildId = await Guilds.getGuildIdFromToken(guildToken.invitation_token);
        expect(guildId).toEqual({
            guild_id: expect.any(Number)
        });
    });
});

// when user that is not the owner of the guild want to leave the guild
describe("leave guild", function () {
    test("works", async function () {
        const guild = await Guilds.getGuild("u2");
        let user = await User.get("u2");
        const guildId = await Guilds.leaveGuild(guild[0].guild_id, user.user_id);
        expect(guildId).toEqual({
            guild_id: guild[0].guild_id
        });
    });
})

describe("delete guild", function () {
    test("works", async function () {
        const guild = await Guilds.getGuild("u1");
        const guildId = await Guilds.deleteGuild(guild[0].guild_id);
        expect(guildId).toEqual({
            guild_name: "Guild1"
        });
    });
})