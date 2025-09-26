import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { parseCSV, Transaction } from "@/lib/finance-utils";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CSVUploadProps {
  onUpload: (transactions: Transaction[]) => void;
}

export default function CSVUpload({ onUpload }: CSVUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const transactions = parseCSV(text);
      
      if (transactions.length === 0) {
        toast({
          title: "Error",
          description: "No valid transactions found in the CSV file",
          variant: "destructive"
        });
        return;
      }

      onUpload(transactions);
      setFileName(file.name);
      
      toast({
        title: "Success",
        description: `Imported ${transactions.length} transactions from ${file.name}`
      });
    };
    
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card className="backdrop-blur-xl bg-gradient-glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Import Transactions
        </CardTitle>
        <CardDescription>
          Upload a CSV file with columns: Date, Description, Amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-8",
            "transition-all duration-200 cursor-pointer",
            "hover:border-primary/50 hover:bg-primary/5",
            isDragging && "border-primary bg-primary/10",
            fileName && "border-profit bg-profit/5"
          )}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="csv-upload"
          />
          
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              {fileName ? (
                <>
                  <CheckCircle className="w-12 h-12 text-profit" />
                  <div className="text-center">
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      File uploaded successfully
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium">Drop your CSV file here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                  </div>
                </>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                className="mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('csv-upload')?.click();
                }}
              >
                {fileName ? 'Upload Another File' : 'Select File'}
              </Button>
            </div>
          </label>
        </div>
        
        <div className="mt-4 p-3 bg-background/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Expected CSV format:</strong> Date, Description, Amount
            <br />
            Example: 2024-01-15, Grocery Store, -45.99
          </p>
        </div>
      </CardContent>
    </Card>
  );
}