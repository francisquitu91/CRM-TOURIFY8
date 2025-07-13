import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { getTransactions } from '../../../utils/storage';
import { Transaction } from '../../../types';

export const FinancesWidget: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyProfit = monthlyIncome - monthlyExpenses;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Finanzas del Mes</h3>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Finanzas del Mes</h3>
        <DollarSign className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Ingresos</span>
            </div>
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(monthlyIncome)}
            </p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">Gastos</span>
            </div>
            <p className="text-lg font-bold text-red-900">
              {formatCurrency(monthlyExpenses)}
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-indigo-900">Utilidad Neta</span>
            <span className={`text-xl font-bold ${monthlyProfit >= 0 ? 'text-indigo-900' : 'text-red-600'}`}>
              {formatCurrency(monthlyProfit)}
            </span>
          </div>
        </div>
        
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {monthlyTransactions.length} transacciones este mes
          </p>
        </div>
      </div>
    </div>
  );
};