import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateLogInput } from "@shared/routes";

export function useLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path);
      if (!res.ok) throw new Error("Failed to fetch logs");
      // Sort logs by timestamp descending (newest first)
      const logs = api.logs.list.responses[200].parse(await res.json());
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateLogInput) => {
      const res = await fetch(api.logs.create.path, {
        method: api.logs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create log entry");
      }
      
      return api.logs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
    },
  });
}

export function useDeleteLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (logId: number) => {
      const path = api.logs.delete.path.replace(':id', String(logId));
      const res = await fetch(path, {
        method: api.logs.delete.method,
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete log entry");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
    },
  });
}
