import { supabase } from '../lib/supabase';
import { Prospect, SalesScript, Transaction, Task, Goal, CalendarEvent, Tour } from '../types';

// Prospects
export const getProspects = async (): Promise<Prospect[]> => {
  try {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return [];
    }

    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data) return [];

    return data.map(item => ({
      id: item.id,
      contactName: item.contact_name,
      company: item.company,
      phone: item.phone,
      email: item.email,
      service: item.service,
      status: item.status,
      assignedTo: item.assigned_to,
      tags: item.tags || [],
      notes: item.notes || [],
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching prospects:', error);
    return [];
  }
};

export const setProspects = async (prospects: Prospect[]): Promise<void> => {
  // This function is not needed with Supabase as we handle individual operations
  console.warn('setProspects is deprecated with Supabase. Use individual operations instead.');
};

export const addProspect = async (prospect: Omit<Prospect, 'id' | 'createdAt'>): Promise<Prospect | null> => {
  try {
    const { data, error } = await supabase
      .from('prospects')
      .insert({
        contact_name: prospect.contactName,
        company: prospect.company,
        phone: prospect.phone,
        email: prospect.email,
        service: prospect.service,
        status: prospect.status,
        assigned_to: prospect.assignedTo,
        tags: prospect.tags,
        notes: prospect.notes
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      contactName: data.contact_name,
      company: data.company,
      phone: data.phone,
      email: data.email,
      service: data.service,
      status: data.status,
      assignedTo: data.assigned_to,
      tags: data.tags || [],
      notes: data.notes || [],
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error adding prospect:', error);
    return null;
  }
};

export const updateProspect = async (id: string, prospect: Partial<Prospect>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (prospect.contactName) updateData.contact_name = prospect.contactName;
    if (prospect.company) updateData.company = prospect.company;
    if (prospect.phone) updateData.phone = prospect.phone;
    if (prospect.email) updateData.email = prospect.email;
    if (prospect.service) updateData.service = prospect.service;
    if (prospect.status) updateData.status = prospect.status;
    if (prospect.assignedTo) updateData.assigned_to = prospect.assignedTo;
    if (prospect.tags) updateData.tags = prospect.tags;
    if (prospect.notes) updateData.notes = prospect.notes;

    const { error } = await supabase
      .from('prospects')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating prospect:', error);
    return false;
  }
};

export const deleteProspect = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting prospect:', error);
    return false;
  }
};

// Sales Scripts
export const getSalesScripts = async (): Promise<SalesScript[]> => {
  try {
    const { data, error } = await supabase
      .from('sales_scripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      clientType: item.client_type,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching sales scripts:', error);
    return [];
  }
};

export const setSalesScripts = async (scripts: SalesScript[]): Promise<void> => {
  console.warn('setSalesScripts is deprecated with Supabase. Use individual operations instead.');
};

export const addSalesScript = async (script: Omit<SalesScript, 'id' | 'createdAt'>): Promise<SalesScript | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_scripts')
      .insert({
        title: script.title,
        content: script.content,
        client_type: script.clientType
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      clientType: data.client_type,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error adding sales script:', error);
    return null;
  }
};

export const updateSalesScript = async (id: string, script: Partial<SalesScript>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (script.title) updateData.title = script.title;
    if (script.content) updateData.content = script.content;
    if (script.clientType) updateData.client_type = script.clientType;

    const { error } = await supabase
      .from('sales_scripts')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating sales script:', error);
    return false;
  }
};

export const deleteSalesScript = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sales_scripts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting sales script:', error);
    return false;
  }
};

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      type: item.type as 'income' | 'expense',
      amount: Number(item.amount),
      category: item.category,
      description: item.description,
      date: item.date,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const setTransactions = async (transactions: Transaction[]): Promise<void> => {
  console.warn('setTransactions is deprecated with Supabase. Use individual operations instead.');
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      type: data.type as 'income' | 'expense',
      amount: Number(data.amount),
      category: data.category,
      description: data.description,
      date: data.date,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return null;
  }
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (transaction.type) updateData.type = transaction.type;
    if (transaction.amount) updateData.amount = transaction.amount;
    if (transaction.category) updateData.category = transaction.category;
    if (transaction.description) updateData.description = transaction.description;
    if (transaction.date) updateData.date = transaction.date;

    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating transaction:', error);
    return false;
  }
};

