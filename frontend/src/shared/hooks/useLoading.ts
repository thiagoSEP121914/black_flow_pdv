import { useState, useCallback } from "react";

interface UseLoadingReturn {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoading = (initialState = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  return { isLoading, setIsLoading, startLoading, stopLoading };
};
