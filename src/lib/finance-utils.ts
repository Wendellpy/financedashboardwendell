export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food & Dining',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Rental',
  'Other'
];

export function categorizeTransaction(description: string): string {
  const desc = description.toLowerCase();
  
  // Simple keyword-based categorization
  if (desc.includes('rent') || desc.includes('mortgage')) return 'Housing';
  if (desc.includes('uber') || desc.includes('gas') || desc.includes('parking')) return 'Transportation';
  if (desc.includes('restaurant') || desc.includes('food') || desc.includes('grocery')) return 'Food & Dining';
  if (desc.includes('amazon') || desc.includes('store')) return 'Shopping';
  if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('movie')) return 'Entertainment';
  if (desc.includes('electric') || desc.includes('water') || desc.includes('internet')) return 'Bills & Utilities';
  if (desc.includes('doctor') || desc.includes('pharmacy') || desc.includes('hospital')) return 'Healthcare';
  if (desc.includes('tuition') || desc.includes('course') || desc.includes('school')) return 'Education';
  if (desc.includes('flight') || desc.includes('hotel') || desc.includes('airbnb')) return 'Travel';
  
  return 'Other';
}

export function parseCSV(csvText: string): Transaction[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  const transactions: Transaction[] = [];
  
  // Skip header if exists
  const startIndex = lines[0].toLowerCase().includes('date') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim());
    if (parts.length >= 3) {
      const amount = parseFloat(parts[2]);
      const description = parts[1];
      
      transactions.push({
        id: `txn-${Date.now()}-${i}`,
        date: parts[0],
        description: description,
        category: categorizeTransaction(description),
        amount: Math.abs(amount),
        type: amount > 0 ? 'income' : 'expense'
      });
    }
  }
  
  return transactions;
}

export function calculateNetWorth(
  assets: number,
  liabilities: number,
  investments: Investment[]
): number {
  const investmentValue = investments.reduce(
    (sum, inv) => sum + (inv.shares * inv.currentPrice),
    0
  );
  return assets + investmentValue - liabilities;
}

export function calculateMonthlyCashFlow(transactions: Transaction[]): {
  income: number;
  expenses: number;
  net: number;
} {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return {
    income,
    expenses,
    net: income - expenses
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}