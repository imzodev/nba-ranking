import { NextResponse } from 'next/server';
import { PlayerService } from '@/lib/services/playerService';

/**
 * GET /api/players
 * Returns a list of all players with basic information
 * Supports query parameters:
 * - query: Search players by name
 * - position: Filter players by position
 * - limit: Limit the number of players returned
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const position = searchParams.get('position');
    const limitParam = searchParams.get('limit');
    
    // Parse limit parameter, default to all players if not provided
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    const playerService = new PlayerService();
    
    let players;
    
    if (query) {
      // Search players by name
      players = await playerService.searchPlayers(query, limit);
    } else if (position) {
      // Filter players by position
      players = await playerService.getPlayersByPosition(position, limit);
    } else {
      // Get all players
      players = await playerService.getAllPlayers(limit);
    }

    console.log(players);
    
    // Return the players array directly
    return NextResponse.json(players);
  } catch (error: any) {
    console.error('Error fetching players:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch players', details: error.message },
      { status: 500 }
    );
  }
}
