import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, FileText } from "lucide-react";
import { Transaction } from "@/lib/finance-utils";
import { formatCurrency } from "@/lib/finance-utils";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="backdrop-blur-xl bg-gradient-glass border-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Add one to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    "bg-background/50 hover:bg-background/70",
                    "transition-all duration-200 hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      transaction.type === 'income' 
                        ? "bg-profit/20 text-profit" 
                        : "bg-loss/20 text-loss"
                    )}>
                      {transaction.type === 'income' ? (
                        <ArrowDownCircle className="w-5 h-5" />
                      ) : (
                        <ArrowUpCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={cn(
                    "font-semibold text-lg",
                    transaction.type === 'income' ? "text-profit" : "text-loss"
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}