import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, DollarSign, Trash2 } from "lucide-react";
import type { LogResponse } from "@shared/routes";
import { useDeleteLog } from "@/hooks/use-logs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface LogHistoryProps {
  logs: LogResponse[];
}

export function LogHistory({ logs }: LogHistoryProps) {
  const deleteLog = useDeleteLog();
  const { toast } = useToast();

  const handleDelete = (logId: number, feeName: string) => {
    deleteLog.mutate(logId, {
      onSuccess: () => {
        toast({
          title: "Fee Removed",
          description: `${feeName} has been removed from the tab.`,
          duration: 2000,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to remove fee. Please try again.",
          variant: "destructive",
        });
      },
    });
  };
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl bg-muted/30 border-2 border-dashed border-muted-foreground/20">
        <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium text-foreground">No History Yet</h3>
        <p className="text-muted-foreground">Start clicking buttons to add fees</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-display font-bold text-xl text-foreground">Transaction History</h3>
        <span className="text-xs font-medium bg-secondary px-2.5 py-1 rounded-full text-secondary-foreground">
          {logs.length} Entries
        </span>
      </div>
      
      <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto scrollbar-hide">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{log.feeName}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {format(new Date(log.timestamp), "MMM d, h:mm:ss a")}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-mono font-medium text-foreground">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(log.amount / 100)}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(log.id, log.feeName)}
                disabled={deleteLog.isPending}
                data-testid={`button-delete-log-${log.id}`}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
