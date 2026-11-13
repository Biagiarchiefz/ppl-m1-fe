import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

// useMutation yang menyegarkan query terkait (mis. daftar pengguna) setelah
// berhasil, pengganti pola `reloadKey` sebelumnya.
export function useApiMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidates: QueryKey[],
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => Promise.all(invalidates.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
  });
}
