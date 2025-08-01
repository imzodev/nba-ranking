-- Create players table only (players catalog)
CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    full_name TEXT,
    position TEXT,
    team TEXT,
    jersey_number TEXT,
    height TEXT,
    weight TEXT,
    birth_date TEXT,
    birth_place TEXT,
    nationality TEXT,
    high_school TEXT,
    college TEXT,
    
    -- Draft info
    draft_year TEXT,
    draft_round TEXT,
    draft_pick TEXT,
    draft_team TEXT,
    
    -- Career timeline
    career_start TEXT,
    career_end TEXT,
    years_active TEXT,
    career_history JSONB DEFAULT '[]'::jsonb,
    
    -- Career stats
    points INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    ppg DECIMAL DEFAULT 0,
    rpg DECIMAL DEFAULT 0,
    apg DECIMAL DEFAULT 0,
    
    -- Accolades
    championships INTEGER DEFAULT 0,
    mvps INTEGER DEFAULT 0,
    finals_mvps INTEGER DEFAULT 0,
    all_star INTEGER DEFAULT 0,
    all_nba INTEGER DEFAULT 0,
    all_defensive INTEGER DEFAULT 0,
    rookie_of_year BOOLEAN DEFAULT FALSE,
    hall_of_fame BOOLEAN DEFAULT FALSE,
    
    -- Awards and highlights
    highlights JSONB DEFAULT '[]'::jsonb,
    medals JSONB DEFAULT '[]'::jsonb,
    
    -- Images and media
    image_url TEXT,
    wikipedia_url TEXT,
    
    -- Raw data for reference
    raw_infobox JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);

-- Create users table to store user information for rankings
CREATE TABLE IF NOT EXISTS ranking_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL, -- User's email address for identification and duplicate prevention
    name TEXT NOT NULL, -- User's display name for attribution
    ip_address TEXT NOT NULL, -- Stored to prevent multiple submissions from same location
    last_submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp of user's most recent ranking submission
    submission_count INTEGER DEFAULT 1, -- Tracks how many times this user has submitted rankings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for user rankings (the top N lists)
CREATE TABLE IF NOT EXISTS user_rankings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES ranking_users(id) ON DELETE CASCADE, -- Links to the user who submitted this ranking
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE, -- Links to the player being ranked
    ranking_type INTEGER NOT NULL, -- Indicates which list type: 10, 25, 50, or 100 players
    rank INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 100), -- The player's position in the user's list (1 = best)
    submission_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Date when this ranking was submitted
    ip_address TEXT NOT NULL, -- Stored to prevent multiple submissions from same IP for same ranking type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Each user can rank a player only once per submission per ranking type
    UNIQUE(user_id, player_id, ranking_type, submission_date),
    -- Each rank can only be used once per user per submission per ranking type
    UNIQUE(user_id, rank, ranking_type, submission_date),
    -- Each IP can only submit once per ranking type per day
    UNIQUE(ip_address, ranking_type, submission_date)
);

-- Create table for daily aggregated rankings (the "ultimate" top N)
CREATE TABLE IF NOT EXISTS aggregated_rankings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE UNIQUE, -- Links to the player in this aggregated ranking (UNIQUE to prevent duplicates)
    points INTEGER NOT NULL, -- Total points accumulated based on ranking positions (higher is better)
    average_rank DECIMAL(5,2) NOT NULL, -- Mean position across all user rankings (lower is better)
    appearances INTEGER NOT NULL, -- Count of how many users included this player in their rankings
    calculation_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Date when this aggregated ranking was calculated
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Timestamp when the aggregated ranking was created
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Timestamp when the aggregated ranking was last updated
);

-- User indexes for authentication and duplicate prevention
CREATE INDEX IF NOT EXISTS idx_ranking_users_email ON ranking_users(email); -- For email lookups and uniqueness checks
CREATE INDEX IF NOT EXISTS idx_ranking_users_ip ON ranking_users(ip_address); -- For IP-based duplicate prevention

-- Ranking indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_rankings_user_id ON user_rankings(user_id); -- For retrieving all rankings by a specific user
CREATE INDEX IF NOT EXISTS idx_user_rankings_player_id ON user_rankings(player_id); -- For finding all rankings for a specific player
CREATE INDEX IF NOT EXISTS idx_user_rankings_date ON user_rankings(submission_date); -- For filtering rankings by date
CREATE INDEX IF NOT EXISTS idx_user_rankings_type ON user_rankings(ranking_type); -- For filtering by ranking type (10/25/50/100)

-- Aggregated ranking indexes for display and historical tracking
CREATE INDEX IF NOT EXISTS idx_aggregated_rankings_date ON aggregated_rankings(calculation_date); -- For retrieving rankings from a specific date
CREATE INDEX IF NOT EXISTS idx_aggregated_rankings_points ON aggregated_rankings(points); -- For sorting by points

-- Row Level Security is disabled for population - enable later with proper policies
-- ALTER TABLE players ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ranking_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_rankings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE aggregated_rankings ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (using DROP/CREATE pattern since IF NOT EXISTS is not supported for triggers)
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
DROP TRIGGER IF EXISTS update_ranking_users_updated_at ON ranking_users;
CREATE TRIGGER update_ranking_users_updated_at BEFORE UPDATE ON ranking_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add triggers for user_rankings and aggregated_rankings tables
DROP TRIGGER IF EXISTS update_user_rankings_updated_at ON user_rankings;
CREATE TRIGGER update_user_rankings_updated_at BEFORE UPDATE ON user_rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
DROP TRIGGER IF EXISTS update_aggregated_rankings_updated_at ON aggregated_rankings;
CREATE TRIGGER update_aggregated_rankings_updated_at BEFORE UPDATE ON aggregated_rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE POLICY "Allow anonymous inserts" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous updates" ON players FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous selects" ON players FOR SELECT USING (true);