import React from 'react';
import { Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { cn } from '../../utils/cn';

/**
 * Toggle button to mark/unmark the current page as a favorite.
 * Positioned in the top-right of the page content.
 */
export const FavoriteToggle: React.FC = () => {
    const location = useLocation();
    const { isFavorite, toggleFavorite } = useFavorites();
    const currentPath = location.pathname;

    // Don't show on dashboard
    if (currentPath === '/') return null;

    const active = isFavorite(currentPath);

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(currentPath);
            }}
            className={cn(
                'group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-300 border',
                active
                    ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-500/30 dark:text-amber-400 shadow-sm'
                    : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-white hover:border-gray-200 hover:text-gray-600 dark:bg-white/5 dark:border-white/5 dark:text-gray-500 dark:hover:text-gray-300'
            )}
            title={active ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Star
                className={cn(
                    'w-3.5 h-3.5 transition-transform duration-300',
                    active ? 'fill-amber-500 dark:fill-amber-400' : 'fill-transparent group-hover:scale-110'
                )}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:block">
                {active ? 'Favorited' : 'Favorite'}
            </span>
        </button>
    );
};
