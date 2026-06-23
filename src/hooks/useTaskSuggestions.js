import { useCallback, useEffect, useState } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=8';

const toTitleCase = (value) =>
  value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function useTaskSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      const nextSuggestions = data.map((item) => ({
        id: String(item.id),
        title: toTitleCase(item.title),
        completed: item.completed,
      }));

      setSuggestions(nextSuggestions);
    } catch {
      setError('Could not load suggestions. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    loading,
    error,
    refresh: fetchSuggestions,
  };
}
