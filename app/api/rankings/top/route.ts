import { NextResponse } from 'next/server';
import { RankingService } from '@/lib/services/rankingService';
import { RankingType } from '@/lib/utils/constants';

// Cache duration in seconds (24 hours)
const CACHE_DURATION = 60 * 60 * 24;

/**
 * GET /api/rankings/top
 * Get cached top 10 players
 */
export async function GET() {
  try {
    const rankingService = new RankingService();
    const rankings = await rankingService.getAggregatedRankings(10 as RankingType, undefined, 10);
    
    // Return response with cache headers
    return NextResponse.json(
      { rankings },
      {
        headers: {
          // Cache for 24 hours on CDN and in browser
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        },
      }
    );
  } catch (error: unknown) {
    console.error('Error fetching top players:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch top players', details: errorMessage },
      { status: 500 }
    );
  }
}
