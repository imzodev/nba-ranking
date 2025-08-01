import { NextResponse } from 'next/server';
import { AggregationService } from '@/lib/services/aggregationService';
import { isValidRankingType } from '@/lib/utils/validation';

/**
 * POST /api/rankings/aggregate
 * Trigger aggregation calculation for a specific ranking type or all types
 * This endpoint should be protected in production and only called by authorized services
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rankingType } = body;
    
    const aggregationService = new AggregationService();
    
    // If ranking type is provided, calculate for that type only
    if (rankingType) {
      if (!isValidRankingType(rankingType)) {
        return NextResponse.json(
          { error: 'Invalid ranking type. Must be 10, 25, 50, or 100' },
          { status: 400 }
        );
      }
      
      const result = await aggregationService.calculateAggregatedRankings(rankingType);
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to calculate aggregated rankings', details: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ success: true, rankingType });
    } 
    // Otherwise, run daily aggregation for all types
    else {
      const result = await aggregationService.runDailyAggregation();
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to run daily aggregation', details: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ success: true, message: 'Daily aggregation completed successfully' });
    }
  } catch (error: unknown) {
    console.error('Error calculating aggregated rankings:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to calculate aggregated rankings', details: errorMessage },
      { status: 500 }
    );
  }
}
