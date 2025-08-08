import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Users, Phone, Mail, Building, Tag, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { Prospect, User } from '../../types';
import { getProspects, setProspects, addProspect, updateProspect, deleteProspect } from '../../utils/storage';
import { SERVICES, PROSPECT_STATUSES, USERS_LIST, TAGS } from '../../utils/constants';
import { ProspectForm } from './ProspectForm';
import { ProspectKanban } from './ProspectKanban';
import { ProspectDetail } from './ProspectDetail';

interface ProspectsSectionProps {
  user: User;
}

export const ProspectsSection: React.FC<ProspectsSectionProps> = ({ user }) => {
  const [prospects, setProspectsState] = useState<Prospect[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<Prospect[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  useEffect(() => {
    const loadProspects = async () => {
      try {
        const loadedProspects = await getProspects();
        setProspectsState(loadedProspects || []);
        setFilteredProspects(loadedProspects || []);
      } catch (error) {
        console.error('Error loading prospects:', error);
        setProspectsState([]);
        setFilteredProspects([]);
      }
    };
    
    loadProspects();
  }, []);

  useEffect(() => {
    let filtered = Array.isArray(prospects) ? prospects : [];

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (serviceFilter) {
      filtered = filtered.filter(p => p.service === serviceFilter);
    }

    if (assignedFilter) {
      filtered = filtered.filter(p => p.assignedTo === assignedFilter);
    }

    if (tagFilter) {
      filtered = filtered.filter(p => p.tags.includes(tagFilter));
    }

    setFilteredProspects(filtered);
  }, [prospects, searchTerm, statusFilter, serviceFilter, assignedFilter, tagFilter]);

  const handleSaveProspect = (prospectData: Omit<Prospect, 'id' | 'createdAt'>) => {
    const saveProspect = async () => {
      try {
        if (editingProspect) {
          await updateProspect(editingProspect.id, prospectData);
        } else {
          await addProspect(prospectData);
        }
        
        // Reload prospects after save
        const updatedProspects = await getProspects();
        setProspectsState(updatedProspects || []);
        setFilteredProspects(updatedProspects || []);
      } catch (error) {
        console.error('Error saving prospect:', error);
      }
    };
    
    saveProspect();
    setShowForm(false);
    setEditingProspect(null);
  };

  const handleDeleteProspect = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este prospecto?')) {
      const deleteProspectAsync = async () => {
        try {
          await deleteProspect(id);
          
          // Reload prospects after delete
          const updatedProspects = await getProspects();
          setProspectsState(updatedProspects || []);
          setFilteredProspects(updatedProspects || []);
        } catch (error) {
          console.error('Error deleting prospect:', error);
        }
      };
      
      deleteProspectAsync();
    }
  };

  const handleStatusChange = (prospectId: string, newStatus: string) => {
    const updateStatus = async () => {
      try {
        const prospect = prospects.find(p => p.id === prospectId);
        if (prospect) {
          await updateProspect(prospectId, { ...prospect, status: newStatus });
          
          // Reload prospects after update
          const updatedProspects = await getProspects();
          setProspectsState(updatedProspects || []);
          setFilteredProspects(updatedProspects || []);
        }
      } catch (error) {
        console.error('Error updating prospect status:', error);
      }
    };
    
    updateStatus();
  };

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

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setServiceFilter('');
    setAssignedFilter('');
    setTagFilter('');
  };

  if (selectedProspect) {
    return (
      <ProspectDetail
        prospect={selectedProspect}
        onClose={() => setSelectedProspect(null)}
        onEdit={(prospect) => {
          setEditingProspect(prospect);
          setSelectedProspect(null);
          setShowForm(true);
        }}
        onDelete={handleDeleteProspect}
        onSave={(updatedProspect) => {
          const saveUpdatedProspect = async () => {
            try {
              await updateProspect(updatedProspect.id, updatedProspect);
              
              // Reload prospects after update
              const updatedProspects = await getProspects();
              setProspectsState(updatedProspects || []);
              setFilteredProspects(updatedProspects || []);
              setSelectedProspect(updatedProspect);
            } catch (error) {
              console.error('Error updating prospect:', error);
            }
          };
          
          saveUpdatedProspect();
        }}
      />
    );
  }

  if (showForm) {
    return (
      <ProspectForm
        prospect={editingProspect}
        onSave={handleSaveProspect}
        onCancel={() => {
          setShowForm(false);
          setEditingProspect(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Prospectos</h1>
          <p className="text-gray-300">Administra tus clientes potenciales y oportunidades de venta</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Prospecto</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar prospectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {PROSPECT_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todos los servicios</option>
            {SERVICES.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Asignado a</option>
            {USERS_LIST.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todas las etiquetas</option>
            {TAGS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredProspects.length} de {prospects.length} prospectos
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                viewMode === 'list' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                viewMode === 'kanban' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <ProspectKanban
          prospects={filteredProspects}
          onStatusChange={handleStatusChange}
          onEdit={(prospect) => {
            setEditingProspect(prospect);
            setShowForm(true);
          }}
          onView={setSelectedProspect}
          onDelete={handleDeleteProspect}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredProspects.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay prospectos</h3>
              <p className="text-gray-500 mb-4">
                {prospects.length === 0 
                  ? 'Comienza agregando tu primer prospecto'
                  : 'No se encontraron prospectos con los filtros aplicados'
                }
              </p>
              {prospects.length === 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Agregar Prospecto
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(filteredProspects) && filteredProspects
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((prospect) => (
                    <tr key={prospect.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {prospect.contactName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Mail className="w-3 h-3" />
                            <span>{prospect.email}</span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-2">
                            <Phone className="w-3 h-3" />
                            <span>{prospect.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{prospect.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{prospect.service}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                          {prospect.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prospect.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(prospect.createdAt).toLocaleDateString('es-CL')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedProspect(prospect)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProspect(prospect);
                              setShowForm(true);
                            }}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProspect(prospect.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};