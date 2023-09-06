CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL, 
    email TEXT NOT NULL,
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE guild (
    guild_id SERIAL PRIMARY KEY,
    guild_name VARCHAR(30) UNIQUE NOT NULL,
    guild_img TEXT,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE
);

CREATE TABLE guild_users (
    id SERIAL PRIMARY KEY,
    guild_id INTEGER REFERENCES guild ON DELETE CASCADE,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    guild_owner BOOLEAN NOT NULL DEFAULT FALSE,
    joined BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE guild_invitation (
    id SERIAL PRIMARY KEY,
    invitation_token TEXT UNIQUE NOT NULL,
    guild_id INTEGER REFERENCES guild ON DELETE CASCADE
);

CREATE TABLE campaign (
    campaign_id SERIAL PRIMARY KEY,
    campaign_name TEXT NOT NULL, 
    guild_id INTEGER REFERENCES guild ON DELETE CASCADE
);

CREATE TABLE campaign_members (
    id SERIAL PRIMARY KEY, 
    campaign_id INTEGER REFERENCES campaign ON DELETE CASCADE,
    guild_id INTEGER REFERENCES guild ON DELETE CASCADE,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    campaign_owner BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE game_map (
    game_map_id SERIAL PRIMARY KEY,
    map_name VARCHAR(30) NOT NULL, 
    username VARCHAR(25) NOT NULL,
    map_assets JSON
);

CREATE TABLE game_map_owner (
    game_map_id INTEGER,
    user_id INTEGER,
    map_owner BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (game_map_id, user_id),
    FOREIGN KEY (game_map_id) 
        REFERENCES game_map ON DELETE CASCADE,
    FOREIGN KEY (user_id) 
        REFERENCES users ON DELETE CASCADE
);

CREATE TABLE group_chats (
    chat_id SERIAL PRIMARY KEY,
    chat_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
    participant_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    chat_id INTEGER REFERENCES group_chats(chat_id),
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(user_id),
    chat_id INTEGER REFERENCES group_chats(chat_id),
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE private_messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(user_id),
    receiver_id INTEGER REFERENCES users(user_id),
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE character (
    char_id SERIAL PRIMARY KEY,
    char_name VARCHAR(30) NOT NULL,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE
);

CREATE TABLE character_info (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    char_race TEXT, 
    char_alignment TEXT, 
    char_class TEXT,
    exp_points INTEGER,
    char_level INTEGER
);

CREATE TABLE character_avatar (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    img_url TEXT
);


CREATE TABLE character_appearance (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    age INTEGER,
    height INTEGER,
    weight INTEGER,
    eyes TEXT,
    skin TEXT,
    hair TEXT,
    background TEXT,
    character_appearance TEXT
);

CREATE TABLE character_base_stats (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    strength INTEGER,
    dexterity INTEGER,
    constitution INTEGER,
    inteligence INTEGER,
    wisdom INTEGER,
    charisma INTEGER
);

CREATE TABLE saving_throws (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    str INTEGER,
    dex INTEGER,
    con INTEGER,
    intel INTEGER,
    wis INTEGER,
    cha INTEGER
);

CREATE TABLE hit_points_armor_class (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    hit_points INTEGER,
    temp_hit_points INTEGER,
    armor_class INTEGER,
    inspiration INTEGER,
    initiative INTEGER,
    speed INTEGER,
    prof_bonus INTEGER,
    hit_dice TEXT
);

CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name TEXT NOT NULL
);

CREATE TABLE character_skills (
    id SERIAL PRIMARY KEY,
    skill_id INTEGER REFERENCES skills ON DELETE CASCADE,
    char_id INTEGER REFERENCES character ON DELETE CASCADE
);



CREATE TABLE character_personality (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    personality_traits TEXT,
    ideals TEXT,
    bonds TEXT,
    flaws TEXT,
    features_traits TEXT
);

CREATE TABLE character_proficiencies (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    proficiencies TEXT
);

CREATE TABLE character_equipment (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    copper INTEGER,
    silver INTEGER,
    electrum INTEGER,
    gold INTEGER,
    platinum INTEGER,
    equipment TEXT
);

CREATE TABLE character_weapons (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    weapon1 TEXT,
    atk_bonus TEXT,
    damage_type TEXT,
    weapon2 TEXT,
    atk_bonus2 TEXT,
    damage_type2 TEXT,
    weapon3 TEXT,
    atk_bonus3 TEXT,
    damage_type3 TEXT,
    weapon4 TEXT,
    atk_bonus4 TEXT,
    damage_type4 TEXT,
    weapon5 TEXT,
    atk_bonus5 TEXT,
    damage_type5 TEXT
);

CREATE TABLE character_spells (
    id SERIAL PRIMARY KEY,
    char_id INTEGER REFERENCES character ON DELETE CASCADE,
    spells TEXT
);


