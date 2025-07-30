import { NextResponse } from 'next/server';
import { RankingService } from '@/lib/services/rankingService';
import { validateRankingSubmission } from '@/lib/utils/validation';
import { RankingSubmission } from '@/lib/types/Ranking';
import { headers } from 'next/headers';

/**
 * POST /api/rankings
 * Submit a new ranking list
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const submission = body as RankingSubmission;
    
    // Validate submission
    const { valid, errors } = validateRankingSubmission(submission);
    
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid submission', details: errors },
        { status: 400 }
      );
    }
    
    // Get IP address from headers
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    // Submit rankings
    const rankingService = new RankingService();
    const { success, error } = await rankingService.submitRankings(
      submission.email,
      submission.name,
      ipAddress,
      submission.rankings,
      submission.ranking_type
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit rankings', details: error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error submitting rankings:', error);
    
    return NextResponse.json(
      { error: 'Failed to submit rankings', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/rankings
 * Get aggregated rankings
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rankingType = parseInt(searchParams.get('type') || '25');
    const date = searchParams.get('date');
    
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
