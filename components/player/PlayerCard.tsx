import Image from 'next/image';
import { useState } from 'react';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleDetails = () => {
    if (showDetails) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div 
      className={`relative bg-white dark:bg-gray-900 rounded-xl border transition-all duration-200 overflow-hidden h-full flex flex-col ${
        isSelected 
          ? 'border-[#17408B] shadow-lg shadow-[#17408B]/25 dark:shadow-[#17408B]/25' 
          : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
      } ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      } ${
        onSelect ? 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex-1 flex items-center gap-4 p-5">
        {rank && (
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#17408B] to-[#17408B] text-white rounded-full font-bold shadow-sm text-sm">
            {rank}
          </div>
        )}
        
        <div className="flex-shrink-0 w-14 h-14 relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 ring-2 ring-gray-200 dark:ring-gray-700">
          {player.image_url ? (
            <Image
              src={player.image_url}
              alt={player.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-lg">
              {player.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-center min-h-[56px] flex-grow min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 leading-tight truncate">
            {player.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
            {player.position || 'N/A'} • {player.team || 'N/A'}
          </p>
          {points && (
            <p className="text-xs text-[#17408B] dark:text-[#17408B] font-medium mt-0.5">
              {points} points
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          {onPlayerDetails && (
            // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 gap-4">

            <button
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17408B] hover:bg-[#17408B] text-white text-sm font-medium shadow-sm transition-colors duration-200"
              onClick={e => {
                e.stopPropagation();
                onPlayerDetails(player);
              }}
            >
              <Eye className="w-4 h-4" />
              Details
            </button>
          )}
          
          {showDetails && (
            <button
              className="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
              onClick={e => {
                e.stopPropagation();
                toggleDetails();
              }}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && showDetails && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Career Highlights
            </h4>
            {Array.isArray(player.highlights) && player.highlights.length > 0 ? (
              <div className="max-h-48 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  {player.highlights.map((hl, idx) => (
                    typeof hl === 'string' ? (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                        <span className="leading-relaxed">
                          {hl.replace(/^\*\s*/, '')}
                        </span>
                      </li>
                    ) : null
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No highlights available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}