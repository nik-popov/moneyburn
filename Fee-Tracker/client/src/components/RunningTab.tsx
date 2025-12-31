import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";

interface RunningTabProps {
  totalCents: number;
  count: number;
}

export function RunningTab({ totalCents, count }: RunningTabProps) {
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalCents / 100);

  return (
    <div className="glass-panel rounded-3xl p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <DollarSign className="w-48 h-48 -rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary font-medium">
            <TrendingUp className="w-5 h-5" />
            <span>Current Session</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Running Tab
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            {count} {count === 1 ? 'fee' : 'fees'} logged today
          </p>
        </div>

        <div className="text-right">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={totalCents}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-6xl md:text-7xl font-display font-bold text-primary tabular-nums tracking-tight"
            >
              {formattedTotal}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
