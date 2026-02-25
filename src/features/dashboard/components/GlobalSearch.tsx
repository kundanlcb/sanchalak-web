import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, GraduationCap, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
import { searchService, type SearchResult } from '../services/searchService';

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const search = async () => {
      if (debouncedQuery.trim().length === 0) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchService.searchStudents(debouncedQuery);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    navigate(result.link);
  };

  return (
    <div className="relative w-full max-w-md hidden md:block" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          id="global-student-search"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
          placeholder="Search students..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 shadow-xl max-h-96 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 dark:ring-gray-700 overflow-auto focus:outline-none sm:text-sm z-50 border border-gray-100 dark:border-gray-800">
          {results.length === 0 && query.length > 1 && !loading ? (
            <div className="flex flex-col items-center py-8 text-gray-400 dark:text-gray-500">
              <User className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">No students found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <>
              {results.length > 0 && (
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                  Students
                </div>
              )}
              {results.map((result) => (
                <div
                  key={result.id}
                  className="cursor-pointer select-none px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 group transition-colors"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
