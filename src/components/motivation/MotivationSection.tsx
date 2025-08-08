import React, { useState, useEffect } from 'react';
import { Target, Calendar, Trophy, Zap, TrendingUp, Star, Award, Flame } from 'lucide-react';
import { getTransactions, getTasks, getGoals, getProspects } from '../../utils/storage';
import { MONTHLY_TARGET, MOTIVATIONAL_QUOTES } from '../../utils/constants';

export const MotivationSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentQuote, setCurrentQuote] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsData, tasksData, goalsData, prospectsData] = await Promise.all([
          getTransactions(),
          getTasks(),
          getGoals(),
          getProspects()
        ]);
        
        setTransactions(transactionsData);
        setTasks(tasksData);
        setGoals(goalsData);
        setProspects(prospectsData);
        
        // Calculate achievements with loaded data
        calculateAchievements(transactionsData, tasksData, goalsData, prospectsData);
      } catch (error) {
        console.error('Error loading motivation data:', error);
        setTransactions([]);
        setTasks([]);
        setGoals([]);
        setProspects([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Set random quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setCurrentQuote(randomQuote);

    // Calculate time left (6 months from now)
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 6);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Load data
    loadData();

    return () => clearInterval(interval);
  }, []);

  const calculateAchievements = (transactionsData: any[], tasksData: any[], goalsData: any[], prospectsData: any[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactionsData.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const completedTasks = tasksData.filter(t => t.completed).length;
    const completedGoals = goalsData.filter(g => g.completed).length;
    const wonProspects = prospectsData.filter(p => p.status === 'Ganado').length;
    
    const newAchievements: string[] = [];
    
    if (monthlyIncome >= MONTHLY_TARGET) {
      newAchievements.push('🎯 Meta mensual alcanzada');
    }
    
    if (monthlyIncome >= MONTHLY_TARGET * 0.5) {
      newAchievements.push('💪 50% de la meta completada');
    }
    
    if (completedTasks >= 10) {
      newAchievements.push('✅ 10+ tareas completadas');
    }
    
    if (completedGoals >= 1) {
      newAchievements.push('🏆 Meta del equipo lograda');
    }
    
    if (wonProspects >= 5) {
      newAchievements.push('🎉 5+ prospectos ganados');
    }
    
    if (prospectsData.length >= 20) {
      newAchievements.push('📈 20+ prospectos registrados');
    }
    
    setAchievements(newAchievements);
  };

  const getStats = () => {
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
    
    return {
      monthlyProfit,
      progressPercentage,
      completedTasks: tasks.filter(t => t.completed).length,
      totalTasks: tasks.length,
      completedGoals: goals.filter(g => g.completed).length,
      totalGoals: goals.length,
      wonProspects: prospects.filter(p => p.status === 'Ganado').length,
      totalProspects: prospects.length
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Motivacional 🚀</h1>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="bg-gray-200 rounded-2xl h-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Panel Motivacional 🚀</h1>
        <p className="text-gray-300">Mantén al equipo enfocado y con energía hacia el objetivo</p>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Target className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Tiempo Restante para la Meta</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <div className="text-3xl font-bold">{timeLeft.days}</div>
            <div className="text-sm opacity-80">Días</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <div className="text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm opacity-80">Horas</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <div className="text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm opacity-80">Minutos</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <div className="text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm opacity-80">Segundos</div>
          </div>
        </div>
        
        <p className="text-lg opacity-90">
          ¡Cada segundo cuenta para alcanzar los $10.000.000 CLP mensuales!
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.progressPercentage.toFixed(1)}%</span>
          </div>
          <h3 className="font-semibold mb-1">Progreso Meta</h3>
          <p className="text-green-100 text-sm">{formatCurrency(stats.monthlyProfit)} de {formatCurrency(MONTHLY_TARGET)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.wonProspects}</span>
          </div>
          <h3 className="font-semibold mb-1">Prospectos Ganados</h3>
          <p className="text-blue-100 text-sm">de {stats.totalProspects} totales</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.completedTasks}</span>
          </div>
          <h3 className="font-semibold mb-1">Tareas Completadas</h3>
          <p className="text-purple-100 text-sm">de {stats.totalTasks} totales</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.completedGoals}</span>
          </div>
          <h3 className="font-semibold mb-1">Metas Logradas</h3>
          <p className="text-orange-100 text-sm">de {stats.totalGoals} totales</p>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Flame className="w-6 h-6" />
            <h3 className="text-xl font-bold">🏆 Logros Desbloqueados</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                <span className="font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Zap className="w-6 h-6" />
          <h3 className="text-xl font-bold">Frase Inspiradora del Día</h3>
        </div>
        <blockquote className="text-lg italic mb-4">
          "{currentQuote}"
        </blockquote>
        <button
          onClick={() => {
            const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
            setCurrentQuote(randomQuote);
          }}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
        >
          Nueva Frase
        </button>
      </div>

      {/* Team Goals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">Objetivos del Equipo</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Gabriel</h4>
            <p className="text-sm text-gray-600">Cerrar 3 nuevos colegios antes del 30 de junio</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💻</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Francisco</h4>
            <p className="text-sm text-gray-600">Completar prototipo funcional y curso de 3DVista</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Agustín</h4>
            <p className="text-sm text-gray-600">2 contratos Masterplan y estrategia marketing Q3</p>
          </div>
        </div>
      </div>

      {/* Success Celebration */}
      {stats.progressPercentage >= 100 && (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-8 text-white text-center animate-pulse">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">¡FELICITACIONES!</h2>
          <p className="text-xl mb-4">¡Han alcanzado la meta mensual de $10.000.000 CLP!</p>
          <div className="text-4xl">🏆 🎊 🚀</div>
        </div>
      )}
    </div>
  );
};