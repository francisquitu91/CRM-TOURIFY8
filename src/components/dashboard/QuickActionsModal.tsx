import React from 'react';
import { X } from 'lucide-react';

interface QuickActionsModalProps {
  open: boolean;
  onClose: () => void;
  action: 'prospect' | 'sale' | 'task' | 'scripts' | null;
  onProspect: () => void;
  onSale: () => void;
  onTask: () => void;
  onScripts: () => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({ open, onClose, action, onProspect, onSale, onTask, onScripts }) => {
  if (!open || !action) return null;

  let content = null;
  switch (action) {
    case 'prospect':
      content = <button onClick={onProspect}>Ir a Nuevo Prospecto</button>;
      break;
    case 'sale':
      content = <button onClick={onSale}>Ir a Registrar Venta</button>;
      break;
    case 'task':
      content = <button onClick={onTask}>Ir a Nueva Tarea</button>;
      break;
    case 'scripts':
      content = <button onClick={onScripts}>Ir a Scripts</button>;
      break;
    default:
      content = null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 relative min-w-[300px]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X className="w-5 h-5" />
        </button>
        {content}
      </div>
    </div>
  );
};
