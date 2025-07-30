'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Image from 'next/image';
import { RANKING_TYPE_LABELS, RANKING_TYPES, type RankingType } from '@/lib/utils/constants';

function isRankingType(val: number): val is RankingType {
  return RANKING_TYPES.includes(val as RankingType);
}
import type { Player } from '@/lib/types/Player';
import type { AggregatedRanking } from '@/lib/types/Ranking';

export default function RankingsPage() {
  const params = useParams();
  let rankingType: RankingType = 25;
  const parsedType = Number(params.type);
  if (isRankingType(parsedType)) {
    rankingType = parsedType;
  }
  
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
        
        const playersData = await playersResponse.json() as Player[];
        const playersMap: Record<string, Player> = {};
        playersData.forEach((player: Player) => {
          playersMap[player.id] = player;
        });
        
        setPlayers(playersMap);
        
        // Fetch aggregated rankings
        const rankingsResponse = await fetch(`/api/rankings/aggregated/${Number(rankingType)}?limit=${rankingType}`);
        if (!rankingsResponse.ok) {
          throw new Error('Failed to fetch rankings');
        }
        
        const rankingsData = await rankingsResponse.json() as { rankings: AggregatedRanking[], lastUpdated: string };
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
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {rankings.slice(0, rankingType).map((ranking, index) => {
              const player = players[ranking.player_id];
              if (!player) return null;
              const place = index + 1;
              return (
                <div key={ranking.player_id} className="relative overflow-hidden flex bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg group">
                  <div className="flex flex-row w-full items-center z-10">
                    {/* Left Side - Image with Rank Number */}
                    <div className="relative flex-shrink-0" style={{ width: '150px', height: '150px' }}>
                      {/* Player Image */}
                      {player.image_url ? (
                        <div className="h-full w-full flex items-center justify-center overflow-hidden">
                          <Image
                            src={player.image_url}
                            alt={player.name}
                            width={150}
                            height={150}
                            className="h-full w-full object-cover"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl font-light text-gray-500 dark:text-gray-400">
                          <span>{player.name[0]}</span>
                        </div>
                      )}
                      
                      {/* Rank Number in corner with background */}
                      <div className={`absolute top-0 left-0 px-3 py-1 font-bold text-xl z-10 rounded-br-lg text-white ${place === 1 ? 'bg-amber-500' : place === 2 ? 'bg-gray-400' : place === 3 ? 'bg-amber-700' : 'bg-[#FF6B00]'}`}> 
                        {place}
                      </div>
                    </div>

                    {/* Right Side - Player Name with Faded Number */}
                    <div className="flex items-center justify-between flex-1 h-full px-6 py-4 relative">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 z-10">{player.name}</h2>
                      
                      {/* Faded Rank Number */}
                      <div className="absolute right-4 opacity-[0.08] text-[160px] font-black text-gray-900 dark:text-gray-100 select-none">
                        {place}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
