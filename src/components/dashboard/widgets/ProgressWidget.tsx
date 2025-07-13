import React, { useState, useEffect } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { getTransactions } from '../../../utils/storage';
import { MONTHLY_TARGET } from '../../../utils/constants';
import { Transaction } from '../../../types';

export const ProgressWidget: React.FC = () => {
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
  const progressPercentage = Math.min((monthlyProfit / MONTHLY_TARGET) * 100, 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Meta Mensual</h3>
            <p className="text-indigo-100">Cargando progreso...</p>
          </div>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 animate-spin" />
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-white bg-opacity-10 rounded-lg"></div>
            <div className="h-16 bg-white bg-opacity-10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Meta Mensual</h3>
          <p className="text-indigo-100">Progreso hacia los $10M CLP</p>
        </div>
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <Target className="w-6 h-6" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-indigo-100">Utilidad Actual</span>
            <span className="text-2xl font-bold">{formatCurrency(monthlyProfit)}</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-indigo-100 mt-1">
            <span>0%</span>
            <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-300" />
              <span className="text-sm text-indigo-100">Ingresos</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(monthlyIncome)}</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-red-300 transform rotate-180" />
              <span className="text-sm text-indigo-100">Gastos</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(monthlyExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};