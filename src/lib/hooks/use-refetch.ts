import { useQueryClient } from "@tanstack/react-query";

export function useRefetch(queryKey: string[]) {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey,
  });
}
