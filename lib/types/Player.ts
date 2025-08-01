export interface Player {
  [key: string]: unknown;
  id: string; // Explicitly define id as string for compatibility with @dnd-kit
  name: string;
  full_name?: string;
  position?: string;
  team?: string;
  jersey_number?: string;
  height?: string;
  weight?: string;
  birth_date?: string;
  birth_place?: string;
  nationality?: string;
  high_school?: string;
  college?: string;
  
  // Draft info
  draft_year?: string;
  draft_round?: string;
  draft_pick?: string;
  draft_team?: string;
  
  // Career timeline
  career_start?: string;
  career_end?: string;
  years_active?: string;
  career_history?: string[];
  
  // Career stats
  points?: number;
  rebounds?: number;
  assists?: number;
  ppg?: number;
  rpg?: number;
  apg?: number;
  
  // Accolades
  championships?: number;
  mvps?: number;
  finals_mvps?: number;
  all_star?: number;
  all_nba?: number;
  all_defensive?: number;
  rookie_of_year?: boolean;
  hall_of_fame?: boolean;
  social_media?: Record<string, string>;
  
  // Awards and highlights
  highlights?: string[];
  awards?: string[];
  
  // Images and media
  image_url?: string;
  wikipedia_url?: string;
  
  // Raw data for reference
  raw_infobox?: Record<string, unknown>;
  
  created_at?: string;
  updated_at?: string;
}
