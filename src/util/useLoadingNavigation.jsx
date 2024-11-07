import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useLoadingNavigation() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  const navigateWithLoading = (path, delay = 1500) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(path);
    }, delay);
  };

  return { isLoading, navigateWithLoading };
}