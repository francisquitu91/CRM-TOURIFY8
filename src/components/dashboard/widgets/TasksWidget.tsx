import React from 'react';
import { CheckSquare, Clock } from 'lucide-react';
import { getTasks } from '../../../utils/storage';
import { User } from '../../../types';

interface TasksWidgetProps {
  user: User;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({ user }) => {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const userTasks = React.useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return tasks
      .filter(task => task.assignedTo === user.name && !task.completed)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 3);
  }, [tasks, user.name]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Mis Tareas Prioritarias</h3>
        <CheckSquare className="w-5 h-5 text-gray-400" />
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex items-start justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : userTasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">¡Excelente! No tienes tareas pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userTasks.map((task) => (
            <div key={task.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
              {task.description && (
                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
              )}
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                Vence: {new Date(task.dueDate).toLocaleDateString('es-CL')}
              </div>
            </div>
          ))}
          
          {tasks.filter(t => t.assignedTo === user.name && !t.completed).length > 3 && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                +{tasks.filter(t => t.assignedTo === user.name && !t.completed).length - 3} tareas más
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};