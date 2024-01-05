"use strict";

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./User");
const Guilds = require("./Guilds");
const Campaigns = require("./Campaigns");
const {
    commonBeforeAll,
    commonAfterAll,
    testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
afterAll(commonAfterAll);

// data variables
let guild_id, campaign_id;;

async function clearTables() {
    await db.query("DELETE FROM guild");
    await db.query("DELETE FROM guild_users");
    await db.query("DELETE FROM campaign");
    await db.query("DELETE FROM campaign_members");
}
clearTables()

async function createGuild() {
    const user = await User.get("u1");
    const guild = await Guilds.createGuild("Guild2", "https://example.com/guild1.jpg", "u1");
    guild_id = guild.guild_id;

}


// ---------------------------CAMPAIGNS
describe("create campaign", function () {
    test("works", async function () {
        await createGuild()
        const campaign = await Campaigns.createCampaign("Campaign1", guild_id);
        campaign_id = campaign.campaign_id;
        expect(campaign).toEqual({
            campaign_id: expect.any(Number),
            campaign_name: "Campaign1",
            guild_id: guild_id
        });
    });
});

describe("add campaign member", function () {
    test("works", async function () {
        const newCampaignMember = await Campaigns.addCampaignMember(campaign_id, guild_id, "u1", true);
        expect(newCampaignMember).toEqual({
            campaign_owner: true,
        });
    });
})

// members need to be added first before they campaign can be retrieved using username
describe("get campaign using username", function () {
    test("works", async function () {
        const campaign = await Campaigns.getCampaign("u1");
        expect(campaign).toEqual([{
            guild_id: expect.any(Number),
            campaign_owner: true,
            campaign_id: expect.any(Number),
            campaign_name: "Campaign1",
            guild_name: "Guild2",
            guild_img: "https://example.com/guild1.jpg"
        }]);
    });
})

describe("delete campaign", function () {
    test("works", async function () {
        const campaign = await Campaigns.deleteCampaign(campaign_id, "u1");
        expect(campaign).toEqual({
            campaign_name: "Campaign1",
        });
    });
})