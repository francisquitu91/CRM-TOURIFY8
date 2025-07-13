export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

export interface Prospect {
  id: string;
  contactName: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  status: string;
  assignedTo: string;
  tags: string[];
  notes: { date: string; content: string }[];
  createdAt: string;
}

export interface SalesScript {
  id: string;
  title: string;
  content: string;
  clientType: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: number;
  type: 'tarea' | 'ingreso' | 'gasto' | 'reunion';
  title: string;
  start: Date;
  end: Date;
  description?: string;
  related?: string;
}

export interface Tour {
  id: string;
  url: string;
  title: string;
  label: string;
  created_at: string;
}