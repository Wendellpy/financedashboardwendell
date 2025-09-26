import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, TrendingUp } from "lucide-react";
import { FinancialGoal } from "@/lib/finance-utils";
import { formatCurrency } from "@/lib/finance-utils";
import { cn } from "@/lib/utils";

interface GoalsTrackerProps {
  goals: FinancialGoal[];
}

export default function GoalsTracker({ goals }: GoalsTrackerProps) {
  return (
    <Card className="backdrop-blur-xl bg-gradient-glass border-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Financial Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No goals set yet. Start planning your financial future!
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div
                  key={goal.id}
                  className={cn(
                    "p-4 rounded-lg bg-background/50",
                    "hover:bg-background/70 transition-all duration-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {progress.toFixed(0)}% complete
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}