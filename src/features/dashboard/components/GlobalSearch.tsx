import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, User, FileText } from 'lucide-react';
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
        return;
      }

      setLoading(true);
      try {
        const data = await searchService.globalSearch(debouncedQuery);
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

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'student': return <User className="h-4 w-4 text-blue-500" />;
      case 'teacher': return <User className="h-4 w-4 text-purple-500" />;
      case 'page': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <Search className="h-4 w-4" />;
    }
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
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
          placeholder="Search students, teachers, pages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
      </div>

      {isOpen && (results.length > 0 || query.length > 0) && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 dark:ring-gray-800 overflow-auto focus:outline-none sm:text-sm z-50 border dark:border-gray-800">
          {results.length === 0 && query.length > 2 && !loading ? (
            <div className="padding-4 text-center text-gray-500 dark:text-gray-400 py-4">No results found</div>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-800 group transition-colors"
                onClick={() => handleSelect(result)}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 mr-3">
                    {getIcon(result.type)}
                  </span>
                  <div>
                    <span className="block truncate font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {result.title}
                    </span>
                    {result.subtitle && (
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                        {result.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
