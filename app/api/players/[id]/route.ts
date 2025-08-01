import { NextResponse } from 'next/server';
import { PlayerService } from '@/lib/services/playerService';

/**
 * GET /api/players/[id]
 * Returns detailed information for a specific player
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playerId } = await params;
    
    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }
    
    const playerService = new PlayerService();
    const player = await playerService.getPlayerById(playerId);
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ player });
  } catch (error: unknown) {
    console.error('Error fetching player details:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch player details', details: errorMessage },
      { status: 500 }
    );
  }
}
