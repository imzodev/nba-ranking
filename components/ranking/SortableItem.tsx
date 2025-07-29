"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlayerCard from '../player/PlayerCard';
import type { Player } from '@/lib/types/Player';

export interface SortableItemProps {
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative touch-manipulation">
      <div className="group">
        <PlayerCard
          player={player}
          rank={rank}
          isDragging={isDragging}
          showDetails={true}
        />
        {onRemove && (
          <>
            {/* Mobile: always visible */}
            <button
              onClick={onRemove}
              className="absolute top-3 right-3 z-50 block md:hidden bg-[#C9082A] text-white rounded-full p-1 hover:bg-[#C9082A]/90 focus:outline-none focus:ring-2 focus:ring-[#C9082A] shadow-sm"
              aria-label="Remove player"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Desktop: hover-to-show */}
            <button
              onClick={onRemove}
              className="absolute top-3 right-3 z-50 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity bg-[#C9082A] text-white rounded-full p-1 hover:bg-[#C9082A]/90 focus:outline-none focus:ring-2 focus:ring-[#C9082A] shadow-sm"
              aria-label="Remove player"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
