"use client";

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import PlayerCard from '../player/PlayerCard';
import type { Player } from '@/lib/types/Player';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  player: Player;
  rank: number;
  onRemove?: () => void;
}

function SortableItem({ id, player, rank, onRemove }: SortableItemProps) {
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

interface RankingListProps {
  players: Player[];
  onReorder: (reorderedPlayers: Player[]) => void;
  onRemovePlayer?: (playerId: string) => void;
  maxRank?: number;
}

export default function RankingList({
  players,
  onReorder,
  onRemovePlayer,
  maxRank = 25,
}: RankingListProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    
    const { active, over } = event;
    
    // If no over item or same item, no reordering needed
    if (!over || active.id === over.id) {
      return;
    }
    
    // Find the indices for the source and destination
    const oldIndex = players.findIndex(player => player.id === active.id);
    const newIndex = players.findIndex(player => player.id === over.id);
    
    // Reorder the list using arrayMove helper
    const reorderedPlayers = arrayMove(players, oldIndex, newIndex);
    onReorder(reorderedPlayers);
  };

  return (
    <div className="w-full">
      {players.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Drag players here to create your ranking
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 bg-white dark:bg-gray-800 inline-block px-3 py-1 rounded-full">
            Maximum {maxRank} players
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={players.map(player => player.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {players.map((player, index) => (
                <SortableItem
                  key={player.id}
                  id={player.id}
                  player={player}
                  rank={index + 1}
                  onRemove={onRemovePlayer ? () => onRemovePlayer(player.id) : undefined}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      
      {players.length > 0 && players.length < maxRank && (
        <div className="text-center mt-4">
          <p className="text-sm bg-gray-100 dark:bg-gray-800 inline-block px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">
            {players.length} of {maxRank} players selected
          </p>
        </div>
      )}
      
      {players.length >= maxRank && (
        <div className="text-center mt-4">
          <p className="text-sm bg-[#17408B] dark:bg-[#FDBB30] text-white dark:text-[#17408B] font-medium inline-block px-4 py-1 rounded-full shadow-sm">
            Maximum {maxRank} players reached
          </p>
        </div>
      )}
    </div>
  );
}
