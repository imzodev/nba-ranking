import { WorkingWikipediaExtractor } from './working-wikipedia-extraction.js';
import { WikipediaPlayerFetcher, nbaSources } from './fetch-nba-players.js';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

class SupabasePopulator {
  constructor() {
    this.extractor = new WorkingWikipediaExtractor();
    this.playerFetcher = new WikipediaPlayerFetcher();
    
    // List of top/notable NBA players
    this.topPlayers = [
      // NBA legends and Hall of Famers
      'Michael Jordan', 'LeBron James', 'Kobe Bryant', 'Magic Johnson', 'Larry Bird',
      'Kareem Abdul-Jabbar', 'Wilt Chamberlain', 'Bill Russell', 'Shaquille O\'Neal', 'Tim Duncan',
      'Hakeem Olajuwon', 'Oscar Robertson', 'Julius Erving', 'Jerry West', 'Kevin Durant',
      'Stephen Curry', 'Dirk Nowitzki', 'Charles Barkley', 'Karl Malone', 'John Stockton',
      'Kevin Garnett', 'Allen Iverson', 'Dwyane Wade', 'Scottie Pippen', 'David Robinson',
      'Patrick Ewing', 'Isiah Thomas', 'Clyde Drexler', 'James Harden', 'Giannis Antetokounmpo',
      'Russell Westbrook', 'Kawhi Leonard', 'Chris Paul', 'Gary Payton', 'Ray Allen',
      'Reggie Miller', 'Dominique Wilkins', 'Bob Cousy', 'Elvin Hayes', 'John Havlicek',
      'Moses Malone', 'Jason Kidd', 'Steve Nash', 'Bob Pettit', 'George Mikan',
      'Nikola Jokić', 'Joel Embiid', 'Luka Dončić', 'Anthony Davis', 'Jayson Tatum',
      
      // Current stars
      'Damian Lillard', 'Jimmy Butler', 'Paul George', 'Kyrie Irving', 'Devin Booker',
      'Ja Morant', 'Trae Young', 'Donovan Mitchell', 'Bam Adebayo', 'Zion Williamson',
      'Shai Gilgeous-Alexander', 'Jaylen Brown', 'Anthony Edwards', 'LaMelo Ball', 'Tyrese Haliburton'
    ];
    
    // Use environment variables for Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    // Initialize Supabase client with anon key (RLS policies will handle permissions)
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async fetchPlayersFromWikipedia() {
    console.log('🔍 Fetching NBA players from Wikipedia categories...');
    
    try {
      // Check if we have a cached player list
      if (fs.existsSync('./data/nba-players.json')) {
        console.log('📋 Found cached player list, loading from file...');
        const players = JSON.parse(fs.readFileSync('./data/nba-players.json', 'utf8'));
        console.log(`✅ Loaded ${players.length} players from cache`);
        return players;
      }
      
      // Fetch players from Wikipedia if no cache exists
      return await this.playerFetcher.fetchAllPlayers(nbaCategories);
    } catch (error) {
      console.error('❌ Error fetching players:', error);
      return [];
    }
  }

  /**
   * Check if an entry is actually a player and not a team, division, or event
   * @param {Object} fields - The infobox fields from Wikipedia
   * @param {Array} highlights - Parsed highlights
   * @param {string} playerName - The player's name/slug
   * @param {Array} careerHistory - Parsed career history
   * @returns {boolean} - True if this is a player, false otherwise
   */
  isActualPlayer(fields, highlights, playerName, careerHistory) {
    // Check for common team/division/event keywords in the name
    const nonPlayerKeywords = [
      'Division', 'Conference', 'NBA season', 'NBA Finals', 
      'NBA Draft', 'All-Star', 'All-NBA', 'All-Defensive',
      'Bucks', 'Bulls', 'Cavaliers', 'Celtics', 'Clippers', 
      'Grizzlies', 'Hawks', 'Heat', 'Hornets', 'Jazz', 
      'Kings', 'Knicks', 'Lakers', 'Mavericks', 
      'Nets', 'Nuggets', 'Pacers', 'Pelicans', 'Pistons', 
      'Raptors', 'Rockets', 'Spurs', 'Suns', 'Thunder', 
      'Timberwolves', 'Trail Blazers', 'Warriors', 'Wizards',
      'NBA G League', 'NBA Academy', 'NBA', 'Basketball Association'
    ];
    
    const name = fields.name || playerName.replace(/_/g, ' ');
    
    // Check if name contains any non-player keywords
    for (const keyword of nonPlayerKeywords) {
      if (name.includes(keyword)) {
        return false;
      }
    }
    
    // Check for player-specific fields
    const playerIndicators = [
      // At least one of these should be present for a player
      fields.position, fields.career_position, fields.height, 
      fields.height_ft, fields.weight, fields.weight_lb,
      fields.birth_date, fields.birth_place,
      fields.college, fields.draft_year, fields.career_start,
      highlights.length > 0
    ];
    
    // Count how many player indicators are present
    const indicatorCount = playerIndicators.filter(Boolean).length;
    
    // Require at least 3 player indicators to be considered a player
    return indicatorCount >= 3;
  }

  async populateDatabase(playerSlugs) {
    console.log('🚀 Starting Supabase database population...');
    
    try {
      // If input is not an array of slugs but a boolean or undefined, fetch players first
      let players = playerSlugs;
      if (!Array.isArray(playerSlugs) || playerSlugs.length === 0) {
        console.log('🔍 No players provided, fetching from Wikipedia...');
        const fetchedPlayers = await this.fetchPlayersFromWikipedia();
        players = fetchedPlayers.map(p => p.slug);
      }
      
      console.log(`🏀 Processing ${players.length} players...`);
      
      // Process in batches to avoid overwhelming the API
      const batchSize = 10;
      const totalBatches = Math.ceil(players.length / batchSize);
      
      for (let i = 0; i < players.length; i += batchSize) {
        const batch = players.slice(i, i + batchSize);
        console.log(`📊 Processing batch ${Math.floor(i/batchSize) + 1}/${totalBatches} (${batch.length} players)...`);
        
        // Process players in parallel within each batch
        await Promise.all(batch.map(async (playerName) => {
          console.log(`📊 Processing ${playerName}...`);
          
          const playerData = await this.extractor.extractPlayerData(playerName);
          
          if (playerData) {
          const fields = playerData.raw_infobox || playerData.allFields || {};
          
          // Build career history
          const careerHistory = [];
          let teamIndex = 1;
          while (fields[`years${teamIndex}`] && fields[`team${teamIndex}`]) {
            careerHistory.push({
              years: fields[`years${teamIndex}`],
              team: fields[`team${teamIndex}`]
            });
            teamIndex++;
          }

          // Parse highlights
          const highlights = fields.highlights ? 
            fields.highlights.split('\n').filter(h => h.trim()) : [];
            
          // Check if this is actually a player and not a team, division, or event
          const isPlayer = this.isActualPlayer(fields, highlights, playerName, careerHistory);
          
          if (!isPlayer) {
            console.log(`⛔ Skipping non-player: ${fields.name || playerName}`);
            return; // Return from the Promise.all callback instead of continue
          }

          // Prepare player data
          const playerDisplayName = fields.name || playerName.replace(/_/g, ' ');
          const isTopPlayer = this.topPlayers.some(name => {
            // Check if player name matches or is contained within full name
            return playerDisplayName === name || 
                   playerDisplayName.includes(name) || 
                   name.includes(playerDisplayName);
          });
          
          const playerRecord = {
            name: playerDisplayName,
            full_name: fields.name || playerName.replace(/_/g, ' '),
            position: fields.position || fields.career_position,
            team: fields.team || fields.current_team || 'Free Agent',
            jersey_number: fields.number || fields.career_number,
            height: fields.height || `${fields.height_ft || ''}${fields.height_in ? ` ft ${fields.height_in} in` : ''}`,
            weight: fields.weight || (fields.weight_lb ? `${fields.weight_lb} lb` : ''),
            birth_date: fields.birth_date,
            birth_place: fields.birth_place,
            high_school: fields.high_school,
            college: fields.college,
            draft_year: fields.draft_year,
            draft_round: fields.draft_round,
            draft_pick: fields.draft_pick,
            career_start: fields.career_start,
            career_end: fields.career_end,
            career_history: careerHistory,
            image_url: playerData.image_url || fields.image || fields.image_url || 
              `https://upload.wikimedia.org/wikipedia/commons/${fields.image}`,
            wikipedia_url: playerData.wikipedia_url,
            highlights: highlights,
            points: isTopPlayer ? 1 : 0, // If its a top player mark points as 1 so we can order by points and show these first
            raw_infobox: fields
          };

          // Upsert player record
          const { data, error } = await this.supabase
            .from('players')
            .upsert(playerRecord, { onConflict: 'name' });

          if (error) {
            console.error(`❌ Error adding ${fields.name || playerDisplayName}:`, error);
          } else {
            console.log(`✅ Added ${fields.name || playerDisplayName}${isTopPlayer ? ' (Top Player)' : ''}`);
          }
        } else {
          console.log(`❌ Failed to extract ${playerName}`);
        }
        }));
      }
      
      console.log('🎉 Supabase database population complete!');
    } catch (error) {
      console.error('❌ Database population failed:', error);
    }
  }
}

// Test with top NBA players
const topPlayers = [
  'LeBron_James',
  'Chris_Bosh',
  'Kobe_Bryant',
  'Michael_Jordan',
  'Magic_Johnson',
  'Larry_Bird',
  'Shaquille_O\'Neal',
  'Tim_Duncan',
  'Kevin_Durant',
  'Stephen_Curry',
  'Giannis_Antetokounmpo',
  'Nikola_Jokic',
  'Kawhi_Leonard',
  'Russell_Westbrook',
  'James_Harden',
  'Dwyane_Wade',
  'Dirk_Nowitzki',
  'Allen_Iverson',
  'Charles_Barkley',
  'Hakeem_Olajuwon',
  'Karl_Malone',
  'John_Stockton',
  'Scottie_Pippen',
  'Kevin_Garnett',
  'Paul_Pierce'
];

// Command line options
const options = {
  '--test': 'Use a small test set of players',
  '--all': 'Fetch and process all NBA players from Wikipedia',
  '--limit=N': 'Limit processing to N players (works with --all)',
  '--help': 'Show this help message'
};

// Usage instructions
console.log(`
🚀 To populate your Supabase database:

1. Set up your Supabase project at https://supabase.com
2. Create a .env file with:
   SUPABASE_URL=your-project-url
   SUPABASE_KEY=your-anon-key

3. Run: node scripts/populate-supabase.js

4. Make sure your Supabase table has this schema:
   - players table with columns matching the schema in supabase/schema.sql
`);

// Export for use
export default SupabasePopulator;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const populator = new SupabasePopulator();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log('\nUsage: node scripts/populate-supabase.js [options]\n');
    console.log('Options:');
    Object.entries(options).forEach(([option, description]) => {
      console.log(`  ${option.padEnd(15)} ${description}`);
    });
    process.exit(0);
  }
  
  // Determine which players to process
  if (args.includes('--all')) {
    // Find if there's a limit argument
    const limitArg = args.find(arg => arg.startsWith('--limit='));
    let limit = 0;
    
    if (limitArg) {
      limit = parseInt(limitArg.split('=')[1]);
      if (isNaN(limit) || limit <= 0) {
        console.error('❌ Invalid limit value. Please provide a positive number.');
        process.exit(1);
      }
    }
    
    // Fetch all players and apply limit if specified
    populator.fetchPlayersFromWikipedia()
      .then(players => {
        const slugs = players.map(p => p.slug);
        const limitedSlugs = limit > 0 ? slugs.slice(0, limit) : slugs;
        console.log(`🏀 Processing ${limitedSlugs.length} players out of ${slugs.length} total`);
        return populator.populateDatabase(limitedSlugs);
      })
      .catch(console.error);
  } else if (args.includes('--test')) {
    // Use test set
    console.log('🧪 Using test set of players');
    populator.populateDatabase(topPlayers).catch(console.error);
  } else {
    // Default: use test set
    console.log('ℹ️ Using default test set. Use --all to process all NBA players or --help for more options.');
    populator.populateDatabase(topPlayers).catch(console.error);
  }
}
