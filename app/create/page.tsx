'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PlayerGrid from '@/components/player/PlayerGrid';
import RankingList from '@/components/ranking/RankingList';
import RankingTypeSelector from '@/components/ranking/RankingTypeSelector';
import SubmissionForm from '@/components/ranking/SubmissionForm';
import { RANKING_TYPES } from '@/lib/utils/constants';
import type { Player } from '@/lib/types/Player';
import type { RankingSubmission } from '@/lib/types/Ranking';

export default function CreateRankingPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [rankingType, setRankingType] = useState<number>(RANKING_TYPES[1]); // Default to Top 25
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string>('');
  
  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Fetch players with a limit of 10 (or any other number you prefer)
        const response = await fetch('/api/players?limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        // The API now returns the players array directly
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    
    fetchPlayers();
  }, []);
  
  const handleAddPlayer = (player: Player) => {
    // Check if player is already in the list
    if (selectedPlayers.some(p => p.id === player.id)) {
      return;
    }
    
    // Check if we've reached the maximum number of players for this ranking type
    if (selectedPlayers.length >= rankingType) {
      return;
    }
    
    setSelectedPlayers([...selectedPlayers, player]);
  };
  
  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
  };
  
  const handleReorderPlayers = (reorderedPlayers: Player[]) => {
    setSelectedPlayers(reorderedPlayers);
  };
  
  const handleRankingTypeChange = (type: number) => {
    setRankingType(type);
    
    // If the new ranking type is smaller than the current selection, trim the list
    if (selectedPlayers.length > type) {
      setSelectedPlayers(selectedPlayers.slice(0, type));
    }
  };
  
  const handleSubmitRanking = async (submission: RankingSubmission) => {
    setIsSubmitting(true);
    setSubmissionError('');
    
    try {
      // First, create or update the user
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: submission.email,
          name: submission.name,
        }),
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to create user');
      }
      
      // Then, submit the ranking
      const rankingResponse = await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: submission.email,
          rankingType: submission.ranking_type,
          rankings: submission.rankings.map(r => ({
            player_id: r.playerId,
            rank: r.rank,
          })),
        }),
      });
      
      if (!rankingResponse.ok) {
        throw new Error('Failed to submit ranking');
      }
      
      setSubmissionSuccess(true);
      // Reset the form
      setSelectedPlayers([]);
    } catch (error) {
      console.error('Error submitting ranking:', error);
      setSubmissionError('Failed to submit ranking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-[#17408B] dark:text-[#FDBB30]">Create</span> Your NBA Player Ranking
        </h1>
        
        {submissionSuccess ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-8 border border-green-200 dark:border-green-800 shadow-md">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">Thank You!</h2>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Your ranking has been successfully submitted and will be included in the next aggregation.
            </p>
            <button
              onClick={() => {
                setSubmissionSuccess(false);
                setRankingType(RANKING_TYPES[1]); // Reset to Top 25
              }}
              className="bg-[#17408B] hover:bg-[#17408B]/90 text-white px-6 py-3 rounded-md transition-all hover:shadow-lg flex items-center justify-center gap-2"
            >
              Create Another Ranking
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Player selection */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-[#C9082A] rounded-full"></span>
                  Select Players
                </h2>
                <PlayerGrid 
                  players={Array.isArray(players) ? players.filter(player => !selectedPlayers.some(p => p.id === player.id)) : []}
                  onPlayerClick={handleAddPlayer}
                />
              </div>
            </div>
            
            {/* Right column: Ranking creation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 sticky top-24 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-[#FDBB30] rounded-full"></span>
                  Your Ranking
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ranking Type
                  </label>
                  <RankingTypeSelector
                    selectedType={rankingType}
                    onChange={handleRankingTypeChange}
                  />
                </div>
                
                <RankingList
                  players={selectedPlayers}
                  onReorder={handleReorderPlayers}
                  onRemovePlayer={handleRemovePlayer}
                  maxRank={rankingType}
                />
                
                {selectedPlayers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Submit Your Ranking</h3>
                    <SubmissionForm
                      players={selectedPlayers}
                      rankingType={rankingType}
                      onSubmit={handleSubmitRanking}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
