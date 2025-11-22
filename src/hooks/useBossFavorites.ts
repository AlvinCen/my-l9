import { useLocalStorage } from './useLocalStorage';

export interface UseBossFavoritesResult {
  favorites: string[];
  isFavorite: (bossId: string) => boolean;
  toggleFavorite: (bossId: string) => void;
}

export function useBossFavorites(): UseBossFavoritesResult {
  const [favorites, setFavorites] = useLocalStorage<string[]>('LN_BOSS_FAVORITES', []);

  const isFavorite = (bossId: string): boolean => {
    return favorites.includes(bossId);
  };

  const toggleFavorite = (bossId: string) => {
    setFavorites(prev => {
      if (prev.includes(bossId)) {
        return prev.filter(id => id !== bossId);
      } else {
        return [...prev, bossId];
      }
    });
  };

  return { favorites, isFavorite, toggleFavorite };
}
