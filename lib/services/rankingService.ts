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
    
    // Insert a single row with rankings JSON
    const rowToInsert = {
      user_id: user.id,
      ranking_type: rankingType,
      rankings: rankings,
      submission_date: today,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error: rankingsError } = await this.supabase
      .from('user_rankings')
      .insert([rowToInsert]);
    
    if (rankingsError) {
      return { success: false, error: rankingsError };
    }

    // Update aggregated rankings
    await this.upsertAggregatedRankings(rankings, rankingType, today);

    return { success: true, error: null };
  }

  /**
   * Upsert aggregated rankings for a submission
   * @param rankings Array of player rankings
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @param calculationDate Date string (YYYY-MM-DD)
   */
  async upsertAggregatedRankings(
    rankings: Array<{playerId: string, rank: number}>,
    rankingType: number,
    calculationDate: string
  ): Promise<void> {
    for (const { playerId, rank } of rankings) {
      const points = rankingType + 1 - rank;
      // Try to update existing row
      const { data, error } = await this.supabase
        .from('aggregated_rankings')
        .select('id, points, appearances, average_rank')
        .eq('player_id', playerId)
        .eq('ranking_type', rankingType)
        .eq('calculation_date', calculationDate)
        .maybeSingle();
      if (error) {
        console.error(`[upsertAggregatedRankings] Error selecting row for playerId ${playerId}:`, error);
        continue;
      }
      if (data) {
        // Row exists: update it
        const newPoints = data.points + points;
        const newAppearances = data.appearances + 1;
        const newAvg = ((data.average_rank * data.appearances) + rank) / newAppearances;
        const { error: updateError } = await this.supabase
          .from('aggregated_rankings')
          .update({
            points: newPoints,
            appearances: newAppearances,
            average_rank: newAvg,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id);
        if (updateError) {
          console.error(`[upsertAggregatedRankings] Error updating row for playerId ${playerId}:`, updateError);
        }
      } else {
        // Row does not exist: insert
        const insertObj = {
          player_id: playerId,
          ranking_type: rankingType,
          calculation_date: calculationDate,
          points,
          appearances: 1,
          average_rank: rank,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { error: insertError } = await this.supabase
          .from('aggregated_rankings')
          .insert(insertObj);
        if (insertError) {
          console.error(`[upsertAggregatedRankings] Error inserting row for playerId ${playerId}:`, insertError, insertObj);
        }
      }
    }
  }

  /**
   * Get a user's rankings for a specific type
   * @param email User's email
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @returns Array of user rankings with player details
   */
  async getUserRankings(email: string, rankingType: number): Promise<{ playerId: string, rank: number }[]> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) return [];
    const { data, error } = await this.supabase
      .from('user_rankings')
      .select('rankings')
      .eq('user_id', user.id)
      .eq('ranking_type', rankingType)
      .order('submission_date', { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return [];
    return data.rankings || [];
  }
  
  /**
   * Get the latest user rankings by date
   * @param email User's email
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @returns Array of user rankings with player details
   */
  async getLatestUserRankings(email: string, rankingType: number): Promise<{ playerId: string, rank: number }[]> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) return [];
    const { data, error } = await this.supabase
      .from('user_rankings')
      .select('rankings')
      .eq('user_id', user.id)
      .eq('ranking_type', rankingType)
      .order('submission_date', { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return [];
    return data.rankings || [];
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
      .order('points', { ascending: false })
    .order('average_rank', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
}
