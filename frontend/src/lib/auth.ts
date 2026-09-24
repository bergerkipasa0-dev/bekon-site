import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./api";
import type { AdminUser } from "./types";

export function useAdmin() {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: () => apiGet<AdminUser>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
