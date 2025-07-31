import https from 'https';
import fs from 'fs';

class WikipediaPlayerFetcher {
  constructor() {
    this.baseUrl = 'https://en.wikipedia.org/w/api.php';
    this.players = new Map(); // Using Map to avoid duplicates and store additional data
    this.outputFile = './data/nba-players.json';
  }

  /**
   * Fetch players from a Wikipedia category
   * @param {string} category - Wikipedia category name
   * @param {string} cmcontinue - Continuation token for pagination
   * @returns {Promise<void>}
   */
  async fetchPlayersFromCategory(category, cmcontinue = null) {
    console.log(`📋 Fetching players from category: ${category}${cmcontinue ? ' (continued)' : ''}`);
    
    const params = new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${category}`,
      cmlimit: '500',
      format: 'json',
      formatversion: '2'
    });
    
    if (cmcontinue) {
      params.append('cmcontinue', cmcontinue);
    }
    
    const url = `${this.baseUrl}?${params.toString()}`;
    console.log("URL: ", url);
    
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', async () => {
          try {
            const response = JSON.parse(data);
            const members = response.query?.categorymembers || [];
            
            // Process members
            for (const member of members) {
              // Skip categories and other non-article pages
              if (!member.title.startsWith('Category:') && 
                  !member.title.startsWith('List of') &&
                  !member.title.startsWith('Template:')) {
                const slug = member.title.replace(/ /g, '_');
                this.players.set(slug, {
                  name: member.title,
                  slug: slug,
                  wikipedia_url: `https://en.wikipedia.org/wiki/${slug}`,
                  categories: [category]
                });
              }
            }
            
            console.log(`✅ Found ${members.length} entries, total unique players: ${this.players.size}`);
            
            // Continue if there are more results
            if (response.continue?.cmcontinue) {
              await this.fetchPlayersFromCategory(category, response.continue.cmcontinue);
            }
            
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', reject);
    });
  }
  
  /**
   * Fetch NBA players from a specific list page
   * @param {string} listTitle - Title of the Wikipedia list page
   * @returns {Promise<void>}
   */
  async fetchPlayersFromList(listTitle) {
    console.log(`📋 Fetching players from list: ${listTitle}`);
    
    const params = new URLSearchParams({
      action: 'parse',
      page: listTitle,
      prop: 'links',
      format: 'json',
      formatversion: '2'
    });
    
    const url = `${this.baseUrl}?${params.toString()}`;
    console.log("URL: ", url);
    
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', async () => {
          try {
            const response = JSON.parse(data);
            const links = response.parse?.links || [];
            let playerCount = 0;
            
            for (const link of links) {
              // Skip non-mainspace links and lists/categories
              if (link.ns === 0 && 
                  !link.title.startsWith('List of') && 
                  !link.title.startsWith('Category:') &&
                  !link.title.includes('(disambiguation)')) {
                const slug = link.title.replace(/ /g, '_');
                
                // Check if this looks like a player (contains a person's name)
                if (this.looksLikePlayer(link.title)) {
                  playerCount++;
                  
                  if (this.players.has(slug)) {
                    // Add this list to the player's sources if not already there
                    const player = this.players.get(slug);
                    if (!player.lists) player.lists = [];
                    if (!player.lists.includes(listTitle)) {
                      player.lists.push(listTitle);
                    }
                  } else {
                    this.players.set(slug, {
                      name: link.title,
                      slug: slug,
                      wikipedia_url: `https://en.wikipedia.org/wiki/${slug}`,
                      lists: [listTitle]
                    });
                  }
                }
              }
            }
            
            console.log(`✅ Found ${playerCount} players in list, total unique players: ${this.players.size}`);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', reject);
    });
  }
  
  /**
   * Check if a title looks like it could be a player's name
   * @param {string} title - Wikipedia article title
   * @returns {boolean}
   */
  looksLikePlayer(title) {
    // Most player pages have format: "FirstName LastName" or "FirstName LastName (basketball)"
    return title.includes(' ') && 
           (title.match(/^[A-Z][a-z]+ [A-Z][a-z]+/) || 
            title.match(/^[A-Z][a-z]+ [A-Z][a-z]+ \(basketball\)/) ||
            title.includes('NBA') ||
            title.includes('basketball player'));
  }

  /**
   * Fetch players from multiple sources (categories and lists)
   * @param {Object} sources - Object with categories and lists arrays
   * @returns {Promise<Array>}
   */
  async fetchAllPlayers(sources) {
    console.log('🏀 Starting NBA player fetch from Wikipedia...');
    
    try {
      // Create data directory if it doesn't exist
      if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
      }
      
      // Fetch players from each category
      if (sources.categories && sources.categories.length > 0) {
        for (const category of sources.categories) {
          await this.fetchPlayersFromCategory(category);
        }
      }
      
      // Fetch players from each list
      if (sources.lists && sources.lists.length > 0) {
        for (const list of sources.lists) {
          await this.fetchPlayersFromList(list);
        }
      }
      
      // Convert Map to Array for saving
      const playersArray = Array.from(this.players.values());
      
      // Save to file
      fs.writeFileSync(
        this.outputFile, 
        JSON.stringify(playersArray, null, 2)
      );
      
      console.log(`🎉 Successfully fetched ${playersArray.length} NBA players`);
      console.log(`💾 Saved to ${this.outputFile}`);
      
      return playersArray;
    } catch (error) {
      console.error('❌ Error fetching players:', error);
      throw error;
    }
  }
}

// Sources to fetch players from
const nbaSources = {
  categories: [
    'National_Basketball_Association_players',
    'Current_National_Basketball_Association_players',
    'NBA_All-Stars',
    'Basketball_Hall_of_Fame_inductees',
    'NBA_Most_Valuable_Player_Award_winners',
    'NBA_Finals_MVPs',
    'NBA_Defensive_Players_of_the_Year',
    'NBA_Rookies_of_the_Year',
    'NBA_Most_Valuable_Player_Award_winners'
  ],
  lists: [
    'List_of_NBA_players_(A)',
    'List_of_NBA_players_(B)',
    'List_of_NBA_players_(C)',
    'List_of_NBA_players_(D)',
    'List_of_NBA_players_(E–F)',
    'List_of_NBA_players_(G)',
    'List_of_NBA_players_(H)',
    'List_of_NBA_players_(I–J)',
    'List_of_NBA_players_(K)',
    'List_of_NBA_players_(L)',
    'List_of_NBA_players_(M)',
    'List_of_NBA_players_(N–O)',
    'List_of_NBA_players_(P–Q)',
    'List_of_NBA_players_(R)',
    'List_of_NBA_players_(S)',
    'List_of_NBA_players_(T–V)',
    'List_of_NBA_players_(W–Z)',
    'List_of_current_NBA_team_rosters',
    'List_of_NBA_players_with_most_championships'
  ]
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const fetcher = new WikipediaPlayerFetcher();
  fetcher.fetchAllPlayers(nbaSources).catch(console.error);
}

// Export for use in other scripts
export { WikipediaPlayerFetcher, nbaSources };
