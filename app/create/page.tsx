'use client';

import { useState, useEffect, useMemo } from 'react';
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
        // Fetch players with a larger limit to provide more options
        const response = await fetch('/api/players?limit=50');
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
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter players based on search query
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      if (searchQuery === '') return true;
      
      const query = searchQuery.toLowerCase();
      return (
        player.name.toLowerCase().includes(query) ||
        (player.full_name && player.full_name.toLowerCase().includes(query)) ||
        (player.team && player.team.toLowerCase().includes(query))
      );
    });
  }, [players, searchQuery]);
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-2">
          <div>
            <span className="text-[#17408B] dark:text-[#FDBB30] mr-2">Create</span> Your NBA Player Ranking
          </div>
          <span className="md:ml-auto text-sm md:text-base font-normal bg-[#17408B] dark:bg-[#FDBB30] text-white dark:text-[#17408B] px-3 py-1 rounded-full inline-flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {selectedPlayers.length}/{rankingType} Players Selected
          </span>
        </h1>
        
        {submissionSuccess ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-lg mb-8 border border-green-200 dark:border-green-800 shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-800 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-3">Thank You!</h2>
            <p className="text-green-700 dark:text-green-300 mb-6 text-lg">
              Your ranking has been successfully submitted and will be included in the next aggregation.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setSubmissionSuccess(false);
                  setRankingType(RANKING_TYPES[1]); // Reset to Top 25
                }}
                className="bg-[#17408B] hover:bg-[#17408B]/90 text-white px-8 py-3 rounded-md transition-all hover:shadow-lg flex items-center justify-center gap-2 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Create Another Ranking
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Player selection */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <span className="inline-block w-1 h-6 bg-[#C9082A] rounded-full"></span>
                    Select Players
                  </h2>
                  
                  <div className="w-full">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#17408B] dark:focus:ring-[#FDBB30] focus:border-[#17408B] dark:focus:border-[#FDBB30] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all shadow-sm"
                        placeholder="Search by player name or team..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {searchQuery && (
                        <button
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          onClick={() => setSearchQuery('')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                      {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
                
                <PlayerGrid 
                  players={Array.isArray(players) ? players.filter(player => !selectedPlayers.some(p => p.id === player.id)) : []}
                  onPlayerClick={handleAddPlayer}
                  searchQuery={searchQuery}
                  showSearch={false}
                />
              </div>
            </div>
            
            {/* Right column: Ranking creation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 sticky top-24 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-[#FDBB30] rounded-full"></span>
                  Your Ranking
                  {selectedPlayers.length > 0 && (
                    <span className="ml-auto text-sm font-medium bg-[#FDBB30] dark:bg-[#17408B] text-[#17408B] dark:text-[#FDBB30] px-2 py-1 rounded-full">
                      {selectedPlayers.length}/{rankingType}
                    </span>
                  )}
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ranking Type
                  </label>
                  <RankingTypeSelector
                    selectedType={rankingType}
                    onChange={handleRankingTypeChange}
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Select the type of ranking you want to create. This will determine how many players you can include.
                  </p>
                </div>
                
                <RankingList
                  players={selectedPlayers}
                  onReorder={handleReorderPlayers}
                  onRemovePlayer={handleRemovePlayer}
                  maxRank={rankingType}
                />
                
                {selectedPlayers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center">
                      <span>Submit Your Ranking</span>
                      {selectedPlayers.length === rankingType && (
                        <span className="ml-auto text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded-full flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Ready to Submit
                        </span>
                      )}
                    </h3>
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
