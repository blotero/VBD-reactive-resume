import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/client/libs/query-client";
import { useAuthStore } from "@/client/stores/auth";

export const useLogout = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    error,
    isPending: loading,
    mutateAsync: logoutFn,
  } = useMutation({
    mutationFn: async () => {
      setUser(null);
      queryClient.clear();
    },
  });

  return { logout: logoutFn, loading, error };
};
