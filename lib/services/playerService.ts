import { createClient } from '../supabase/client';
import { Player } from '../types/Player';

export class PlayerService {
  private supabase;
  
  constructor() {
    this.supabase = createClient();
  }
  
  /**
   * Get all players with basic information
   * @returns Array of players with basic info
   */
  async getAllPlayers(): Promise<Player[]> {
    const { data, error } = await this.supabase
      .from('players')
      .select('id, name, full_name, position, team, image_url')
      .order('name');
    
    if (error) throw error;
    return data as Player[];
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
   * Search players by name
   * @param query Search query string
   * @returns Array of matching players
   */
  async searchPlayers(query: string): Promise<Player[]> {
    const { data, error } = await this.supabase
      .from('players')
      .select('id, name, full_name, position, team, image_url')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(20);
    
    if (error) throw error;
    return data as Player[];
  }
  
  /**
   * Get players by position
   * @param position Player position (e.g., "PG", "C")
   * @returns Array of players with the specified position
   */
  async getPlayersByPosition(position: string): Promise<Player[]> {
    const { data, error } = await this.supabase
      .from('players')
      .select('id, name, full_name, position, team, image_url')
      .eq('position', position)
      .order('name');
    
    if (error) throw error;
    return data as Player[];
  }
}
