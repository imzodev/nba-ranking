'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Player } from '@/lib/types/Player';
import { ListFilter } from 'lucide-react';

interface TopPlayer {
  player_id: string;
  rank: number;
  points: number;
  ranking_type: number;
  aggregation_date: string;
  calculation_date: string;
  player: Player;
}

export default function TopPlayersSection() {
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setIsLoading(true);
      try {
        // Fetch the top 10 players from the cached endpoint
        const rankingsResponse = await fetch('/api/rankings/top', {
          // Use cache-first strategy
          cache: 'force-cache',
          next: {
            // Revalidate at most once every 24 hours
            revalidate: 86400
          }
        });
        
        if (!rankingsResponse.ok) {
          throw new Error('Failed to fetch top players');
        }
        
        const data = await rankingsResponse.json();
        setTopPlayers(data.rankings);
      } catch (err) {
        console.error('Error fetching top players:', err);
        setError('Failed to load top players. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Current Top 10 NBA Players</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Based on the collective wisdom of basketball fans. These rankings update as new votes come in.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400 py-10">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {topPlayers.map((player, index) =>  {
                const rankedPlayer = player.player;
                return (
                
              <div 
                key={rankedPlayer.id} 
                className={`relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2 flex flex-col' : ''
                }`}
              >
                <div className={`relative ${index === 0 ? 'flex-grow h-full min-h-[320px]' : 'h-48'} w-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
                  {rankedPlayer.image_url ? (
                    <Image
                      src={rankedPlayer.image_url}
                      alt={rankedPlayer.name}
                      fill
                      className={`object-cover ${index === 0 ? 'object-top' : ''}`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-white dark:bg-gray-900 rounded-full h-8 w-8 flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  <h3 className="font-bold text-lg mb-1 truncate">{rankedPlayer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rankedPlayer.position} • {rankedPlayer.team}
                  </p>
                </div>
              </div>
            )})}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/rankings/25" 
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-bold rounded-md shadow-md text-white bg-indigo-800 hover:bg-indigo-900 transition-all duration-200"
          >
            View Full Rankings <ListFilter className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
