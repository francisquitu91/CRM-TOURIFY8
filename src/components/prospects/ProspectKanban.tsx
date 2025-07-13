import React from 'react';
import { Edit, Eye, Trash2, Phone, Mail, Building, Calendar } from 'lucide-react';
import { Prospect } from '../../types';
import { PROSPECT_STATUSES } from '../../utils/constants';

interface ProspectKanbanProps {
  prospects: Prospect[];
  onStatusChange: (prospectId: string, newStatus: string) => void;
  onEdit: (prospect: Prospect) => void;
  onView: (prospect: Prospect) => void;
  onDelete: (prospectId: string) => void;
}

export const ProspectKanban: React.FC<ProspectKanbanProps> = ({
  prospects,
  onStatusChange,
  onEdit,
  onView,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nuevo': return 'border-blue-200 bg-blue-50';
      case 'Contactado': return 'border-yellow-200 bg-yellow-50';
      case 'En Negociación': return 'border-purple-200 bg-purple-50';
      case 'Ganado': return 'border-green-200 bg-green-50';
      case 'Perdido': return 'border-red-200 bg-red-50';
      case 'Stand-by': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Nuevo': return 'text-blue-700';
      case 'Contactado': return 'text-yellow-700';
      case 'En Negociación': return 'text-purple-700';
      case 'Ganado': return 'text-green-700';
      case 'Perdido': return 'text-red-700';
      case 'Stand-by': return 'text-gray-700';
      default: return 'text-gray-700';
    }
  };

  const handleDragStart = (e: React.DragEvent, prospect: Prospect) => {
    e.dataTransfer.setData('text/plain', prospect.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const prospectId = e.dataTransfer.getData('text/plain');
    onStatusChange(prospectId, newStatus);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {PROSPECT_STATUSES.map(status => {
        const statusProspects = prospects.filter(p => p.status === status);
        
        return (
          <div
            key={status}
            className={`rounded-xl border-2 border-dashed p-4 min-h-[500px] ${getStatusColor(status)}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${getStatusTextColor(status)}`}>
                {status}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusTextColor(status)} bg-white bg-opacity-50`}>
                {statusProspects.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {statusProspects.map(prospect => (
                <div
                  key={prospect.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, prospect)}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {prospect.contactName}
                    </h4>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <Building className="w-3 h-3 mr-1" />
                      <span className="truncate">{prospect.company}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {prospect.service}
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Phone className="w-3 h-3 mr-1" />
                      <span className="truncate">{prospect.phone}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Mail className="w-3 h-3 mr-1" />
                      <span className="truncate">{prospect.email}</span>
                    </div>
                  </div>

                  {prospect.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {prospect.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {prospect.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{prospect.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(prospect.createdAt).toLocaleDateString('es-CL')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onView(prospect)}
                        className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onEdit(prospect)}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDelete(prospect.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Asignado a: {prospect.assignedTo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};