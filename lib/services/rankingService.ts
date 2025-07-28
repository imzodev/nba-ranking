import { createClient } from '../supabase/client';
import { UserService } from './userService';
import { UserRanking, RankingSubmission } from '../types/Ranking';

export class RankingService {
  private supabase;
  private userService;
  
  constructor() {
    this.supabase = createClient();
    this.userService = new UserService();
  }
  
  /**
   * Submit a new ranking list
   * @param email User's email
   * @param name User's name
   * @param ipAddress User's IP address
   * @param rankings Array of player rankings
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @returns Success status and any error
   */
  async submitRankings(
    email: string, 
    name: string, 
    ipAddress: string, 
    rankings: Array<{playerId: string, rank: number}>, 
    rankingType: number
  ): Promise<{ success: boolean, error: any }> {
    // Validate ranking type
    if (![10, 25, 50, 100].includes(rankingType)) {
      return { 
        success: false, 
        error: { message: 'Invalid ranking type. Must be 10, 25, 50, or 100.' } 
      };
    }
    
    // Validate rankings length
    if (rankings.length !== rankingType) {
      return { 
        success: false, 
        error: { message: `Ranking must contain exactly ${rankingType} players.` } 
      };
    }
    
    // Create or update user
    const { data: user, error: userError } = await this.userService.createOrUpdateUser(email, name, ipAddress);
    
    if (userError || !user) {
      return { success: false, error: userError };
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user has already submitted this ranking type today
    const hasSubmitted = await this.userService.hasSubmittedToday(email, rankingType);
    
    if (hasSubmitted) {
      // Delete previous submission for today
      await this.supabase
        .from('user_rankings')
        .delete()
        .eq('user_id', user.id)
        .eq('ranking_type', rankingType)
        .eq('submission_date', today);
    }
    
    // Insert rankings
    const rankingsToInsert = rankings.map(r => ({
      user_id: user.id,
      player_id: r.playerId,
      rank: r.rank,
      ranking_type: rankingType,
      submission_date: today
    }));
    
    const { error: rankingsError } = await this.supabase
      .from('user_rankings')
      .insert(rankingsToInsert);
    
    if (rankingsError) {
      return { success: false, error: rankingsError };
    }
    
    return { success: true, error: null };
  }
  
  /**
   * Get a user's rankings for a specific type
   * @param email User's email
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @returns Array of user rankings with player details
   */
  async getUserRankings(email: string, rankingType: number): Promise<UserRanking[]> {
    const user = await this.userService.getUserByEmail(email);
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await this.supabase
      .from('user_rankings')
      .select(`
        *,
        players:player_id (
          id, name, full_name, position, team, image_url
        )
      `)
      .eq('user_id', user.id)
      .eq('ranking_type', rankingType)
      .order('rank', { ascending: true });
    
    if (error) throw error;
    return data as unknown as UserRanking[];
  }
  
  /**
   * Get the latest user rankings by date
   * @param email User's email
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @returns Array of user rankings with player details
   */
  async getLatestUserRankings(email: string, rankingType: number): Promise<UserRanking[]> {
    const user = await this.userService.getUserByEmail(email);
    
    if (!user) {
      return [];
    }
    
    // Get the latest submission date
    const { data: latestData, error: latestError } = await this.supabase
      .from('user_rankings')
      .select('submission_date')
      .eq('user_id', user.id)
      .eq('ranking_type', rankingType)
      .order('submission_date', { ascending: false })
      .limit(1)
      .single();
    
    if (latestError || !latestData) {
      return [];
    }
    
    // Get rankings for that date
    const { data, error } = await this.supabase
      .from('user_rankings')
      .select(`
        *,
        players:player_id (
          id, name, full_name, position, team, image_url
        )
      `)
      .eq('user_id', user.id)
      .eq('ranking_type', rankingType)
      .eq('submission_date', latestData.submission_date)
      .order('rank', { ascending: true });
    
    if (error) throw error;
    return data as unknown as UserRanking[];
  }
  
  /**
   * Get aggregated rankings for a specific type and date
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @param date Optional date string (YYYY-MM-DD), defaults to today
   * @returns Array of aggregated rankings with player details
   */
  async getAggregatedRankings(rankingType: number, date?: string): Promise<any[]> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const { data, error } = await this.supabase
      .from('aggregated_rankings')
      .select(`
        *,
        players:player_id (
          id, name, full_name, position, team, image_url, ppg, rpg, apg, championships, mvps, all_star
        )
      `)
      .eq('ranking_type', rankingType)
      .eq('calculation_date', targetDate)
      .order('rank', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}
