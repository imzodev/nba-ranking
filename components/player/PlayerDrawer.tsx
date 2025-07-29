import React from 'react';
import type { Player } from '@/lib/types/Player';

interface PlayerDrawerProps {
  player: Player | null;
  open: boolean;
  onClose: () => void;
}

export default function PlayerDrawer({ player, open, onClose }: PlayerDrawerProps) {
  if (!open || !player) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`relative w-full max-w-md bg-white dark:bg-gray-900 shadow-xl h-full flex flex-col animate-slide-in-right`}
        role="dialog"
        aria-modal="true"
        style={{ height: '100dvh', maxHeight: '100dvh' }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-6 pb-2">
            <div className="flex items-center gap-4 mb-4">
              {player.image_url && (
                <img src={player.image_url} alt={player.name} className="w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{player.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{player.position} • {player.team}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
            <p className="text-gray-500 dark:text-gray-400 font-semibold mb-2">Career Highlights</p>
            {Array.isArray(player.highlights) && player.highlights.length > 0 ? (
              <ul className="list-none pl-0 space-y-1">
                {player.highlights.map((hl, idx) =>
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
                )}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No highlights available.</p>
            )}
          </div>
        </div>
      </aside>
      <style jsx global>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
