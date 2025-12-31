import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface FeeButtonProps {
  name: string;
  amount: number; // in cents
  onClick: () => void;
  disabled?: boolean;
}

export function FeeButton({ name, amount, onClick, disabled }: FeeButtonProps) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      onClick={onClick}
      className={`
        relative overflow-hidden w-full p-6 text-left rounded-2xl
        bg-white border-2 border-transparent
        shadow-lg shadow-indigo-500/5 
        hover:shadow-xl hover:shadow-indigo-500/10 hover:border-primary/20
        disabled:opacity-50 disabled:cursor-not-allowed
        group transition-all duration-300
      `}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Plus className="w-12 h-12 text-primary rotate-12" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Add Fee
        </span>
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <span className="text-2xl font-display font-bold text-primary mt-2">
          {formattedAmount}
        </span>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}
