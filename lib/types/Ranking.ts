import { Player } from './Player';
import { User } from './User';
import { RankingType } from '../utils/constants';

export interface UserRanking {
  id: string;
  user_id: string;
  player_id: string;
  ranking_type: RankingType;
  rank: number;
  submission_date: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  players?: Player;
  user?: User;
}

export interface RankingSubmission {
  email: string;
  name: string;
  rankings: Array<{
    playerId: string;
    rank: number;
  }>;
  ranking_type: RankingType; // 10, 25, 50, or 100
}

export interface AggregatedRanking {
  player_id: string;
  rank: number;
  points: number;
  ranking_type: RankingType;
  aggregation_date: string;
  calculation_date?: string;
  player?: Player; // Single player object from join
}
