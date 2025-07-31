import { createClient } from '../supabase/client';
import { Player } from '../types/Player';

export class PlayerService {
  private supabase;
  
  constructor() {
    this.supabase = createClient();
  }
  
  /**
   * Normalize image URLs to ensure they are valid for Next.js Image component
   * @param players Array of players to normalize image URLs for
   * @returns Array of players with normalized image URLs
   */
  private normalizeImageUrls(players: Player[]): Player[] {
    return players.map(player => {
      if (!player.image_url) return player;
      
      // If URL doesn't start with http://, https://, or /, prepend /
      if (!player.image_url.startsWith('http://') && 
          !player.image_url.startsWith('https://') && 
          !player.image_url.startsWith('/')) {
        player.image_url = `/${player.image_url}`;
      }
      
      return player;
    });
  }

  /**
   * Get all players with basic information
   * @param limit Optional limit on number of players to return
   * @returns Array of players with basic info
   */
  async getAllPlayers(limit?: number): Promise<Player[]> {
    let query = this.supabase
      .from('players')
      .select('id, name, full_name, position, team, image_url, highlights')
      .order('points', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    // Normalize image URLs before returning
    return this.normalizeImageUrls(data as Player[]);
  }
  
  /**
   * Get a player by ID with full details
   * @param id Player UUID
   * @returns Player with all details
   */
  async getPlayerById(id: string): Promise<Player> {
    const { data, error } = await this.supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Player;
  }
  
  /**
   * Search players by name, full name, or team
   * @param query Search query string
   * @param limit Optional limit on number of players to return (defaults to 50)
   * @returns Array of matching players
   */
  async searchPlayers(query: string, limit: number = 50): Promise<Player[]> {
    // Create a more comprehensive search that looks at multiple fields
    const { data, error } = await this.supabase
      .from('players')
      .select('id, name, full_name, position, team, image_url, highlights')
      .or(`name.ilike.%${query}%,full_name.ilike.%${query}%,team.ilike.%${query}%`)
      .order('name')
      .limit(limit);
    
    if (error) throw error;
    // Normalize image URLs before returning
    return this.normalizeImageUrls(data as Player[]);
  }
  
  /**
   * Get players by position
   * @param position Player position (e.g., "PG", "C")
   * @param limit Optional limit on number of players to return
   * @returns Array of players with the specified position
   */
  async getPlayersByPosition(position: string, limit?: number): Promise<Player[]> {
    let query = this.supabase
      .from('players')
      .select('id, name, full_name, position, team, image_url')
      .eq('position', position)
      .order('name');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    // Normalize image URLs before returning
    return this.normalizeImageUrls(data as Player[]);
  }
}
