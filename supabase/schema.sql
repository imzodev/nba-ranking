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

-- Row Level Security is disabled for population - enable later with proper policies
-- ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
