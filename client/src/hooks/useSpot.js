import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { useCallback, useState } from "react";
import { spotService } from "@/services/spotService";

export const useSpot = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (action) => {
      if (!isAuthenticated) {
        const err = new Error("ログインが必要です");
        setError(err.message);
        toast.error(err.message);
        throw err;
      }
      setIsLoading(true);
      setError(null);

      try {
        return await action();
      } catch (err) {
        const message = err.message || "処理に失敗しました";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated],
  );
  const getSpots = useCallback(() => run(() => spotService.fetchSpot()), [run]);
  const saveSpot = useCallback((place) => run(() => spotService.saveSpot(place)), [run]);
  const deleteSpot = useCallback((id) => run(() => spotService.deleteSpot(id)), [run]);
  const setVisited = useCallback((id) => run(() => spotService.setVisited(id)), [run]);
  return {
    getSpots,
    saveSpot,
    deleteSpot,
    setVisited,
    isLoading,
    error,
  };
};
