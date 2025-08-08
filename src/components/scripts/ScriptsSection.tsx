import React, { useState, useEffect } from 'react';
import { Plus, Search, Copy, Edit, Trash2, FileText, Check, Filter } from 'lucide-react';
import { SalesScript } from '../../types';
import { getSalesScripts, setSalesScripts, addSalesScript, updateSalesScript, deleteSalesScript } from '../../utils/storage';
import { CLIENT_TYPES } from '../../utils/constants';
import { ScriptForm } from './ScriptForm';

export const ScriptsSection: React.FC = () => {
  const [scripts, setScriptsState] = useState<SalesScript[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<SalesScript[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingScript, setEditingScript] = useState<SalesScript | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const loadedScripts = await getSalesScripts();
        setScriptsState(loadedScripts);
        setFilteredScripts(loadedScripts);
      } catch (error) {
        console.error('Error loading scripts:', error);
        setScriptsState([]);
        setFilteredScripts([]);
      }
    };
    
    loadScripts();
  }, []);

  useEffect(() => {
    let filtered = scripts;

    if (searchTerm) {
      filtered = filtered.filter(script => 
        script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (clientTypeFilter) {
      filtered = filtered.filter(script => script.clientType === clientTypeFilter);
    }

    setFilteredScripts(filtered);
  }, [scripts, searchTerm, clientTypeFilter]);

  const handleSaveScript = (scriptData: Omit<SalesScript, 'id' | 'createdAt'>) => {
    const saveScript = async () => {
      try {
    if (editingScript) {
          await updateSalesScript(editingScript.id, scriptData);
    } else {
          await addSalesScript(scriptData);
    }
        
        // Reload scripts after save
        const updatedScripts = await getSalesScripts();
        setScriptsState(updatedScripts);
        setFilteredScripts(updatedScripts);
      } catch (error) {
        console.error('Error saving script:', error);
      }
    };
    
    saveScript();
    setShowForm(false);
    setEditingScript(null);
  };

  const handleDeleteScript = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este script?')) {
      const deleteScript = async () => {
        try {
          await deleteSalesScript(id);
          
          // Reload scripts after delete
          const updatedScripts = await getSalesScripts();
          setScriptsState(updatedScripts);
          setFilteredScripts(updatedScripts);
        } catch (error) {
          console.error('Error deleting script:', error);
        }
      };
      
      deleteScript();
    }
  };

  const copyToClipboard = async (script: SalesScript) => {
    try {
      await navigator.clipboard.writeText(script.content);
      setCopiedId(script.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setClientTypeFilter('');
  };

  if (showForm) {
    return (
      <ScriptForm
        script={editingScript}
        onSave={handleSaveScript}
        onCancel={() => {
          setShowForm(false);
          setEditingScript(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Biblioteca de Scripts</h1>
          <p className="text-gray-300">Gestiona tus scripts de venta organizados por tipo de cliente</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Script</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar scripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={clientTypeFilter}
            onChange={(e) => setClientTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todos los tipos de cliente</option>
            {CLIENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Limpiar Filtros</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {filteredScripts.length} de {scripts.length} scripts
            </span>
          </div>
        </div>
      </div>

      {/* Scripts Grid */}
      {filteredScripts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {scripts.length === 0 ? 'No hay scripts creados' : 'No se encontraron scripts'}
          </h3>
          <p className="text-gray-500 mb-6">
            {scripts.length === 0 
              ? 'Comienza creando tu primer script de ventas'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
          {scripts.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Crear Primer Script
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScripts.map((script) => (
            <div key={script.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {script.title}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                    {script.clientType}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {script.content.length > 200 
                      ? `${script.content.substring(0, 200)}...`
                      : script.content
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>
                  Creado: {new Date(script.createdAt).toLocaleDateString('es-CL')}
                </span>
                <span>
                  {script.content.length} caracteres
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(script)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    copiedId === script.id
                      ? 'bg-green-100 text-green-700'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {copiedId === script.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setEditingScript(script);
                    setShowForm(true);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar script"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDeleteScript(script.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                  title="Eliminar script"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};