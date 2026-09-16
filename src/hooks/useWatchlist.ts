import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../query/keys';
import {
  addWatchlistItem,
  fetchWatchlist,
  removeWatchlistItem,
  updateWatchlistRating,
  updateWatchlistStatus,
} from '../query/watchlistApi';
import type { WatchlistItem, WatchlistStatus } from '../types/watchlistItem';
import { withUpdatedRating } from '../utils/watchlistView';

export function useWatchlistQuery() {
  return useQuery({
    queryKey: queryKeys.watchlist,
    queryFn: fetchWatchlist,
  });
}

function useWatchlistMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<WatchlistItem[]>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (items) => {
      queryClient.setQueryData(queryKeys.watchlist, items);
    },
  });
}

export function useAddWatchlistItem() {
  return useWatchlistMutation(addWatchlistItem);
}

export function useRemoveWatchlistItem() {
  return useWatchlistMutation(removeWatchlistItem);
}

export function useUpdateWatchlistStatus() {
  return useWatchlistMutation(
    ({ id, status }: { id: string; status: WatchlistStatus }) =>
      updateWatchlistStatus(id, status),
  );
}

export function useUpdateWatchlistRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      rating,
      simulateFailure,
    }: {
      id: string;
      rating: number | null;
      simulateFailure?: boolean;
    }) => updateWatchlistRating(id, rating, { simulateFailure }),
    onMutate: async ({ id, rating }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.watchlist });
      const previous = queryClient.getQueryData<WatchlistItem[]>(
        queryKeys.watchlist,
      );
      queryClient.setQueryData(
        queryKeys.watchlist,
        (items: WatchlistItem[] | undefined) =>
          withUpdatedRating(items ?? [], id, rating),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.watchlist, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.watchlist });
    },
  });
}
