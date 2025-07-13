import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Plus, Phone, Mail, Building, Calendar, Tag, User, MessageSquare } from 'lucide-react';
import { Prospect } from '../../types';

interface ProspectDetailProps {
  prospect: Prospect;
  onClose: () => void;
  onEdit: (prospect: Prospect) => void;
  onDelete: (prospectId: string) => void;
  onSave: (prospect: Prospect) => void;
}

export const ProspectDetail: React.FC<ProspectDetailProps> = ({
  prospect,
  onClose,
  onEdit,
  onDelete,
  onSave
}) => {
  const [newNote, setNewNote] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nuevo': return 'bg-blue-100 text-blue-800';
      case 'Contactado': return 'bg-yellow-100 text-yellow-800';
      case 'En Negociación': return 'bg-purple-100 text-purple-800';
      case 'Ganado': return 'bg-green-100 text-green-800';
      case 'Perdido': return 'bg-red-100 text-red-800';
      case 'Stand-by': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const updatedProspect = {
        ...prospect,
        notes: [
          ...prospect.notes,
          {
            date: new Date().toISOString(),
            content: newNote.trim()
          }
        ]
      };
      onSave(updatedProspect);
      setNewNote('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      addNote();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{prospect.contactName}</h1>
            <p className="text-gray-600">{prospect.company}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(prospect)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => onDelete(prospect.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contacto</p>
                    <p className="font-medium text-gray-900">{prospect.contactName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Empresa</p>
                    <p className="font-medium text-gray-900">{prospect.company}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <a 
                      href={`tel:${prospect.phone}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {prospect.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href={`mailto:${prospect.email}`}
                      className="font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {prospect.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Historial de Contacto</h3>
              <span className="text-sm text-gray-500">{prospect.notes.length} notas</span>
            </div>
            
            {/* Add Note */}
            <div className="mb-6">
              <div className="flex space-x-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Agregar nueva nota... (Ctrl+Enter para guardar)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {prospect.notes.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay notas registradas</p>
                  <p className="text-sm text-gray-400">Agrega la primera nota para comenzar el seguimiento</p>
                </div>
              ) : (
                prospect.notes
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((note, index) => (
                    <div key={index} className="border-l-4 border-indigo-200 pl-4 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(note.date).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <p className="text-gray-900">{note.content}</p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Negocio</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Estado</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prospect.status)}`}>
                  {prospect.status}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Servicio de Interés</p>
                <p className="font-medium text-gray-900">{prospect.service}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Asignado a</p>
                <p className="font-medium text-gray-900">{prospect.assignedTo}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Fecha de Creación</p>
                <p className="font-medium text-gray-900">
                  {new Date(prospect.createdAt).toLocaleDateString('es-CL')}
                </p>
              </div>
            </div>
          </div>

          {prospect.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Etiquetas</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {prospect.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};