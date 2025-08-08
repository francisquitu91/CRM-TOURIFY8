import React from 'react';
import { User } from '../../types';
import { ProgressWidget } from './widgets/ProgressWidget';
import { TasksWidget } from './widgets/TasksWidget';
import { ProspectsWidget } from './widgets/ProspectsWidget';
import { FinancesWidget } from './widgets/FinancesWidget';
import { MotivationalWidget } from './widgets/MotivationalWidget';

interface DashboardProps {
  user: User;
  onQuickAction?: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onQuickAction }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            ¡Bienvenido, {user.name}! 👋
          </h1>
          <p className="text-gray-300">
            Aquí tienes un resumen de todo lo importante para hoy
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ProgressWidget />
        </div>
        <div>
          <MotivationalWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksWidget user={user} />
        <ProspectsWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancesWidget />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-left"
              onClick={() => onQuickAction && onQuickAction('prospects')}
            >
              <div className="text-sm font-medium text-indigo-900">Nuevo Prospecto</div>
              <div className="text-xs text-indigo-600">Agregar cliente potencial</div>
            </button>
            <button
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
              onClick={() => onQuickAction && onQuickAction('finances')}
            >
              <div className="text-sm font-medium text-green-900">Registrar Venta</div>
              <div className="text-xs text-green-600">Añadir ingreso</div>
            </button>
            <button
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
              onClick={() => onQuickAction && onQuickAction('tasks')}
            >
              <div className="text-sm font-medium text-purple-900">Nueva Tarea</div>
              <div className="text-xs text-purple-600">Crear recordatorio</div>
            </button>
            <button
              className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
              onClick={() => onQuickAction && onQuickAction('scripts')}
            >
              <div className="text-sm font-medium text-orange-900">Ver Scripts</div>
              <div className="text-xs text-orange-600">Biblioteca de ventas</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};