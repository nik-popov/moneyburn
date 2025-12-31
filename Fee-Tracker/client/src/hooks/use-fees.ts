import { useQuery } from "@tanstack/react-query";
import { api, type FeeResponse } from "@shared/routes";

export function useFees() {
  return useQuery({
    queryKey: [api.fees.list.path],
    queryFn: async () => {
      const res = await fetch(api.fees.list.path);
      if (!res.ok) throw new Error("Failed to fetch fees");
      return api.fees.list.responses[200].parse(await res.json());
    },
  });
}
