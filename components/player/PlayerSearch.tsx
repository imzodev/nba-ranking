import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface PlayerSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function PlayerSearch({ onSearch, placeholder = 'Search players...' }: PlayerSearchProps) {
  const [query, setQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-nba-blue dark:bg-gray-800 sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
      </div>
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center px-3 rounded-r-md bg-nba-blue text-white hover:bg-nba-blue/90 focus:outline-none focus:ring-2 focus:ring-nba-blue focus:ring-offset-2"
      >
        Search
      </button>
    </form>
  );
}
