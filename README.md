# DND game backend

![image of a dragon](https://github.com/taskul/dnd_front_end/blob/6130307f9b61daeafd86ccac6cd158e780202e3e/public/dragon_resized.png)

https://dnd-game.onrender.com/

DND Den is a live chat based Dungeons and Dragons game that has features like live chat, bilding 2d maps to share in live chat for fun setting visualization, character bulider with avatar and character sheet, and dice rolling. Chat and dice rolling are saved in the database and can be accessed by game users at any time.

The backend has all of the game APIs for CRUD events for Guilds, Campaigns, Map Builder, Character sheet and live chat. The live chat uses socket.io to handle live game events.

# Running the project
`node server.js` and developer mode `nodemon server.js`

# Running tests
`jset -i`

## Dependencies
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-ws": "^5.0.2",
    "jsonschema": "^1.4.1",
    "jsonwebtoken": "^9.0.1",
    "morgan": "^1.10.0",
    "pg": "^8.11.2",
    "socket.io": "^4.5.1",
    "supertest": "^6.3.3"

### Project Directories
- helpers - has sql for updating parts of the sql data and tokens.js which helps to create a jwt token
- middeleware - has auth.js file which manages all middleware for authentication
- models - has classes for each section of the application that does CRUD database entries using db
    - Campaigns.js, Characters.js, GameMaps.js Gilds.js, Messages.js, User.js
- routes - manages all of the routes for back end APIs for CRUD requests:
  - auth.js, campaign.js, characters.js, guilds.js, maps.js, messages.js, users.js
- schemas - users `jsonschema` to validate form data for user login, sign up and user update.
- views - stores React build file
- db.js - has a connection to database
- dnd_game_schema.sql - has all of the database schemas

