import { EMAIL_REGEX, MIN_NAME_LENGTH, MAX_NAME_LENGTH, RANKING_TYPES } from './constants';
import { RankingSubmission } from '../types/Ranking';

/**
 * Validates an email address
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates a user's name
 * @param name Name to validate
 * @returns Boolean indicating if name is valid
 */
export const isValidName = (name: string): boolean => {
  return name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH;
};

/**
 * Validates a ranking type
 * @param rankingType Ranking type to validate
 * @returns Boolean indicating if ranking type is valid
 */
export const isValidRankingType = (rankingType: number): boolean => {
  return RANKING_TYPES.includes(rankingType as any);
};

/**
 * Validates a ranking submission
 * @param submission Ranking submission to validate
 * @returns Object with validation result and any errors
 */
export const validateRankingSubmission = (submission: RankingSubmission): { 
  valid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  // Validate email
  if (!submission.email || !isValidEmail(submission.email)) {
    errors.push('Invalid email address');
  }
  
  // Validate name
  if (!submission.name || !isValidName(submission.name)) {
    errors.push(`Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`);
  }
  
  // Validate ranking type
  if (!isValidRankingType(submission.ranking_type)) {
    errors.push('Invalid ranking type. Must be 10, 25, 50, or 100');
  }
  
  // Validate rankings
  if (!submission.rankings || !Array.isArray(submission.rankings)) {
    errors.push('Rankings must be an array');
  } else {
    // Check if rankings length matches ranking type
    if (submission.rankings.length !== submission.ranking_type) {
      errors.push(`Rankings must contain exactly ${submission.ranking_type} players`);
    }
    
    // Check for duplicate players
    const playerIds = new Set<string>();
    submission.rankings.forEach(ranking => {
      if (playerIds.has(ranking.player_id)) {
        errors.push('Rankings contain duplicate players');
      }
      playerIds.add(ranking.player_id);
    });
    
    // Check for valid ranks
    const validRanks = new Set(Array.from({ length: submission.ranking_type }, (_, i) => i + 1));
    const ranks = new Set<number>();
    
    submission.rankings.forEach(ranking => {
      if (!validRanks.has(ranking.rank)) {
        errors.push(`Invalid rank: ${ranking.rank}. Must be between 1 and ${submission.ranking_type}`);
      }
      
      if (ranks.has(ranking.rank)) {
        errors.push(`Duplicate rank: ${ranking.rank}`);
      }
      
      ranks.add(ranking.rank);
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
