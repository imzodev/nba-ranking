"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlayerCard from '../player/PlayerCard';
import type { Player } from '@/lib/types/Player';

interface SortableItemProps {
  id: string;
  player: Player;
  rank: number;
  onRemove?: () => void;
}

export function SortableItem({ id, player, rank, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <div className="group">
        <PlayerCard
          player={player}
          rank={rank}
          isDragging={isDragging}
          showDetails={true}
        />
        
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Remove player"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
