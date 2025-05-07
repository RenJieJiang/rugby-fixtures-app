'use client'

import { useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search( { placeholder = 'Search teams...' } : { placeholder?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query')?.toString() || '');
  
  // Update URL with debounced search query
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    
    replace(`${pathname}?${params.toString()}`);
  }, 600);
  
  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="search" className="sr-only">
        Search for teams
      </label>
      <input
        id="search"
        type="text"
        value={searchQuery}
        onChange={(e) => {
          const newValue = e.target.value;
          setSearchQuery(newValue);
          handleSearch(newValue);
        }}
        placeholder= {placeholder}
        className="block w-full rounded-md border border-gray-400 py-2.5 pl-10 pr-12 text-gray-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            handleSearch('');
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}