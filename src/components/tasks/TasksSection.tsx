import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckSquare, Calendar, User, Flag } from 'lucide-react';
import { Task, Goal, User as UserType } from '../../types';
import { getTasks, setTasks, getGoals, setGoals, addTask, updateTask, deleteTask, addGoal, updateGoal, deleteGoal } from '../../utils/storage';
import { USERS_LIST, PRIORITIES } from '../../utils/constants';
import { TaskForm } from './TaskForm';
import { GoalForm } from './GoalForm';

interface TasksSectionProps {
  user: UserType;
}

export const TasksSection: React.FC<TasksSectionProps> = ({ user }) => {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [goals, setGoalsState] = useState<Goal[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedTasks, loadedGoals] = await Promise.all([
          getTasks(),
          getGoals()
        ]);
        setTasksState(loadedTasks);
        setGoalsState(loadedGoals);
        setFilteredTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading tasks and goals:', error);
        setTasksState([]);
        setGoalsState([]);
        setFilteredTasks([]);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => 
        statusFilter === 'completed' ? task.completed : !task.completed
      );
    }

    if (assignedFilter) {
      filtered = filtered.filter(task => task.assignedTo === assignedFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, assignedFilter, priorityFilter]);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const saveTask = async () => {
      try {
    if (editingTask) {
          await updateTask(editingTask.id, taskData);
    } else {
          await addTask(taskData);
    }
        
        // Reload tasks after save
        const updatedTasks = await getTasks();
        setTasksState(updatedTasks);
        setFilteredTasks(updatedTasks);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    };
    
    saveTask();
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const saveGoal = async () => {
      try {
    if (editingGoal) {
          await updateGoal(editingGoal.id, goalData);
    } else {
          await addGoal(goalData);
    }
        
        // Reload goals after save
        const updatedGoals = await getGoals();
        setGoalsState(updatedGoals);
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    };
    
    saveGoal();
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      const deleteTaskAsync = async () => {
        try {
          await deleteTask(id);
          
          // Reload tasks after delete
          const updatedTasks = await getTasks();
          setTasksState(updatedTasks);
          setFilteredTasks(updatedTasks);
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      };
      
      deleteTaskAsync();
    }
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
      const deleteGoalAsync = async () => {
        try {
          await deleteGoal(id);
          
          // Reload goals after delete
          const updatedGoals = await getGoals();
          setGoalsState(updatedGoals);
        } catch (error) {
          console.error('Error deleting goal:', error);
        }
      };
      
      deleteGoalAsync();
    }
  };

  const toggleTaskCompletion = (id: string) => {
    const toggleTask = async () => {
      try {
        const task = tasks.find(t => t.id === id);
        if (task) {
          await updateTask(id, { ...task, completed: !task.completed });
          
          // Reload tasks after update
          const updatedTasks = await getTasks();
          setTasksState(updatedTasks);
          setFilteredTasks(updatedTasks);
        }
      } catch (error) {
        console.error('Error toggling task completion:', error);
      }
    };
    
    toggleTask();
  };

  const toggleGoalCompletion = (id: string) => {
    const toggleGoal = async () => {
      try {
        const goal = goals.find(g => g.id === id);
        if (goal) {
          await updateGoal(id, { ...goal, completed: !goal.completed });
          
          // Reload goals after update
          const updatedGoals = await getGoals();
          setGoalsState(updatedGoals);
        }
      } catch (error) {
        console.error('Error toggling goal completion:', error);
      }
    };
    
    toggleGoal();
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = PRIORITIES.find(p => p.value === priority);
    return priorityObj?.color || 'text-gray-600';
  };

  const getPriorityLabel = (priority: string) => {
    const priorityObj = PRIORITIES.find(p => p.value === priority);
    return priorityObj?.label || priority;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAssignedFilter('');
    setPriorityFilter('');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  if (showTaskForm) {
    return (
      <TaskForm
        task={editingTask}
        onSave={handleSaveTask}
        onCancel={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
      />
    );
  }

  if (showGoalForm) {
    return (
      <GoalForm
        goal={editingGoal}
        onSave={handleSaveGoal}
        onCancel={() => {
          setShowGoalForm(false);
          setEditingGoal(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Tareas y Metas</h1>
          <p className="text-gray-300">Organiza el trabajo del equipo y define objetivos</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowGoalForm(true)}
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Meta</span>
          </button>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tasks'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tareas ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'goals'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Metas ({goals.length})
            </button>
          </nav>
        </div>

        {activeTab === 'tasks' && (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="completed">Completadas</option>
              </select>

              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Asignado a</option>
                {USERS_LIST.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Todas las prioridades</option>
                {PRIORITIES.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
                <p className="text-gray-500 mb-4">
                  {tasks.length === 0 
                    ? 'Comienza creando tu primera tarea'
                    : 'No se encontraron tareas con los filtros aplicados'
                  }
                </p>
                {tasks.length === 0 && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Crear Primera Tarea
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks
                  .sort((a, b) => {
                    if (a.completed !== b.completed) {
                      return a.completed ? 1 : -1;
                    }
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                  })
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        task.completed 
                          ? 'bg-gray-50 border-gray-200' 
                          : isOverdue(task.dueDate)
                          ? 'bg-red-50 border-red-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-indigo-500'
                          }`}
                        >
                          {task.completed && <CheckSquare className="w-3 h-3" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`font-medium ${
                                task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className={`text-sm mt-1 ${
                                  task.completed ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {task.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                <Flag className="w-3 h-3 inline mr-1" />
                                {getPriorityLabel(task.priority)}
                              </span>
                              
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setShowTaskForm(true);
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                              >
                                Editar
                              </button>
                              
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-400 hover:text-red-600 p-1"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{task.assignedTo}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span className={isOverdue(task.dueDate) && !task.completed ? 'text-red-600 font-medium' : ''}>
                                {new Date(task.dueDate).toLocaleDateString('es-CL')}
                                {isOverdue(task.dueDate) && !task.completed && ' (Vencida)'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="p-6">
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay metas definidas</h3>
                <p className="text-gray-500 mb-4">Comienza definiendo las metas del equipo</p>
                <button
                  onClick={() => setShowGoalForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Crear Primera Meta
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-6 border rounded-xl transition-colors ${
                      goal.completed 
                        ? 'bg-green-50 border-green-200' 
                        : isOverdue(goal.dueDate)
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className={`font-semibold ${
                        goal.completed ? 'text-green-800' : 'text-gray-900'
                      }`}>
                        {goal.title}
                      </h3>
                      
                      <button
                        onClick={() => toggleGoalCompletion(goal.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          goal.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-indigo-500'
                        }`}
                      >
                        {goal.completed && <CheckSquare className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className={`text-sm mb-4 ${
                      goal.completed ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {goal.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{goal.assignedTo}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={`${
                          isOverdue(goal.dueDate) && !goal.completed 
                            ? 'text-red-600 font-medium' 
                            : 'text-gray-600'
                        }`}>
                          {new Date(goal.dueDate).toLocaleDateString('es-CL')}
                          {isOverdue(goal.dueDate) && !goal.completed && ' (Vencida)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setShowGoalForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        Editar
                      </button>
                      
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};