export const deleteTransaction = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
};

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      assignedTo: item.assigned_to,
      dueDate: item.due_date,
      priority: item.priority as 'high' | 'medium' | 'low',
      completed: item.completed,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const setTasks = async (tasks: Task[]): Promise<void> => {
  console.warn('setTasks is deprecated with Supabase. Use individual operations instead.');
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        assigned_to: task.assignedTo,
        due_date: task.dueDate,
        priority: task.priority,
        completed: task.completed
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      assignedTo: data.assigned_to,
      dueDate: data.due_date,
      priority: data.priority as 'high' | 'medium' | 'low',
      completed: data.completed,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (task.title) updateData.title = task.title;
    if (task.description !== undefined) updateData.description = task.description;
    if (task.assignedTo) updateData.assigned_to = task.assignedTo;
    if (task.dueDate) updateData.due_date = task.dueDate;
    if (task.priority) updateData.priority = task.priority;
    if (task.completed !== undefined) updateData.completed = task.completed;

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

// Goals
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      assignedTo: item.assigned_to,
      dueDate: item.due_date,
      completed: item.completed,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};

export const setGoals = async (goals: Goal[]): Promise<void> => {
  console.warn('setGoals is deprecated with Supabase. Use individual operations instead.');
};

export const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal | null> => {
  try {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        title: goal.title,
        description: goal.description,
        assigned_to: goal.assignedTo,
        due_date: goal.dueDate,
        completed: goal.completed
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      assignedTo: data.assigned_to,
      dueDate: data.due_date,
      completed: data.completed,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error adding goal:', error);
    return null;
  }
};

export const updateGoal = async (id: string, goal: Partial<Goal>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (goal.title) updateData.title = goal.title;
    if (goal.description) updateData.description = goal.description;
    if (goal.assignedTo) updateData.assigned_to = goal.assignedTo;
    if (goal.dueDate) updateData.due_date = goal.dueDate;
    if (goal.completed !== undefined) updateData.completed = goal.completed;

    const { error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating goal:', error);
    return false;
  }
};

export const deleteGoal = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    return false;
  }
};

// Calendar Events
export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      type: item.type as 'tarea' | 'ingreso' | 'gasto' | 'reunion',
      title: item.title,
      start: new Date(item.start_date),
      end: new Date(item.end_date),
      description: item.description || undefined,
      related: item.related || undefined
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

export const setCalendarEvents = async (events: CalendarEvent[]): Promise<void> => {
  console.warn('setCalendarEvents is deprecated with Supabase. Use individual operations instead.');
};

export const addCalendarEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        type: event.type,
        title: event.title,
        start_date: event.start.toISOString(),
        end_date: event.end.toISOString(),
        description: event.description || null,
        related: event.related || null
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      type: data.type as 'tarea' | 'ingreso' | 'gasto' | 'reunion',
      title: data.title,
      start: new Date(data.start_date),
      end: new Date(data.end_date),
      description: data.description || undefined,
      related: data.related || undefined
    };
  } catch (error) {
    console.error('Error adding calendar event:', error);
    return null;
  }
};

export const updateCalendarEvent = async (id: number, event: Partial<CalendarEvent>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (event.type) updateData.type = event.type;
    if (event.title) updateData.title = event.title;
    if (event.start) updateData.start_date = event.start.toISOString();
    if (event.end) updateData.end_date = event.end.toISOString();
    if (event.description !== undefined) updateData.description = event.description || null;
    if (event.related !== undefined) updateData.related = event.related || null;

    const { error } = await supabase
      .from('calendar_events')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return false;
  }
};

export const deleteCalendarEvent = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return false;
  }
};

// Tours
export const getTours = async (): Promise<Tour[]> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
};

export const addTour = async (tour: Omit<Tour, 'id' | 'created_at'>): Promise<Tour | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .insert({
        url: tour.url,
        title: tour.title,
        label: tour.label
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      url: data.url,
      title: data.title,
      label: data.label,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error adding tour:', error);
    return null;
  }
};

export const updateTour = async (id: string, tour: Partial<Tour>): Promise<boolean> => {
  try {
    const updateData: any = {};
    if (tour.url) updateData.url = tour.url;
    if (tour.title) updateData.title = tour.title;
    if (tour.label) updateData.label = tour.label;

    const { error } = await supabase
      .from('tours')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating tour:', error);
    return false;
  }
};

export const deleteTour = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting tour:', error);
    return false;
  }
};

// Legacy functions for backward compatibility
export const getStorageData = <T>(key: string): T[] => {
  console.warn(`getStorageData(${key}) is deprecated. Use specific Supabase functions instead.`);
  return [];
};

export const setStorageData = <T>(key: string, data: T[]): void => {
  console.warn(`setStorageData(${key}) is deprecated. Use specific Supabase functions instead.`);
};