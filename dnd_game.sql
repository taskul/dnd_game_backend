DROP DATABASE dnd_game;
CREATE DATABASE dnd_game;
\connect dnd_game

\i dnd_game_schema.sql

DROP DATABASE dnd_game_test;
CREATE DATABASE dnd_game_test;
\connect dnd_game_test

\i dnd_game_schema.sql