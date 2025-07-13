import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { getProspects } from '../../../utils/storage';

export const ProspectsWidget: React.FC = () => {
  const [prospects, setProspects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProspects = async () => {
      try {
        const fetchedProspects = await getProspects();
        setProspects(fetchedProspects);
      } catch (error) {
        console.error('Error fetching prospects:', error);
        setProspects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, []);

  const recentProspects = React.useMemo(() => {
    if (!Array.isArray(prospects)) return [];
    return prospects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [prospects]);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Prospectos Recientes</h3>
        <Users className="w-5 h-5 text-gray-400" />
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="ml-3 flex-shrink-0">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : recentProspects.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay prospectos registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentProspects.map((prospect) => (
            <div key={prospect.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {prospect.contactName}
                </h4>
                <p className="text-gray-600 text-xs truncate">{prospect.company}</p>
                <p className="text-gray-500 text-xs">{prospect.service}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                  {prospect.status}
                </span>
              </div>
            </div>
          ))}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              Total: {prospects.length} prospectos
            </div>
            <div className="text-xs text-gray-500">
              {prospects.filter(p => p.status === 'Ganado').length} ganados
            </div>
          </div>
        </div>
      )}
    </div>
  );
};