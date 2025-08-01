import { createClient } from '../supabase/admin';

/**
 * Service for aggregating user rankings into ultimate rankings
 */
export class AggregationService {
  private supabase;
  
  constructor() {
    this.supabase = createClient();
  }
  
  /**
   * Calculate aggregated rankings for a specific ranking type
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @returns Success status
   */
  public async calculateAggregatedRankings(rankingType: number): Promise<{ success: boolean, error?: string }> {
    try {
      // Validate ranking type
      if (![10, 25, 50, 100].includes(rankingType)) {
        return { success: false, error: 'Invalid ranking type' };
      }
      
      // Get all user rankings for this type
      const { data: rankings, error: rankingsError } = await this.supabase
        .from('user_rankings')
        .select('player_id, rank')
        .eq('ranking_type', rankingType);
      
      if (rankingsError) {
        return { success: false, error: rankingsError.message || 'Database error occurred' };
      }
      
      if (!rankings || rankings.length === 0) {
        return { success: false, error: 'No rankings found for this type' };
      }
      
      // Calculate points, average rank, and appearances
      const playerStats = this.calculatePlayerStats(rankings, rankingType);
      
      // Sort by points (descending)
      const sortedPlayers = Object.entries(playerStats)
        .sort(([, a], [, b]) => b.points - a.points)
        .slice(0, rankingType); // Only take top N
      
      // Prepare data for insertion
      const today = new Date().toISOString().split('T')[0];
      const aggregatedRankings = sortedPlayers.map(([playerId, stats], index) => ({
        player_id: playerId,
        rank: index + 1,
        ranking_type: rankingType,
        points: stats.points,
        average_rank: stats.averageRank,
        appearances: stats.appearances,
        calculation_date: today
      }));
      
      // Delete existing rankings for today
      await this.supabase
        .from('aggregated_rankings')
        .delete()
        .eq('calculation_date', today)
        .eq('ranking_type', rankingType);
      
      // Insert new rankings
      const { error: insertError } = await this.supabase
        .from('aggregated_rankings')
        .insert(aggregatedRankings);
      
      if (insertError) {
        return { success: false, error: insertError.toString() || 'Database error occurred' };
      }
      
      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }
  
  /**
   * Calculate player statistics from user rankings
   * @param rankings Array of user rankings
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @returns Object with player statistics
   */
  private calculatePlayerStats(rankings: {player_id: string, rank: number}[], rankingType: number) {
    const playerStats: {
      [key: string]: {
        totalRank: number;
        appearances: number;
        points: number;
        averageRank: number;
      }
    } = {};
    
    rankings.forEach(ranking => {
      const { player_id, rank } = ranking;
      
      if (!playerStats[player_id]) {
        playerStats[player_id] = {
          totalRank: 0,
          appearances: 0,
          points: 0,
          averageRank: 0
        };
      }
      
      playerStats[player_id].totalRank += rank;
      playerStats[player_id].appearances += 1;
      
      // Points calculation based on ranking position
      // For example, in a top 25 list:
      // #1 gets 25 points, #2 gets 24 points, etc.
      playerStats[player_id].points += (rankingType + 1 - rank);
    });
    
    // Calculate average rank
    Object.keys(playerStats).forEach(playerId => {
      const stats = playerStats[playerId];
      stats.averageRank = stats.totalRank / stats.appearances;
    });
    
    return playerStats;
  }
  
  /**
   * Run daily aggregation for all ranking types
   * This method should be called by a scheduled job
   */
  async runDailyAggregation(): Promise<{ success: boolean, error?: string }> {
    try {
      const rankingTypes = [10, 25, 50, 100];
      
      for (const rankingType of rankingTypes) {
        const result = await this.calculateAggregatedRankings(rankingType);
        
        if (!result.success) {
          console.error(`Failed to aggregate rankings for type ${rankingType}:`, result.error);
        }
      }
      
      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
  }
}
