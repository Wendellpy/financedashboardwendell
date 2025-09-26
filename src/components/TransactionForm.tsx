import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/finance-utils";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const { toast } = useToast();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    amount: ''
  });

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.category || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      date: formData.date,
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      type
    };

    onAddTransaction(transaction);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      amount: ''
    });

    toast({
      title: "Success",
      description: "Transaction added successfully"
    });
  };

  return (
    <Card className="backdrop-blur-xl bg-gradient-glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => {
                setType(value as 'income' | 'expense');
                setFormData({ ...formData, category: '' });
              }}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="cursor-pointer">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-background/50"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="bg-background/50"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background/50"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}