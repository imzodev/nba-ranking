import { useState, useEffect } from 'react';
import type { Player } from '@/lib/types/Player';
import PlayerCard from './PlayerCard';
import { Search } from 'lucide-react';

interface PlayerGridProps {
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
  onPlayerClick?: (player: Player) => void;
  selectedPlayers?: Player[];
  searchQuery?: string;
  positionFilter?: string;
  showSearch?: boolean;
}

export default function PlayerGrid({
  players,
  onSelectPlayer,
  onPlayerClick,
  selectedPlayers = [],
  searchQuery = '',
  positionFilter = '',
  showSearch = true,
}: PlayerGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const playersPerPage = 16;
  
  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearchQuery]);
  
  // Simulate loading state when filtering
  useEffect(() => {
    if (localSearchQuery !== searchQuery) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [localSearchQuery, searchQuery]);
  
  // Filter players based on search query and position filter
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = localSearchQuery === '' || 
      player.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      (player.full_name && player.full_name.toLowerCase().includes(localSearchQuery.toLowerCase())) ||
      (player.team && player.team.toLowerCase().includes(localSearchQuery.toLowerCase()));
    
    const matchesPosition = positionFilter === '' || 
      (player.position && player.position.includes(positionFilter));
    
    return matchesSearch && matchesPosition;
  });
  
  // Calculate pagination
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  
  // Check if a player is selected
  const isPlayerSelected = (player: Player) => {
    return selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id);
  };
  
  // Handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      {showSearch && (
        <div className="relative mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#17408B] dark:focus:ring-[#FDBB30] focus:border-[#17408B] dark:focus:border-[#FDBB30] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              placeholder="Search players by name or team..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
            />
            {localSearchQuery && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setLocalSearchQuery('')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17408B] dark:border-[#FDBB30]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {currentPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onSelect={() => {
                if (onPlayerClick) {
                  onPlayerClick(player);
                } else if (onSelectPlayer) {
                  onSelectPlayer(player);
                }
              }}
              isSelected={isPlayerSelected(player)}
              showDetails={true}
            />
          ))}
        </div>
      )}
      
      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No players found matching your criteria.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search terms.</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px bg-white dark:bg-gray-800" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                  ${currentPage === i + 1
                    ? 'z-10 bg-nba-blue dark:bg-nba-blue border-nba-blue text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
