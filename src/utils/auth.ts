import { User } from '../types';

// Simple user database
const USERS: User[] = [
  {
    id: '1',
    name: 'Gabriel',
    username: 'gabo',
    role: 'Sales Manager'
  },
  {
    id: '2',
    name: 'Francisco',
    username: 'pancho',
    role: 'Developer'
  },
  {
    id: '3',
    name: 'Agustín',
    username: 'agus',
    role: 'CEO'
  }
];

// Simple password mapping (in production, use proper hashing)
const PASSWORDS: Record<string, string> = {
  'gabo': 'gabo123',
  'pancho': 'pancho123',
  'agus': 'agus123'
};

export const authenticateUser = (username: string, password: string): User | null => {
  if (PASSWORDS[username] === password) {
    return USERS.find(user => user.username === username) || null;
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