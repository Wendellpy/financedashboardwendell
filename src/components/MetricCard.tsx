import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'profit' | 'loss';
  className?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  className
}: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={cn(
      "relative overflow-hidden backdrop-blur-xl bg-gradient-glass border-border/50",
      "transition-all duration-300 hover:shadow-glow hover:scale-[1.02]",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              variant === 'profit' && "bg-profit/20 text-profit",
              variant === 'loss' && "bg-loss/20 text-loss",
              variant === 'default' && "bg-primary/20 text-primary"
            )}>
              {icon}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className={cn(
            "text-3xl font-bold tracking-tight",
            variant === 'profit' && "text-profit",
            variant === 'loss' && "text-loss"
          )}>
            {value}
          </h2>
          
          {change !== undefined && (
            <div className="flex items-center gap-2">
              {isPositive && <TrendingUp className="w-4 h-4 text-profit" />}
              {isNegative && <TrendingDown className="w-4 h-4 text-loss" />}
              <span className={cn(
                "text-sm font-medium",
                isPositive && "text-profit",
                isNegative && "text-loss",
                !isPositive && !isNegative && "text-muted-foreground"
              )}>
                {isPositive && '+'}
                {change.toFixed(1)}%
              </span>
              {changeLabel && (
                <span className="text-sm text-muted-foreground">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-5 pointer-events-none",
        variant === 'profit' && "bg-gradient-profit",
        variant === 'loss' && "bg-gradient-loss",
        variant === 'default' && "bg-gradient-primary"
      )} />
    </Card>
  );
}