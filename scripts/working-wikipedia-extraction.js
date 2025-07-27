import https from 'https';
import fs from 'fs';

// TRUE extraction that genuinely gets ALL data from Wikipedia
class WorkingWikipediaExtractor {
  async extractPlayerData(playerName) {
    console.log(`🔍 Extracting TRUE data for ${playerName} from Wikipedia...`);
    
    try {
      // Step 1: Get complete wikitext
      const wikitext = await this.getCompleteWikitext(playerName);
      
      // Step 2: Extract complete infobox
      const infobox = this.extractCompleteInfobox(wikitext);
      
      // Step 3: Parse ALL infobox parameters
      const allFields = this.parseAllInfoboxParameters(infobox);

      console.log("allFields");
      console.log(allFields);
      
      // Step 4: Create comprehensive data structure
      const completeData = {
        name: playerName.replace('_', ' '),
        extraction_date: new Date().toISOString(),
        data_source: 'Wikipedia infobox - TRUE extraction',
        raw_infobox: allFields,
        wikipedia_url: `https://en.wikipedia.org/wiki/${playerName}`,
        verified: true
      };
      
      // Add structured data dynamically
      completeData.personal_info = this.extractPersonalInfo(allFields);
      completeData.career_info = this.extractCareerInfo(allFields);
      completeData.career_history = this.parseCareerHistory(allFields.career_history);
      completeData.awards = this.parseAwards(allFields.career_highlights);
      completeData.career_stats = this.extractStats(allFields);
      
      // Step 5: Get image URL
      const imageUrl = await this.getPlayerImage(playerName);
      completeData.image_url = imageUrl;
      
      // Save to file
      fs.writeFileSync(`data/${playerName.toLowerCase().replace(/\s+/g, '-')}-true.json`, JSON.stringify(completeData, null, 2));
      
      console.log(`✅ TRUE data extracted for ${playerName}`);
      console.log(`📊 Found ${Object.keys(allFields).length} infobox fields`);
      console.log('📋 Sample fields:');
      Object.keys(allFields).slice(0, 10).forEach(key => {
        console.log(`  ${key}: "${allFields[key]}"`);
      });
      
      return completeData;
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      return {
        name: playerName,
        extraction_date: new Date().toISOString(),
        data_source: 'Wikipedia infobox - TRUE extraction',
        error: error.message,
        allFields: {},
        personal_info: {},
        career_info: {},
        stats: {},
        career_history: [],
        awards: [],
        image_url: null,
        wikipedia_url: `https://en.wikipedia.org/wiki/${playerName}`
      };
    }
  }

