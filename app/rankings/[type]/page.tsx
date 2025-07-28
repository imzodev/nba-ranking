'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import PlayerCard from '@/components/player/PlayerCard';
import { RANKING_TYPE_LABELS, RANKING_TYPES } from '@/lib/utils/constants';
import type { Player } from '@/lib/types/Player';
import type { AggregatedRanking } from '@/lib/types/Ranking';

export default function RankingsPage() {
  const params = useParams();
  const rankingType = Number(params.type) || 25 as const; // Default to 25 if not specified
  
  const [rankings, setRankings] = useState<AggregatedRanking[]>([]);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch all players first to have their data
        const playersResponse = await fetch('/api/players');
        if (!playersResponse.ok) {
          throw new Error('Failed to fetch players');
        }
        
        const playersData = await playersResponse.json();
        const playersMap: Record<string, Player> = {};
        playersData.forEach((player: Player) => {
          playersMap[player.id] = player;
        });
        
        setPlayers(playersMap);
        
        // Fetch aggregated rankings
        const rankingsResponse = await fetch(`/api/rankings/aggregated/${rankingType}`);
        if (!rankingsResponse.ok) {
          throw new Error('Failed to fetch rankings');
        }
        
        const rankingsData = await rankingsResponse.json();
        setRankings(rankingsData.rankings || []);
        
        // Format the last updated date
        if (rankingsData.lastUpdated) {
          const date = new Date(rankingsData.lastUpdated);
          setLastUpdated(date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load rankings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRankings();
  }, [rankingType]);
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-[#17408B] dark:text-[#FDBB30]">NBA</span> Ultimate {RANKING_TYPES.includes(rankingType) ? RANKING_TYPE_LABELS[rankingType as keyof typeof RANKING_TYPE_LABELS] : `Top ${rankingType}`}
          </h1>
          
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17408B] dark:border-[#FDBB30]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-700 dark:text-yellow-300">
              No rankings available yet. Be the first to submit your ranking!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rankings.map((ranking) => {
              const player = players[ranking.player_id];
              if (!player) return null;
              
              return (
                <div key={ranking.player_id} className="relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#17408B] dark:bg-[#FDBB30] text-white dark:text-[#17408B] flex items-center justify-center font-bold shadow-lg z-10 border-2 border-white dark:border-gray-800">
                    {ranking.rank}
                  </div>
                  <PlayerCard
                    player={player}
                    rank={ranking.rank}
                    points={ranking.points}
                    showDetails={true}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
