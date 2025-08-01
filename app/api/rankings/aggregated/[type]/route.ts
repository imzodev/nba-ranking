import { NextResponse } from 'next/server';
import { RankingService } from '@/lib/services/rankingService';
import { isValidRankingType } from '@/lib/utils/validation';
import { RankingType } from '@/lib/utils/constants';

/**
 * GET /api/rankings/aggregated/[type]
 * Get aggregated rankings for a specific type
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type: typeStr } = await params;
    const rankingType = parseInt(typeStr);
    
    const url = new URL(request.url);
    const { searchParams } = url;
    const date = searchParams.get('date');
    
    if (!isValidRankingType(rankingType)) {
      return NextResponse.json(
        { error: 'Invalid ranking type. Must be 10, 25, 50, or 100' },
        { status: 400 }
      );
    }
    
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : undefined;
    const rankingService = new RankingService();
    const rankings = await rankingService.getAggregatedRankings(rankingType as RankingType, date || undefined, limit);
    
    return NextResponse.json({ rankings });
  } catch (error: unknown) {
    console.error('Error fetching aggregated rankings:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch aggregated rankings', details: errorMessage },
      { status: 500 }
    );
  }
}
