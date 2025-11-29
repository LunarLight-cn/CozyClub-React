DROP TABLE IF EXISTS game_lobbies;
DROP TABLE IF EXISTS game_players;
DROP TABLE IF EXISTS lobbies;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS riddle_states;

-- Lobby
CREATE TABLE lobbies (
    code TEXT PRIMARY KEY,          -- Lobby Code
    host_id INTEGER,                -- Host (User ID)
    status TEXT DEFAULT 'waiting',  -- waiting, playing, ended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Participants
CREATE TABLE participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lobby_code TEXT,                -- in (Code) Lobby
    user_id INTEGER,                -- User ID (Guest -> NULL)
    display_name TEXT NOT NULL,     -- Nickname 
    is_ready BOOLEAN DEFAULT FALSE, -- Ready?
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- The Riddle (Riddle Specific)
CREATE TABLE riddle_states (
    lobby_code TEXT PRIMARY KEY,    -- Which Lobby in?
    secret_word TEXT,               -- the Riddle
    keeper_id INTEGER,              -- Who's Keeper
    pretender_id INTEGER,           -- Who's Pretender
    game_stage TEXT DEFAULT 'qa'    -- qa, vote, end
);