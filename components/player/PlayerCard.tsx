import Image from 'next/image';
import { useState } from 'react';
import type { Player } from '@/lib/types/Player';

interface PlayerCardProps {
  player: Player;
  rank?: number;
  points?: number;
  onSelect?: () => void;
  isSelected?: boolean;
  isDragging?: boolean;
  showDetails?: boolean;
}

export default function PlayerCard({
  player,
  rank,
  points,
  onSelect,
  isSelected = false,
  isDragging = false,
  showDetails = false,
}: PlayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleDetails = () => {
    if (showDetails) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div 
      className={`card relative bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all ${isSelected ? 'ring-2 ring-[#17408B] dark:ring-[#FDBB30]' : ''} 
                 ${isDragging ? 'opacity-50' : 'opacity-100'} 
                 ${onSelect ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center p-3">
        {rank && (
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#17408B] dark:bg-[#FDBB30] text-white dark:text-[#17408B] rounded-full mr-3 font-bold shadow-sm">
            {rank}
          </div>
        )}
        
        <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mr-3 border-2 border-gray-200 dark:border-gray-600">
          {player.image_url ? (
            <Image
              src={player.image_url}
              alt={player.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              {player.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <h3 className="text-base font-semibold truncate text-gray-900 dark:text-white">{player.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {player.position || 'N/A'} • {player.team || 'N/A'}
          </p>
        </div>
        
        {showDetails && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleDetails();
            }}
            className="ml-2 text-gray-500 hover:text-[#17408B] dark:hover:text-[#FDBB30] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              )}
            </svg>
          </button>
        )}
      </div>
      
      {isExpanded && showDetails && (
        <div className="px-3 pb-3 pt-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {points !== undefined && (
              <div className="col-span-2 mb-1">
                <p className="text-gray-500 dark:text-gray-400">Ranking Points</p>
                <p className="font-medium text-[#17408B] dark:text-[#FDBB30]">{points.toFixed(1)}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 dark:text-gray-400">PPG</p>
              <p className="font-medium">{player.ppg || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">RPG</p>
              <p className="font-medium">{player.rpg || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">APG</p>
              <p className="font-medium">{player.apg || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Championships</p>
              <p className="font-medium">{player.championships || '0'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">MVPs</p>
              <p className="font-medium">{player.mvps || '0'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">All-Star</p>
              <p className="font-medium">{player.all_star || '0'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
