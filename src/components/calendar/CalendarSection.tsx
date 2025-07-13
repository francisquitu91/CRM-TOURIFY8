import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
// Importaciones necesarias para react-big-calendar
import { Calendar, dateFnsLocalizer, EventProps } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es'; // Importar el locale en español
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilos del calendario
import { getCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../../utils/storage';
import { CalendarEvent } from '../../types';

// --- Configuración del Localizer para date-fns y en español ---
const locales = {
  'es': es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Lunes como inicio de semana
  getDay,
  locales,
});

// --- Componente para personalizar cómo se ve un evento en el calendario ---
const CustomEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
  const eventTypeColors = {
    tarea: 'bg-purple-500',
    ingreso: 'bg-green-500',
    gasto: 'bg-red-500',
    reunion: 'bg-blue-500',
  };

  return (
    <div className={`${eventTypeColors[event.type]} p-1 text-white rounded-md text-xs`}>
      <strong>{event.title}</strong>
      {event.related && <em className="block opacity-80">({event.related})</em>}
    </div>
  );
};


// --- Componente principal del Calendario ---
export const CalendarSection: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Cargar eventos del localStorage al inicializar
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const savedEvents = await getCalendarEvents();
        setEvents(savedEvents);
      } catch (error) {
        console.error('Error loading calendar events:', error);
        setEvents([]);
      }
    };
    
    loadEvents();
  }, []);

  // Estado para controlar el modal de "Añadir/Editar"
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para guardar los datos del evento que se está creando o editando
  const [currentEventData, setCurrentEventData] = useState<Partial<CalendarEvent>>({});

  // --- Manejadores de Interacción con el Calendario ---

  // Se activa al hacer clic en un espacio vacío del calendario (para crear un nuevo evento)
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setCurrentEventData({ start, end, type: 'tarea' }); // Pre-rellena fechas y tipo por defecto
    setIsModalOpen(true);
  }, []);

  // Se activa al hacer clic en un evento existente (para editarlo)
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setCurrentEventData(event);
    setIsModalOpen(true);
  }, []);

  // --- Manejadores del Formulario del Modal ---

  // Actualiza el estado del formulario a medida que el usuario escribe
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEventData(prev => ({
      ...prev,
      [name]: name === 'start' || name === 'end' ? new Date(value) : value,
    }));
  };

  // Guarda el evento (crea uno nuevo o actualiza uno existente)
  const handleSave = () => {
    const saveEvent = async () => {
      try {
    if (!currentEventData.title || !currentEventData.start) return;

    if (currentEventData.id) {
          // Actualizar evento existente
          await updateCalendarEvent(currentEventData.id, currentEventData);
    } else {
          // Crear nuevo evento
          await addCalendarEvent({
            ...currentEventData,
            end: currentEventData.end || currentEventData.start,
          } as Omit<CalendarEvent, 'id' | 'createdAt'>);
    }
        
        // Reload events after save
        const updatedEvents = await getCalendarEvents();
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Error saving calendar event:', error);
      }
    };
    
    saveEvent();
    closeModal();
  };

  // Elimina el evento actual
  const handleDelete = () => {
    if (currentEventData.id) {
      if (window.confirm(`¿Estás seguro de que quieres eliminar "${currentEventData.title}"?`)) {
        const deleteEvent = async () => {
          try {
            await deleteCalendarEvent(currentEventData.id!);
            
            // Reload events after delete
            const updatedEvents = await getCalendarEvents();
            setEvents(updatedEvents);
          } catch (error) {
            console.error('Error deleting calendar event:', error);
          }
        };
        
        deleteEvent();
        closeModal();
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEventData({});
  };

  return (
    <div className="h-[80vh] relative"> {/* Contenedor principal con altura definida */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Calendario Interactivo</h2>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        selectable // Permite hacer clic en los slots vacíos
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
        }}
        culture='es' // Aplica la cultura española a los textos
        components={{
          event: CustomEvent, // Usamos nuestro componente personalizado para los eventos
        }}
      />

      {/* --- Modal para Añadir/Editar Eventos --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold">{currentEventData.id ? 'Editar Evento' : 'Añadir Nuevo Evento'}</h3>
            
            <input type="text" name="title" placeholder="Título del evento" value={currentEventData.title || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm">Inicio</label>
                <input type="datetime-local" name="start" value={currentEventData.start ? format(currentEventData.start, "yyyy-MM-dd'T'HH:mm") : ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
              </div>
              <div className="w-1/2">
                <label className="text-sm">Fin</label>
                <input type="datetime-local" name="end" value={currentEventData.end ? format(currentEventData.end, "yyyy-MM-dd'T'HH:mm") : ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
              </div>
            </div>
            
            <select name="type" value={currentEventData.type || 'tarea'} onChange={handleFormChange} className="w-full border p-2 rounded">
              <option value="tarea">Tarea</option>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
              <option value="reunion">Reunión</option>
            </select>

            <input type="text" name="related" placeholder="Relacionado con..." value={currentEventData.related || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
            <input type="text" name="description" placeholder="Descripción" value={currentEventData.description || ''} onChange={handleFormChange} className="w-full border p-2 rounded" />
            
            <div className="flex justify-between items-center mt-4">
              <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-semibold">Guardar</button>
              {currentEventData.id && (
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold">Eliminar</button>
              )}
              <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};