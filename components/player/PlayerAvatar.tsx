import Image from 'next/image';
import { useState } from 'react';
import type { Player } from '@/lib/types/Player';

/**
 * PlayerAvatar component to handle image loading with fallback
 * Displays a player's image with error handling and fallback
 */
export default function PlayerAvatar({ player }: { player: Player }) {
  const [imageError, setImageError] = useState(false);
  
  // If no image URL or previous error, show fallback
  if (!player.image_url || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-lg">
        {player.name.charAt(0)}
      </div>
    );
  }
  
  // Try to load the image, with onError handler
  return (
    <Image
      src={player.image_url}
      alt={player.name}
      fill
      sizes="150px"
      className="object-cover"
      onError={() => {
        console.log(`Failed to load image for ${player.name}`);
        setImageError(true);
      }}
    />
  );
}
