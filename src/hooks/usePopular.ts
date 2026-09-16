import { useQuery } from '@tanstack/react-query';
import { getPopularBooks, getPopularMovies } from '../api/popular';
import { queryKeys } from '../query/keys';

export function usePopular() {
  return useQuery({
    queryKey: queryKeys.popular,
    queryFn: async () => {
      const movies = await getPopularMovies(10);
      const books = await getPopularBooks(10);
      return [...movies, ...books];
    },
  });
}
