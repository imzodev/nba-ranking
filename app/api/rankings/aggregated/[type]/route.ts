import { NextResponse } from 'next/server';
import { RankingService } from '@/lib/services/rankingService';
import { isValidRankingType } from '@/lib/utils/validation';

/**
 * GET /api/rankings/aggregated/[type]
 * Get aggregated rankings for a specific type
 */
export async function GET(request: Request, { params }: { params: { type: string } }) {
  try {
    const typeStr = params.type;
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
    const rankings = await rankingService.getAggregatedRankings(rankingType as any, date || undefined, limit);
    console.log('rankings count', rankings.length);
    
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
