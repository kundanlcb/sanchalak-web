import { useState, useEffect } from 'react';

/**
 * Hook to manage user's favorite navigation paths in localStorage
 */
export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>(() => {
        const saved = localStorage.getItem('sanchalan_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('sanchalan_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (path: string) => {
        setFavorites((prev) =>
            prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
        );
    };

    const isFavorite = (path: string) => favorites.includes(path);

    return { favorites, toggleFavorite, isFavorite };
};
