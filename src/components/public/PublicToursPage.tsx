import React, { useState, useEffect } from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { Tour } from '../../types';
import { getTours } from '../../utils/storage';

export const PublicToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const loadedTours = await getTours();
        setTours(loadedTours);
        if (loadedTours.length > 0) {
          setSelectedTour(loadedTours[0]);
        }
      } catch (error) {
        console.error('Error loading tours:', error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTours();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tours virtuales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <img 
              src="https://gc.360-data.com/assets/92903/92903-H9lwwuuP42LL-thumb.png" 
              alt="Tourify Logo" 
              className="w-12 h-12 rounded-full shadow-lg bg-white"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tours Virtuales</h1>
              <p className="text-gray-600">Explora nuestros espacios en realidad virtual</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {tours.length === 0 ? (
          <div className="text-center py-16">
            <ExternalLink className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay tours disponibles</h3>
            <p className="text-gray-500">Pronto tendremos tours virtuales disponibles para explorar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Tours List */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tours Disponibles</h2>
              <div className="space-y-3">
                {tours.map((tour) => (
                  <button
                    key={tour.id}
                    onClick={() => setSelectedTour(tour)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedTour?.id === tour.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{tour.title}</h3>
                        <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {tour.label}
                        </span>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tour Viewer */}
            <div className="lg:col-span-3">
              {selectedTour ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedTour.title}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                            {selectedTour.label}
                          </span>
                          <a 
                            href={selectedTour.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Abrir en nueva ventana</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="aspect-video w-full">
                    <iframe
                      src={selectedTour.url}
                      title={selectedTour.title}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <ExternalLink className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un tour</h3>
                  <p className="text-gray-500">Elige un tour de la lista para comenzar a explorar</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img 
                src="https://gc.360-data.com/assets/92903/92903-H9lwwuuP42LL-thumb.png" 
                alt="Tourify Logo" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-lg font-semibold text-gray-900">Tourify</span>
            </div>
            <p className="text-gray-600 text-sm">
              Experiencias inmersivas en realidad virtual para educación y negocios
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2025 Tourify. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};