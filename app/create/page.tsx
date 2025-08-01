'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PlayerGrid from '@/components/player/PlayerGrid';
import PlayerDrawer from '@/components/player/PlayerDrawer';
import PlayerDetailsPanel from '@/components/player/PlayerDetailsPanel';
import RankingList from '@/components/ranking/RankingList';
import RankingTypeSelector from '@/components/ranking/RankingTypeSelector';
import SubmissionForm from '@/components/ranking/SubmissionForm';
import { RANKING_TYPES, RankingType } from '@/lib/utils/constants';
import type { Player } from '@/lib/types/Player';
import type { RankingSubmission } from '@/lib/types/Ranking';

export default function CreateRankingPage() {
  const [drawerPlayer, setDrawerPlayer] = useState<Player | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handlePlayerDetails = (player: Player) => {
    setDrawerPlayer(player);
    setDrawerOpen(true);
  };

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [rankingType, setRankingType] = useState<RankingType>(RANKING_TYPES[1]); // Default to Top 25

  // Always keep rankingType as a valid number
  const allowedRankingTypes = RANKING_TYPES;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string>('');
  
  // State for search query and loading state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Fetch players from API with search capability
  useEffect(() => {
    const fetchPlayers = async () => {
      // Only show loading indicator and perform search when we have 3+ characters
      const isActualSearch = searchQuery.length >= 3;
      
      if (isActualSearch) {
        setIsLoading(true);
      }
      
      try {
        // Only search if query has 3+ characters, otherwise show default list
        const apiUrl = isActualSearch
          ? `/api/players?query=${encodeURIComponent(searchQuery)}&limit=50`
          : '/api/players?limit=50';
          
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        
        // If this is not a search query, scramble the top 10 players to avoid bias
        if (!isActualSearch && data.length > 0) {
          // Take first 10 players (or all if less than 10) and shuffle them
          const topPlayersToShuffle = data.slice(0, 10);
          const remainingPlayers = data.slice(10);
          
          // Fisher-Yates shuffle algorithm for the top players
          for (let i = topPlayersToShuffle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [topPlayersToShuffle[i], topPlayersToShuffle[j]] = [topPlayersToShuffle[j], topPlayersToShuffle[i]];
          }
          
          // Combine shuffled top players with remaining players
          setPlayers([...topPlayersToShuffle, ...remainingPlayers]);
        } else {
          setPlayers(data);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        if (isActualSearch) {
          setIsLoading(false);
        }
      }
    };
    
    // Use a debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchPlayers();
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // Re-fetch when search query changes
  
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
  
  const handleRankingTypeChange = (type: RankingType) => {
    // Only allow valid ranking types
    if (allowedRankingTypes.includes(type)) {
      setRankingType(type);
      
      // If we have more players than the new ranking type allows, trim the list
      if (selectedPlayers.length > type) {
        setSelectedPlayers(selectedPlayers.slice(0, type));
      }
    }
  };
  
  const handleSubmitRanking = async (submission: RankingSubmission) => {
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setSubmissionError('');
    
    try {
      // Validate that we have the correct number of players
      if (submission.rankings.length !== submission.ranking_type) {
        throw new Error(`You must select exactly ${submission.ranking_type} players for your ranking.`);
      }
      
      // Validate that the ranking type is allowed
      if (!allowedRankingTypes.includes(submission.ranking_type)) {
        throw new Error('Invalid ranking type. Must be one of the allowed ranking types.');
      }
      
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
          name: submission.name,
          ranking_type: submission.ranking_type,
          rankings: submission.rankings.map((r) => ({
            playerId: r.playerId,
            rank: r.rank,
          })),
        }),
      });

      if (!rankingResponse.ok) {
        // Parse the error response to get the actual error message
        const errorData = await rankingResponse.json();
        throw new Error(errorData.error || 'Failed to submit ranking');
      }

      setSubmissionSuccess(true);
      // Reset the form
      setSelectedPlayers([]);
    } catch (error) {
      console.error('Error submitting ranking:', error);
      setSubmissionSuccess(false);
      setSubmissionError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      {/* Mobile drawer only */}
      <div className="block lg:hidden">
        <PlayerDrawer
          player={drawerPlayer}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
      <div className="w-full max-w-none px-2 sm:px-4 py-8">
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
          <div className="grid grid-cols-1 lg:[grid-template-columns:minmax(300px,340px)_1fr_minmax(320px,370px)] gap-6 w-full">
            {/* Left column: Player details (desktop only) */}
            <div className="hidden lg:block h-full sticky top-24 self-start">
              <PlayerDetailsPanel player={drawerPlayer} />
            </div>
            {/* Center column: Player selection */}
            <div className="order-2 lg:order-1 col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <span className="inline-block w-1 h-6 bg-[#C9082A] rounded-full"></span>
                    Select Players
                  </h2>

                  
                  <div className="w-full">
                    <div className="w-full">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                        {players.length == 50 ? 5219 : players.length} player{players.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>
                </div>
                
                <PlayerGrid 
                  players={Array.isArray(players) ? players.filter(player => !selectedPlayers.some(p => p.id === player.id)) : []}
                  onSelectPlayer={handleAddPlayer}
                  onPlayerDetails={handlePlayerDetails}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  isLoading={isLoading}
                  showSearch={true}
                />              </div>
            </div>
            
            {/* Right column: Ranking creation */}
            <div className="order-1 lg:order-2 lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 sticky top-4 border border-gray-100 dark:border-gray-700">
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
                  <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ranking Type
                  </div>
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
                      error={submissionError}
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
