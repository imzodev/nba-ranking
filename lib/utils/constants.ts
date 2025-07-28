/**
 * Constants used throughout the application
 */

export const RANKING_TYPES = [10, 25, 50, 100] as const;
export type RankingType = typeof RANKING_TYPES[number];

export const RANKING_TYPE_LABELS: Record<RankingType, string> = {
  10: 'Top 10',
  25: 'Top 25',
  50: 'Top 50',
  100: 'Top 100'
};

export const DEFAULT_RANKING_TYPE: RankingType = 25;

// Number of days to keep user submissions
export const USER_SUBMISSION_RETENTION_DAYS = 90;

// Maximum number of submissions per user per day
export const MAX_SUBMISSIONS_PER_DAY = 1;

// Validation constants
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 50;
