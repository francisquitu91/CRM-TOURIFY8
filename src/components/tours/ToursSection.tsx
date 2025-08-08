import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Tour } from '../../types';
import { getTours, addTour, updateTour, deleteTour } from '../../utils/storage';

export const ToursSection: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [newTour, setNewTour] = useState({ url: '', title: '', label: '' });
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const loadedTours = await getTours();
        setTours(loadedTours);
      } catch (error) {
        console.error('Error loading tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTours();
  }, []);

  const handleAddTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTour.url || !newTour.title || !newTour.label) return;
    
    const saveTour = async () => {
      try {
        if (editingTour) {
          await updateTour(editingTour.id, newTour);
        } else {
          await addTour(newTour);
        }
        
        // Reload tours after save
        const updatedTours = await getTours();
        setTours(updatedTours);
      } catch (error) {
        console.error('Error saving tour:', error);
      }
    };
    
    saveTour();
    setNewTour({ url: '', title: '', label: '' });
    setEditingTour(null);
  };

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setNewTour({ url: tour.url, title: tour.title, label: tour.label });
  };

  const handleDeleteTour = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tour?')) {
      const deleteTourAsync = async () => {
        try {
          await deleteTour(id);
          
          // Reload tours after delete
          const updatedTours = await getTours();
          setTours(updatedTours);
        } catch (error) {
          console.error('Error deleting tour:', error);
        }
      };
      
      deleteTourAsync();
    }
  };

  const handleCancelEdit = () => {
    setEditingTour(null);
    setNewTour({ url: '', title: '', label: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tours Virtuales</h1>
          <p className="text-gray-300">Gestiona la biblioteca de tours virtuales</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingTour ? 'Editar Tour' : 'Agregar Nuevo Tour'}
        </h3>
        <form onSubmit={handleAddTour} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del Tour *
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/tour"
                value={newTour.url}
                onChange={e => setNewTour({ ...newTour, url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                placeholder="Nombre del tour"
                value={newTour.title}
                onChange={e => setNewTour({ ...newTour, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <input
                type="text"
                placeholder="Ej: Universidad, Colegio"
                value={newTour.label}
                onChange={e => setNewTour({ ...newTour, label: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{editingTour ? 'Actualizar' : 'Agregar'} Tour</span>
            </button>
            {editingTour && (
              <button 
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando tours...</p>
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-12">
          <ExternalLink className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tours registrados</h3>
          <p className="text-gray-500">Comienza agregando tu primer tour virtual</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tours.map((tour, idx) => (
          <div key={tour.id || idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{tour.title}</h3>
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                  {tour.label}
                </span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEditTour(tour)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar tour"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTour(tour.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                  title="Eliminar tour"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <a 
              href={tour.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:text-blue-800 mb-4 truncate flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{tour.url}</span>
            </a>
            <div className="aspect-video w-full rounded overflow-hidden border">
              <iframe
                src={tour.url}
                title={tour.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};
