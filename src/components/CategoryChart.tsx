import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChartIcon } from "lucide-react";
import { Transaction } from "@/lib/finance-utils";

interface CategoryChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
}

export default function CategoryChart({ transactions, type }: CategoryChartProps) {
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--primary))',
    'hsl(var(--accent))',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="backdrop-blur-xl bg-gradient-glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          {type === 'income' ? 'Income' : 'Expense'} Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No {type} data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}