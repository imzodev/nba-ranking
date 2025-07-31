import { useState, useEffect } from 'react';
import type { Player } from '@/lib/types/Player';
import PlayerCard from './PlayerCard';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlayerGridProps {
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
  onPlayerClick?: (player: Player) => void;
  selectedPlayers?: Player[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  positionFilter?: string;
  showSearch?: boolean;
  isLoading?: boolean;
}

interface PlayerGridProps {
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
  onPlayerClick?: (player: Player) => void;
  onPlayerDetails?: (player: Player) => void;
  selectedPlayers?: Player[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  positionFilter?: string;
  showSearch?: boolean;
  isLoading?: boolean;
}

export default function PlayerGrid({
  players,
  onSelectPlayer,
  onPlayerClick,
  onPlayerDetails,
  selectedPlayers = [],
  searchQuery = '',
  onSearchChange,
  positionFilter = '',
  showSearch = true,
  isLoading = false,
}: PlayerGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const playersPerPage = 16;
  
  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // Update local search query when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };
  
  // Filter players based on position filter only (search is handled server-side)
  const filteredPlayers = players.filter((player) => {
    const matchesPosition = positionFilter === '' || 
      (player.position && player.position.includes(positionFilter));
    
    return matchesPosition;
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
              id="player-search"
              name="player-search"
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#17408B] dark:focus:ring-[#FDBB30] focus:border-[#17408B] dark:focus:border-[#FDBB30] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              placeholder="Search players by name or team..."
              value={localSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
/>
            {localSearchQuery && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => handleSearchChange('')}
              >
                <X className="h-5 w-5" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">
          {currentPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onSelect={onSelectPlayer ? () => onSelectPlayer(player) : undefined}
              isSelected={isPlayerSelected(player)}
              isDragging={false}
              showDetails={true}
              onPlayerDetails={onPlayerDetails}
            />
          ))}
        </div>
      )}
      
      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <Search className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
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
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                  ${currentPage === i + 1
                    ? 'z-10 bg-slate-200 dark:bg-slate-600 border-slate-400 dark:border-slate-600 text-gray-900 dark:text-slate-50 font-black'
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
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
