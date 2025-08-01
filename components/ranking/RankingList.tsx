"use client";

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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

import { SortableItem, SortableItemProps } from './SortableItem';

interface RankingListProps {
  players: Player[];
  onReorder: (reorderedPlayers: Player[]) => void;
  onRemovePlayer?: (playerId: string) => void;
  maxRank?: number;
}

// Hook to detect if the device is touch-enabled
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
  }, []);
  return isTouch;
}

export default function RankingList({
  players,
  onReorder,
  onRemovePlayer,
  maxRank = 25,
}: RankingListProps) {
  const [isDragging, setIsDragging] = useState(false);
  const isTouch = useIsTouchDevice();

  // Configure sensors for drag detection
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150, // Optional: slight delay for mobile
      tolerance: 5,
    },
  });
  
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  
  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });
  
  const sensors = useSensors(
    isTouch ? touchSensor : pointerSensor,
    keyboardSensor
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
