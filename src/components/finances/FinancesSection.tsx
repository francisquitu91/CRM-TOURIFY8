import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download } from 'lucide-react';
import { Transaction } from '../../types';
import { getTransactions, setTransactions, addTransaction, updateTransaction, deleteTransaction } from '../../utils/storage';
import { TRANSACTION_CATEGORIES, MONTHLY_TARGET } from '../../utils/constants';
import { TransactionForm } from './TransactionForm';
import { FinancialCharts } from './FinancialCharts';

export const FinancesSection: React.FC = () => {
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const loadedTransactions = await getTransactions();
        setTransactionsState(loadedTransactions);
        setFilteredTransactions(loadedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactionsState([]);
        setFilteredTransactions([]);
      }
    };
    
    loadTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        if (viewMode === 'monthly') {
          const transactionMonth = transactionDate.toISOString().substring(0, 7);
          return transactionMonth === dateFilter;
        } else {
          const transactionYear = transactionDate.getFullYear().toString();
          return transactionYear === dateFilter;
        }
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, typeFilter, categoryFilter, dateFilter, viewMode]);

  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const saveTransaction = async () => {
      try {
    if (editingTransaction) {
          await updateTransaction(editingTransaction.id, transactionData);
    } else {
          await addTransaction(transactionData);
    }
        
        // Reload transactions after save
        const updatedTransactions = await getTransactions();
        setTransactionsState(updatedTransactions);
        setFilteredTransactions(updatedTransactions);
      } catch (error) {
        console.error('Error saving transaction:', error);
      }
    };
    
    saveTransaction();
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      const deleteTransactionAsync = async () => {
        try {
          await deleteTransaction(id);
          
          // Reload transactions after delete
          const updatedTransactions = await getTransactions();
          setTransactionsState(updatedTransactions);
          setFilteredTransactions(updatedTransactions);
        } catch (error) {
          console.error('Error deleting transaction:', error);
        }
      };
      
      deleteTransactionAsync();
    }
  };

  const calculateKPIs = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    let periodTransactions;
    if (viewMode === 'monthly') {
      periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      });
    } else {
      periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === currentYear;
      });
    }
    
    const totalIncome = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netProfit = totalIncome - totalExpenses;
    const target = viewMode === 'monthly' ? MONTHLY_TARGET : MONTHLY_TARGET * 12;
    const progressPercentage = Math.min((netProfit / target) * 100, 100);

    return { totalIncome, totalExpenses, netProfit, progressPercentage, target };
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('');
    setDateFilter('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const kpis = calculateKPIs();

  if (showForm) {
    return (
      <TransactionForm
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        onCancel={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Control Financiero</h1>
          <p className="text-gray-300">Gestiona ingresos, gastos y monitorea el progreso hacia tu meta</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'monthly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setViewMode('annual')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'annual' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Anual
            </button>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Transacción</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm">Ingresos {viewMode === 'monthly' ? 'del Mes' : 'del Año'}</p>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(kpis.totalIncome)}</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-xs sm:text-sm">Gastos {viewMode === 'monthly' ? 'del Mes' : 'del Año'}</p>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(kpis.totalExpenses)}</p>
            </div>
            <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs sm:text-sm">Utilidad Neta</p>
              <p className="text-lg sm:text-2xl font-bold">{formatCurrency(kpis.netProfit)}</p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm">Progreso Meta</p>
              <p className="text-lg sm:text-2xl font-bold">{kpis.progressPercentage.toFixed(1)}%</p>
            </div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold">{Math.round(kpis.progressPercentage)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <FinancialCharts transactions={transactions} viewMode={viewMode} />

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
            className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
          >
            <option value="all">Todos los tipos</option>
            <option value="income">Solo Ingresos</option>
            <option value="expense">Solo Gastos</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
          >
            <option value="">Todas las categorías</option>
            {typeFilter === 'income' || typeFilter === 'all' ? (
              <optgroup label="Ingresos">
                {TRANSACTION_CATEGORIES.income.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </optgroup>
            ) : null}
            {typeFilter === 'expense' || typeFilter === 'all' ? (
              <optgroup label="Gastos">
                {TRANSACTION_CATEGORIES.expense.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </optgroup>
            ) : null}
          </select>

          <input
            type={viewMode === 'monthly' ? 'month' : 'number'}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder={viewMode === 'monthly' ? 'Seleccionar mes' : 'Año (ej: 2024)'}
            min={viewMode === 'annual' ? '2020' : undefined}
            max={viewMode === 'annual' ? '2030' : undefined}
            className="px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
          />

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              {filteredTransactions.length} de {transactions.length} transacciones
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No hay transacciones</h3>
            <p className="text-gray-400 mb-4">
              {transactions.length === 0 
                ? 'Comienza registrando tu primera transacción'
                : 'No se encontraron transacciones con los filtros aplicados'
              }
            </p>
            {transactions.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Registrar Transacción
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Categoría
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-700">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-white">
                            {new Date(transaction.date).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">
                        {transaction.category}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingTransaction(transaction);
                              setShowForm(true);
                            }}
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netProfit = totalIncome - totalExpenses;
    const progressPercentage = Math.min((netProfit / MONTHLY_TARGET) * 100, 100);

    return { totalIncome, totalExpenses, netProfit, progressPercentage };
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        t.type === 'income' ? 'Ingreso' : 'Gasto',
        t.category,
        `"${t.description}"`,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transacciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('');
    setMonthFilter('');
  };

  const kpis = calculateKPIs();

  if (showForm) {
    return (
      <TransactionForm
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        onCancel={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control Financiero</h1>
          <p className="text-gray-600">Gestiona ingresos, gastos y monitorea el progreso hacia tu meta</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Transacción</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Ingresos del Mes</p>
              <p className="text-2xl font-bold">{formatCurrency(kpis.totalIncome)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Gastos del Mes</p>
              <p className="text-2xl font-bold">{formatCurrency(kpis.totalExpenses)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Utilidad Neta</p>
              <p className="text-2xl font-bold">{formatCurrency(kpis.netProfit)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Progreso Meta</p>
              <p className="text-2xl font-bold">{kpis.progressPercentage.toFixed(1)}%</p>
            </div>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{Math.round(kpis.progressPercentage)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <FinancialCharts transactions={transactions} />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="income">Solo Ingresos</option>
            <option value="expense">Solo Gastos</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {typeFilter === 'income' || typeFilter === 'all' ? (
              <optgroup label="Ingresos">
                {TRANSACTION_CATEGORIES.income.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </optgroup>
            ) : null}
            {typeFilter === 'expense' || typeFilter === 'all' ? (
              <optgroup label="Gastos">
                {TRANSACTION_CATEGORIES.expense.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </optgroup>
            ) : null}
          </select>

          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {filteredTransactions.length} de {transactions.length} transacciones
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay transacciones</h3>
            <p className="text-gray-500 mb-4">
              {transactions.length === 0 
                ? 'Comienza registrando tu primera transacción'
                : 'No se encontraron transacciones con los filtros aplicados'
              }
            </p>
            {transactions.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Registrar Transacción
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingTransaction(transaction);
                              setShowForm(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};