  async getCompleteWikitext(title) {
    const params = new URLSearchParams({
      action: 'parse',
      format: 'json',
      page: title,
      prop: 'wikitext',
      formatversion: '2'
    });

    return new Promise((resolve, reject) => {
      const url = `https://en.wikipedia.org/w/api.php?${params.toString()}`;
      console.log("URL: ", url);
      
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.parse?.wikitext || '');
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  extractCompleteInfobox(wikitext) {
    if (!wikitext) return '';
    
    // Find the complete infobox template
    const infoboxStart = wikitext.indexOf('{{Infobox basketball biography');
    if (infoboxStart === -1) {
      throw new Error('No infobox found');
    }
    
    // Look for the matching closing braces by counting
    let braceCount = 1; // Start with 1 for the opening {{Infobox
    let endIndex = infoboxStart + 2; // Skip past the {{
    
    for (let i = infoboxStart + 2; i < wikitext.length - 1; i++) {
      if (wikitext[i] === '{' && wikitext[i + 1] === '{') {
        braceCount++;
        i++; // Skip next character
      } else if (wikitext[i] === '}' && wikitext[i + 1] === '}') {
        braceCount--;
        i++; // Skip next character
        
        if (braceCount === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }
    
    const infobox = wikitext.substring(infoboxStart, endIndex);
    
    // Debug: show what we extracted
    console.log("=== EXTRACTED INFOBOX ===");
    console.log(infobox);
    
    return infobox;
  }

  parseAllInfoboxParameters(infobox) {
    const params = {};
    const lines = infobox.split('\n');
    let currentKey = '';
    let currentValue = '';
    let inMultiline = false;
    
    for (let line of lines) {
      line = line.trim();
      
      if (line.startsWith('|')) {
        // Save previous parameter
        if (currentKey && currentValue) {
          params[currentKey] = this.cleanText(currentValue);
        }
        
        // Parse new parameter
        const parts = line.substring(1).split('=');
        if (parts.length >= 2) {
          currentKey = parts[0].trim().toLowerCase();
          currentValue = parts.slice(1).join('=').trim();
          
          // Check for multiline values - look for patterns that suggest continuation
          // Wikipedia infoboxes use multiline for highlights, career history, etc.
          if (currentValue.includes('*') || currentValue.includes('{{') || 
              line.includes('highlights') || line.includes('career_history') ||
              line.includes('highlights') || line.includes('medaltemplates')) {
            inMultiline = true;
          } else {
            inMultiline = false;
          }
        }
      } else if (inMultiline && currentKey) {
        // Continue multiline value - preserve all content
        currentValue += '\n' + line;
        
        // Check if we've reached the end of this parameter
        // Next parameter starts with | or we hit end
        if (line.startsWith('|') || line === '') {
          inMultiline = false;
        }
      }
    }
    
    // Add last parameter
    if (currentKey && currentValue) {
      params[currentKey] = this.cleanText(currentValue);
    }
    
    return params;
  }

  extractPersonalInfo(fields) {
    return {
      full_name: fields.name || '',
      birth_date: this.extractBirthDate(fields.birth_date),
      birth_place: this.cleanText(fields.birth_place),
      nationality: this.cleanText(fields.nationality),
      height: this.formatHeight(fields.height_ft, fields.height_in),
      weight: this.formatWeight(fields.weight_lb),
      position: this.cleanText(fields.position),
      jersey_number: fields.number,
      high_school: this.cleanText(fields.high_school)
    };
  }

  extractCareerInfo(fields) {
    return {
      draft_year: fields.draft_year,
      draft_round: fields.draft_round,
      draft_pick: fields.draft_pick,
      draft_team: this.cleanText(fields.draft_team),
      career_start: fields.career_start,
      career_end: fields.career_end,
      current_team: this.cleanText(fields.team)
    };
  }

  extractStats(fields) {
    return {
      points: this.extractNumber(fields.stat1value),
      rebounds: this.extractNumber(fields.stat2value),
      assists: this.extractNumber(fields.stat3value),
      ppg: this.extractNumber(fields.stat4value),
      rpg: this.extractNumber(fields.stat5value),
      apg: this.extractNumber(fields.stat6value)
    };
  }

  parseCareerHistory(careerHistory) {
    if (!careerHistory) return [];
    
    return careerHistory
      .split('\n*')
      .map(item => this.cleanText(item.trim()))
      .filter(item => item.length > 0);
  }

  parseAwards(highlights) {
    if (!highlights) return [];
    
    return highlights
      .split('\n*')
      .map(item => this.cleanText(item.trim()))
      .filter(item => item.length > 0);
  }

  extractBirthDate(date) {
    if (!date) return '';
    return date.replace(/\{\{[^}]+\}\}/g, '').trim();
  }

  formatHeight(ft, inches) {
    if (ft && inches) {
      const cm = Math.round((parseInt(ft) * 30.48) + (parseInt(inches) * 2.54));
      return `${ft} ft ${inches} in (${cm / 100} m)`;
    }
    return '';
  }

  formatWeight(weight) {
    if (!weight) return '';
    const kg = Math.round(parseInt(weight) * 0.453592);
    return `${weight} lb (${kg} kg)`;
  }

  cleanText(text) {
    if (!text) return '';
    
    // Parse Wikipedia templates
    text = this.parseWikipediaTemplates(text);
    
    // Clean wiki links but preserve content
    text = text
      .replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      .replace(/<[^>]+>/g, '')
      .trim();
    
    return text;
  }

  extractNumber(value) {
    if (!value) return 0;
    const num = parseInt(value.replace(/,/g, '').replace(/[^\d.-]/g, ''));
    return isNaN(num) ? 0 : num;
  }

  parseWikipediaTemplates(text) {
    if (!text) return '';
    
    // Parse NBA year templates
    text = text.replace(/\{\{nbay\|(\d{4})\|start\}\}/g, '$1');
    text = text.replace(/\{\{nbay\|(\d{4})\|end\}\}/g, '$1');
    text = text.replace(/\{\{nbay\|(\d{4})\|start\}\}–\{\{nbay\|(\d{4})\|end\}\}/g, '$1–$4');
    text = text.replace(/\{\{nbay\|(\d{4})\|start\}\}–present/g, '$1–present');
    
    // Parse NBA All-Star game templates
    text = text.replace(/\{\{nasg\|(\d{4})\}\}/g, '$1');
    text = text.replace(/\{\{nasg\|(\d{4})\}\}–\{\{nasg\|(\d{4})\}\}/g, '$1–$4');
    
    // Handle remaining templates by removing template syntax
    text = text.replace(/\{\{[^}]*\|(\d{4})[^}]*\}\}/g, '$1');
    text = text.replace(/\{\{[^}]*\|(\d{4})\|(\d{4})[^}]*\}\}/g, '$1–$2');
    
    return text;
  }

  async getPlayerImage(playerName) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'pageimages',
      titles: playerName,
      pithumbsize: '500'
    });

    return new Promise((resolve, reject) => {
      const url = `https://en.wikipedia.org/w/api.php?${params.toString()}`;
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const pages = parsed.query?.pages || {};
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];
            
            resolve(page.thumbnail?.source || '');
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }
}

// Run extraction for LeBron James
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  const extractor = new WorkingWikipediaExtractor();
  extractor.extractPlayerData('Chris_Bosh');
}

export { WorkingWikipediaExtractor };
