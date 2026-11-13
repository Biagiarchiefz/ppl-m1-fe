import { deactivateUser, userKeys } from "../services/users.service";
import { errorMessage } from "../../../services/api";
import { useApiMutation } from "../../../hooks/useApiMutation";
import type { User } from "../../../types";

// Konfirmasi DELETE /users/{id} (soft delete, PRD 11).
export function useDeactivateUser(user: User, onDone: (message: string) => void) {
  const mutation = useApiMutation(deactivateUser, [userKeys.all]);

  const handleConfirm = () =>
    mutation.mutate(user.id, {
      onSuccess: () => onDone(`Akun ${user.name} berhasil dinonaktifkan.`),
    });

  return { error: errorMessage(mutation.error), loading: mutation.isPending, handleConfirm };
}
