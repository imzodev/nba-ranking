import { NextResponse } from 'next/server';
import { PlayerService } from '@/lib/services/playerService';

/**
 * GET /api/players
 * Returns a list of all players with basic information
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const position = searchParams.get('position');
    
    const playerService = new PlayerService();
    
    let players;
    
    if (query) {
      // Search players by name
      players = await playerService.searchPlayers(query);
    } else if (position) {
      // Filter players by position
      players = await playerService.getPlayersByPosition(position);
    } else {
      // Get all players
      players = await playerService.getAllPlayers();
    }
    
    return NextResponse.json({ players });
  } catch (error: any) {
    console.error('Error fetching players:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch players', details: error.message },
      { status: 500 }
    );
  }
}
