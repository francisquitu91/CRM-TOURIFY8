import React, { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { authenticateUser, setCurrentUser } from '../../utils/auth';
import { User } from '../../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = authenticateUser(username, password);
    
    if (user) {
      setCurrentUser(user);
      onLogin(user);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
    
    setIsLoading(false);
  };

  const quickLogin = async (user: string) => {
    setUsername(user);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Tourify Control Center</h1>
            <p className="text-gray-300 text-sm sm:text-base">Ingresa para acceder al centro de control</p>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-3 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2">
              {[
                { user: 'gabo', name: 'Gabo', role: 'Sales' },
                { user: 'pancho', name: 'Pancho', role: 'Dev' },
                { user: 'agus', name: 'Agus', role: 'CEO' }
              ].map((account) => (
                <button
                  key={account.user}
                  onClick={() => {
                    setUsername(account.user);
                    setPassword('');
                    setError('');
                  }}
                  disabled={isLoading}
                  className={`p-4 text-center border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    username === account.user
                      ? 'border-indigo-500 bg-indigo-900 border-indigo-400'
                      : 'border-gray-600 hover:bg-gray-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="text-base sm:text-lg font-medium text-white">{account.name}</div>
                  <div className="text-sm text-gray-300">{account.role}</div>
                </button>
              ))}
            </div>
            
            {username && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Usuario seleccionado: <span className="font-bold">{username}</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                      placeholder={`Ingresa la clave para ${username}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setUsername('');
                    setPassword('');
                    setError('');
                  }}
                  className="w-full text-gray-400 py-2 text-sm hover:text-gray-200 transition-colors"
                >
                  Cambiar usuario
                </button>
              </form>
            )}
            
            {!username && (
              <div className="text-center">
                <p className="text-sm text-gray-300">Selecciona un usuario para continuar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};