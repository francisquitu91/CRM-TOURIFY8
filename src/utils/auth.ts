import { User } from '../types';

// Simple user database
const USERS: User[] = [
  {
    id: '1',
    name: 'Gabriel',
    email: 'gabo@tourify.cl',
    role: 'Sales Manager'
  },
  {
    id: '2',
    name: 'Francisco',
    email: 'pancho@tourify.cl',
    role: 'Developer'
  },
  {
    id: '3',
    name: 'Agustín',
    email: 'agus@tourify.cl',
    role: 'CEO'
  }
];

// Simple password mapping (in production, use proper hashing)
const PASSWORDS: Record<string, string> = {
  'pancho@tourify.cl': 'pancho123',
  'gabo@tourify.cl': 'gabo123',
  'agus@tourify.cl': 'agus123'
};

export const authenticateUser = (email: string, password: string): User | null => {
  if (PASSWORDS[email] === password) {
    return USERS.find(user => user.email === email) || null;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const getAllUsers = (): User[] => {
  return USERS;
};