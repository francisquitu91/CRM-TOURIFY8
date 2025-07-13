import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { User as UserType } from '../../types';
import { logout } from '../../utils/auth';

interface HeaderProps {
  user: UserType;
  onMenuToggle: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onMenuToggle, onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-4">
          <img src="https://gc.360-data.com/assets/92903/92903-H9lwwuuP42LL-thumb.png" alt="Tourify Logo" className="w-10 h-10 rounded-full shadow-lg bg-white dark:bg-gray-900" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tourify Control Center</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">Centro de operaciones</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};