import { useState, useEffect } from "react";
import MetricCard from "@/components/MetricCard";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import CashFlowChart from "@/components/CashFlowChart";
import CategoryChart from "@/components/CategoryChart";
import GoalsTracker from "@/components/GoalsTracker";
import CSVUpload from "@/components/CSVUpload";
import PortfolioTracker from "@/components/PortfolioTracker";
import { 
  Transaction, 
  Investment, 
  FinancialGoal,
  calculateMonthlyCashFlow,
  calculateNetWorth,
  formatCurrency,
  formatPercentage
} from "@/lib/finance-utils";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  PiggyBank,
  BarChart3
} from "lucide-react";
import heroBackground from "@/assets/finance-hero-bg.jpg";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([
    // Sample investment data
    {
      id: 'inv-1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      purchasePrice: 150,
      currentPrice: 175
    },
    {
      id: 'inv-2',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 5,
      purchasePrice: 2800,
      currentPrice: 2950
    }
  ]);
  
  const [goals] = useState<FinancialGoal[]>([
    {
      id: 'goal-1',
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2024-12-31'
    },
    {
      id: 'goal-2',
      name: 'Vacation Fund',
      targetAmount: 5000,
      currentAmount: 2000,
      deadline: '2024-06-30'
    },
    {
      id: 'goal-3',
      name: 'Down Payment',
      targetAmount: 50000,
      currentAmount: 15000,
      deadline: '2025-12-31'
    }
  ]);

  // Calculate metrics
  const cashFlow = calculateMonthlyCashFlow(transactions);
  const netWorth = calculateNetWorth(25000, 5000, investments); // Example assets and liabilities
  const savingsRate = cashFlow.income > 0 ? (cashFlow.net / cashFlow.income) : 0;

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleCSVUpload = (newTransactions: Transaction[]) => {
    setTransactions([...transactions, ...newTransactions]);
  };

  // Simulate price updates for investments
  useEffect(() => {
    const interval = setInterval(() => {
      setInvestments(prev => prev.map(inv => ({
        ...inv,
        currentPrice: inv.currentPrice * (1 + (Math.random() - 0.5) * 0.01)
      })));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark relative">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Personal Finance Dashboard
                </h1>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Net Worth"
              value={formatCurrency(netWorth)}
              change={8.5}
              changeLabel="vs last month"
              icon={<Wallet className="w-5 h-5" />}
              variant="default"
            />
            <MetricCard
              title="Monthly Income"
              value={formatCurrency(cashFlow.income)}
              change={12.3}
              changeLabel="vs last month"
              icon={<DollarSign className="w-5 h-5" />}
              variant="profit"
            />
            <MetricCard
              title="Monthly Expenses"
              value={formatCurrency(cashFlow.expenses)}
              change={-5.2}
              changeLabel="vs last month"
              icon={<TrendingUp className="w-5 h-5" />}
              variant="loss"
            />
            <MetricCard
              title="Savings Rate"
              value={formatPercentage(savingsRate)}
              change={savingsRate > 0.2 ? 15 : -10}
              icon={<PiggyBank className="w-5 h-5" />}
              variant={savingsRate > 0.2 ? "profit" : "default"}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              <CSVUpload onUpload={handleCSVUpload} />
              <TransactionForm onAddTransaction={handleAddTransaction} />
            </div>

            {/* Middle Column - Transaction List */}
            <div>
              <TransactionList transactions={transactions} />
            </div>

            {/* Right Column - Goals */}
            <div>
              <GoalsTracker goals={goals} />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CashFlowChart transactions={transactions} />
            <PortfolioTracker investments={investments} />
          </div>

          {/* Category Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart transactions={transactions} type="expense" />
            <CategoryChart transactions={transactions} type="income" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;