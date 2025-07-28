import { NextResponse } from 'next/server';
import { RankingService } from '@/lib/services/rankingService';
import { isValidEmail } from '@/lib/utils/validation';

/**
 * GET /api/rankings/user
 * Get a user's rankings
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const rankingType = parseInt(searchParams.get('type') || '25');
    const latest = searchParams.get('latest') === 'true';
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    const rankingService = new RankingService();
    
    let rankings;
    if (latest) {
      rankings = await rankingService.getLatestUserRankings(email, rankingType);
    } else {
      rankings = await rankingService.getUserRankings(email, rankingType);
    }
    
    return NextResponse.json({ rankings });
  } catch (error: any) {
    console.error('Error fetching user rankings:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch user rankings', details: error.message },
      { status: 500 }
    );
  }
}
