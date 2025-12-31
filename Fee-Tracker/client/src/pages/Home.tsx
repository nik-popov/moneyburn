import { useFees } from "@/hooks/use-fees";
import { useLogs, useCreateLog } from "@/hooks/use-logs";
import { FeeButton } from "@/components/FeeButton";
import { RunningTab } from "@/components/RunningTab";
import { LogHistory } from "@/components/LogHistory";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Receipt } from "lucide-react";

export default function Home() {
  const { data: fees, isLoading: isLoadingFees } = useFees();
  const { data: logs, isLoading: isLoadingLogs } = useLogs();
  const createLog = useCreateLog();
  const { toast } = useToast();

  const handleFeeClick = (feeId: number, name: string, amount: number) => {
    createLog.mutate(
      { feeId, feeName: name, amount },
      {
        onSuccess: () => {
          toast({
            title: "Fee Added",
            description: `Successfully added ${name} to the tab.`,
            duration: 2000,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add fee. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoadingFees || isLoadingLogs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const totalCents = logs?.reduce((sum, log) => sum + log.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/30">
            <Receipt className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
              FeeTracker
            </h1>
            <p className="text-muted-foreground">Manage and track service fees in real-time</p>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Actions & Tab */}
          <div className="lg:col-span-7 space-y-8">
            <RunningTab totalCents={totalCents} count={logs?.length || 0} />
            
            <div>
              <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                Available Fees
                <span className="text-xs font-sans font-normal text-muted-foreground bg-white px-2 py-1 rounded-md border">
                  Click to add
                </span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fees?.map((fee) => (
                  <FeeButton
                    key={fee.id}
                    name={fee.name}
                    amount={fee.amount}
                    onClick={() => handleFeeClick(fee.id, fee.name, fee.amount)}
                    disabled={createLog.isPending}
                  />
                ))}
                
                {(!fees || fees.length === 0) && (
                  <div className="col-span-full p-8 text-center bg-white rounded-2xl border-2 border-dashed">
                    <p className="text-muted-foreground">No fee types configured yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-5">
            <LogHistory logs={logs || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
