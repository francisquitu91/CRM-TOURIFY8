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
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between lg:px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center space-x-4">
          <img src="https://gc.360-data.com/assets/92903/92903-H9lwwuuP42LL-thumb.png" alt="Tourify Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg bg-gray-900" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Tourify Control Center</h1>
            <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">Centro de operaciones</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-300">{user.role}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};