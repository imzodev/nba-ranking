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
  onPlayerDetails?: (player: Player) => void;
}

export default function PlayerCard({
  player,
  rank,
  points,
  onSelect,
  isSelected = false,
  isDragging = false,
  showDetails = false,
  onPlayerDetails,
}: PlayerCardProps) {
  // Debugging logs
  console.log('PlayerCard player:', player);
  console.log('PlayerCard player.highlights:', player && player.highlights);
  if (player && player.highlights) {
    console.log('highlights type:', typeof player.highlights, 'length:', Array.isArray(player.highlights) ? player.highlights.length : 'n/a');
  }
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
                 ${onSelect ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all' : ''}
                 h-full flex flex-col`}
      onClick={onSelect}
    >
      <div className="flex items-center p-4 flex-grow">
        {rank && (
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#17408B] dark:bg-[#FDBB30] text-white dark:text-[#17408B] rounded-full mr-3 font-bold shadow-sm">
            {rank}
          </div>
        )}
        
        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mr-3 border-2 border-gray-200 dark:border-gray-600 shadow-md">
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
        
        <div className="flex-grow min-w-0 max-w-full">
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-0.5" style={{ wordBreak: 'break-word' }}>{player.name}</h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            {player.position || 'N/A'} • {player.team || 'N/A'}
          </p>
        </div>
        
        {onPlayerDetails && (
          <button
            className="ml-auto px-3 py-1 rounded bg-[#17408B] dark:bg-[#FDBB30] text-white dark:text-[#17408B] text-xs font-semibold shadow hover:bg-[#163370] dark:hover:bg-[#FFD700] transition-colors"
            onClick={e => {
              e.stopPropagation();
              onPlayerDetails(player);
            }}
          >
            View Details
          </button>
        )}
      </div>
      
      {isExpanded && showDetails && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="mb-1">
            <p className="text-gray-500 dark:text-gray-400 font-semibold mb-2">Career Highlights</p>
            {Array.isArray(player.highlights) && player.highlights.length > 0 ? (
              <ul className="list-none pl-0 space-y-1 max-h-52 overflow-y-auto pr-1">
                {player.highlights.map((hl, idx) => (
                  typeof hl === 'string' ? (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-900 dark:text-white">
                      <span className="mt-1 text-[#17408B] dark:text-[#FDBB30]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{hl.replace(/^\*\s*/, '')}</span>
                    </li>
                  ) : null
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No highlights available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
