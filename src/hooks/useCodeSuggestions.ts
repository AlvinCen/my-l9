
import { useLocalStorage } from './useLocalStorage';
import { CodeSuggestion } from '../data/codes';
import { generateUUID } from '../utils/helpers';

export function useCodeSuggestions() {
  const [suggestions, setSuggestions] = useLocalStorage<CodeSuggestion[]>('ln_code_suggestions', []);

  const addSuggestion = (data: Omit<CodeSuggestion, 'id' | 'createdAt'>) => {
    const newSuggestion: CodeSuggestion = {
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    setSuggestions(prev => [newSuggestion, ...prev]);
  };

  const deleteSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return { suggestions, addSuggestion, deleteSuggestion, clearSuggestions };
}
