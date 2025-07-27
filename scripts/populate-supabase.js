import { WorkingWikipediaExtractor } from './working-wikipedia-extraction.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

class SupabasePopulator {
  constructor() {
    this.extractor = new WorkingWikipediaExtractor();
    
    // Use environment variables for Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    // Initialize Supabase client with anon key (RLS policies will handle permissions)
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async populateDatabase(players) {
    console.log('🚀 Starting Supabase database population...');
    
    try {
      for (const playerName of players) {
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

          // Prepare player data
          const playerRecord = {
            name: fields.name || playerName.replace(/_/g, ' '),
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
            raw_infobox: fields
          };

          // Upsert player record
          const { data, error } = await this.supabase
            .from('players')
            .upsert(playerRecord, { onConflict: 'name' });

          if (error) {
            console.error(`❌ Error adding ${fields.name || playerName}:`, error);
          } else {
            console.log(`✅ Added ${fields.name || playerName}`);
          }
        } else {
          console.log(`❌ Failed to extract ${playerName}`);
        }
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
  populator.populateDatabase(topPlayers).catch(console.error);
}
