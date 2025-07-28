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
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Drag players here to create your ranking
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
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
            <div className="space-y-3">
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {players.length} of {maxRank} players selected
          </p>
        </div>
      )}
      
      {players.length >= maxRank && (
        <div className="text-center mt-4">
          <p className="text-sm text-green-600 dark:text-green-400">
            Maximum {maxRank} players reached
          </p>
        </div>
      )}
    </div>
  );
}
