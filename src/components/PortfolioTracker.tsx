import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { Investment } from "@/lib/finance-utils";
import { formatCurrency } from "@/lib/finance-utils";
import { cn } from "@/lib/utils";

interface PortfolioTrackerProps {
  investments: Investment[];
}

export default function PortfolioTracker({ investments }: PortfolioTrackerProps) {
  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.shares * inv.currentPrice,
    0
  );
  
  const totalCost = investments.reduce(
    (sum, inv) => sum + inv.shares * inv.purchasePrice,
    0
  );
  
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return (
    <Card className="backdrop-blur-xl bg-gradient-glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Investment Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent>
        {investments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No investments tracked yet
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                <p className={cn(
                  "text-xl font-bold",
                  totalGainLoss >= 0 ? "text-profit" : "text-loss"
                )}>
                  {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Return</p>
                <p className={cn(
                  "text-xl font-bold",
                  totalGainLossPercent >= 0 ? "text-profit" : "text-loss"
                )}>
                  {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {investments.map((investment) => {
                const value = investment.shares * investment.currentPrice;
                const cost = investment.shares * investment.purchasePrice;
                const gainLoss = value - cost;
                const gainLossPercent = (gainLoss / cost) * 100;
                
                return (
                  <div
                    key={investment.id}
                    className="p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{investment.symbol}</h4>
                        <Badge variant="outline" className="text-xs">
                          {investment.shares} shares
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(value)}</p>
                        <div className="flex items-center gap-1 justify-end">
                          {gainLoss >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-profit" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-loss" />
                          )}
                          <span className={cn(
                            "text-sm",
                            gainLoss >= 0 ? "text-profit" : "text-loss"
                          )}>
                            {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{investment.name}</span>
                      <span>${investment.currentPrice.toFixed(2)}/share</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}