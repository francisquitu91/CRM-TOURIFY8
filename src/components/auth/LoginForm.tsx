import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { authenticateUser, setCurrentUser } from '../../utils/auth';
import { User } from '../../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  // NOTA: Estas variables (username, password, etc.) no se están usando ahora mismo.
  // Deberías implementar el formulario de login normal para usarlas.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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

  // La función quickLogin ya no se llama desde ningún sitio, pero se puede dejar por si la necesitas en el futuro.
  const quickLogin = async (user: string) => {
    // ... esta función queda intacta pero sin uso
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tourify Control Center</h1>
            <p className="text-gray-600 dark:text-gray-300">Ingresa para acceder al centro de control</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-6">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* 
              Aquí es donde deberías poner tu formulario de login normal
              con los campos de usuario y contraseña.
              Por ejemplo: <form onSubmit={handleSubmit}> ... </form>
            */}
            
            {isLoading && (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">Iniciando sesión...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};