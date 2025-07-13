import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  CheckSquare, 
  Target,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'prospects', label: 'Prospectos', icon: Users },
  { id: 'scripts', label: 'Scripts', icon: FileText },
  { id: 'finances', label: 'Finanzas', icon: DollarSign },
  { id: 'tasks', label: 'Tareas', icon: CheckSquare },
  { id: 'motivation', label: 'Motivación', icon: Target },
  { id: 'tours', label: 'Tours', icon: ExternalLink },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isOpen, 
  onClose 
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const handleHerramientasClick = () => {
    window.open('https://musical-rolypoly-8e704b.netlify.app/', '_blank');
  };

  // Si está retraído, no renderizar el sidebar (en desktop)
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-full shadow p-1 hidden lg:block"
        title="Expandir barra"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside className={
        `fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out
        lg:relative lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `
      }>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-8">
            <img src="https://gc.360-data.com/assets/92903/92903-H9lwwuuP42LL-thumb.png" alt="Tourify Logo" className="w-10 h-10 rounded-lg bg-white shadow" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tourify</h2>
              <p className="text-xs text-gray-500">Control Center</p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="absolute top-4 right-[-16px] z-10 bg-white border border-gray-200 rounded-full shadow p-1 hidden lg:block"
            title="Ocultar barra"
            style={{ transition: 'right 0.2s' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    onClose();
                  }}
                  className={
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={handleHerramientasClick}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <ExternalLink className="w-5 h-5" />
              {!collapsed && <span className="font-medium">PDF Prospectos</span>}
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};