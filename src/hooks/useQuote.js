import { useState, useEffect } from 'react';

export function useQuote() {
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const res = await fetch('https://zenquotes.io/api/random');
      const data = await res.json();
      if (data && data[0]) {
        setQuote({ text: data[0].q, author: data[0].a });
      }
    } catch {
      setQuote({
        text: 'The secret of getting ahead is getting started.',
        author: 'Mark Twain',
      });
    } finally {
      setLoadingQuote(false);
    }
  };

  return { quote, loadingQuote, refreshQuote: fetchQuote };
}
