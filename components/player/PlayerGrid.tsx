import { useState } from 'react';
import type { Player } from '@/lib/types/Player';
import PlayerCard from './PlayerCard';

interface PlayerGridProps {
  players: Player[];
  onSelectPlayer?: (player: Player) => void;
  onPlayerClick?: (player: Player) => void;
  selectedPlayers?: Player[];
  searchQuery?: string;
  positionFilter?: string;
}

export default function PlayerGrid({
  players,
  onSelectPlayer,
  onPlayerClick,
  selectedPlayers = [],
  searchQuery = '',
  positionFilter = '',
}: PlayerGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 12;
  
  // Filter players based on search query and position filter
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = searchQuery === '' || 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.full_name && player.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      
      {filteredPlayers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No players found matching your criteria.</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
