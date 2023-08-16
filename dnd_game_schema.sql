CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL, 
    email TEXT NOT NULL,
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE guild (
    guild_id SERIAL PRIMARY KEY,
    guild_name VARCHAR(30) NOT NULL,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    guild_owner BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE game_map (
    game_map_id SERIAL PRIMARY KEY,
    map_name VARCHAR(30) NOT NULL, 
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
    character_id SERIAL PRIMARY KEY,
    character_name VARCHAR(30) NOT NULL,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    character_class TEXT NOT NULL,
    level INTEGER NOT NULL,
    experience_points INTEGER NOT NULL,
    alignment TEXT NOT NULL
);

CREATE TABLE character_appearance (
    character_id INTEGER,
    race TEXT NOT NULL,
    age INTEGER NOT NULL,
    height INTEGER,
    weight INTEGER,
    eyes TEXT,
    skin TEXT,
    hair TEXT,
    background TEXT,
    character_appearance TEXT,
    PRIMARY KEY (character_id),
    FOREIGN KEY (character_id) 
        REFERENCES character (character_id) ON DELETE CASCADE
);

CREATE TABLE character_base_stats (
    character_id INTEGER,
    strength INTEGER NOT NULL,
    dexterity INTEGER NOT NULL,
    constitution INTEGER NOT NULL,
    inteligence INTEGER NOT NULL,
    wisdom INTEGER NOT NULL,
    charisma INTEGER NOT NULL,
    PRIMARY KEY (character_id),
    FOREIGN KEY (character_id) 
        REFERENCES character(character_id) ON DELETE CASCADE
);

CREATE TABLE character_skills (
    character_id INTEGER,
    skills JSON,
    saving_throws JSON,
    PRIMARY KEY (character_id),
    FOREIGN KEY (character_id) 
        REFERENCES character(character_id) ON DELETE CASCADE
);

CREATE TABLE character_action_stats (
    character_id INTEGER,
    current_hit_points INTEGER NOT NULL,
    temp_hit_points INTEGER,
    inspiration INTEGER,
    proficiency_bonus INTEGER,
    armor_class INTEGER NOT NULL,
    initiative INTEGER,
    speed INTEGER,
    PRIMARY KEY (character_id),
    FOREIGN KEY (character_id) 
        REFERENCES character(character_id) ON DELETE CASCADE
);


CREATE TABLE character_personality (
    character_id INTEGER,
    personality_traits TEXT,
    ideals TEXT,
    bonds TEXT,
    flaws TEXT,
    features_traits TEXT,
    PRIMARY KEY (character_id),
    FOREIGN KEY (character_id) 
        REFERENCES character(character_id) ON DELETE CASCADE
);

CREATE TABLE character_proficiencies (
    character_id INTEGER,
    proficiencies TEXT,
    languages TEXT,
    PRIMARY KEY (character_id),
    FOREIGN KEY (character_id) 
        REFERENCES character(character_id) ON DELETE CASCADE
);

CREATE TABLE character_equipment (
    character_id INTEGER,
    weapons TEXT,
    armor TEXT,
    other TEXT,
    copper INTEGER,
    silver INTEGER,
    electrum INTEGER,
    gold INTEGER,
    platinum INTEGER,
    PRIMARY KEY (character_id),
    FOREIGN KEY (character_id) 
        REFERENCES character(character_id) ON DELETE CASCADE
);

CREATE TABLE character_attack_spells (
    character_id INTEGER,
    attacks TEXT,
    spells TEXT,
    PRIMARY KEY (character_id),
    FOREIGN KEY (character_id) 
        REFERENCES character(character_id) ON DELETE CASCADE
);



