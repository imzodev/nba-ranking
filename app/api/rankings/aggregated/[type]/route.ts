import { NextResponse } from 'next/server';
import { RankingService } from '@/lib/services/rankingService';
import { isValidRankingType } from '@/lib/utils/validation';

/**
 * GET /api/rankings/aggregated/[type]
 * Get aggregated rankings for a specific type
 */
export async function GET(
  request: Request,
  context: { params: { type: string } }
) {
  const { params } = context;
  try {
    const rankingType = parseInt(params.type);
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!isValidRankingType(rankingType)) {
      return NextResponse.json(
        { error: 'Invalid ranking type. Must be 10, 25, 50, or 100' },
        { status: 400 }
      );
    }
    
    const rankingService = new RankingService();
    const rankings = await rankingService.getAggregatedRankings(rankingType, date || undefined);
    
    return NextResponse.json({ rankings });
  } catch (error: any) {
    console.error('Error fetching aggregated rankings:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch aggregated rankings', details: error.message },
      { status: 500 }
    );
  }
}
