import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { SalesScript } from '../../types';
import { CLIENT_TYPES } from '../../utils/constants';

interface ScriptFormProps {
  script?: SalesScript | null;
  onSave: (script: Omit<SalesScript, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const ScriptForm: React.FC<ScriptFormProps> = ({ script, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    clientType: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (script) {
      setFormData({
        title: script.title,
        content: script.content,
        clientType: script.clientType
      });
    }
  }, [script]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'El contenido del script es requerido';
    }

    if (!formData.clientType) {
      newErrors.clientType = 'Selecciona un tipo de cliente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const insertTemplate = (template: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = formData.content.substring(0, start) + template + formData.content.substring(end);
      setFormData(prev => ({ ...prev, content: newContent }));
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + template.length, start + template.length);
      }, 0);
    }
  };

  const templates = [
    { name: 'Saludo', content: 'Hola [NOMBRE], espero que esté muy bien. Mi nombre es [TU_NOMBRE] de Tourify...' },
    { name: 'Presentación', content: 'Somos una empresa especializada en realidad virtual y tours inmersivos que ayudamos a [TIPO_EMPRESA] a...' },
    { name: 'Beneficios', content: 'Los beneficios principales que obtendrá son:\n- Experiencia inmersiva única\n- Ahorro de tiempo y costos\n- Mayor engagement con su audiencia' },
    { name: 'Llamada a la acción', content: '¿Le parece si coordinamos una reunión de 15 minutos para mostrarle algunos ejemplos? ¿Cuándo le viene mejor esta semana?' },
    { name: 'Cierre', content: 'Muchas gracias por su tiempo. Quedo atento a su respuesta.\n\nSaludos cordiales,\n[TU_NOMBRE]\nTourify' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {script ? 'Editar Script' : 'Nuevo Script'}
            </h1>
            <p className="text-gray-600">
              {script ? 'Actualiza el script de ventas' : 'Crea un nuevo script de ventas'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Script</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Script *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Script para Colegios - Presentación Inicial"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cliente *
              </label>
              <select
                value={formData.clientType}
                onChange={(e) => handleInputChange('clientType', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.clientType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar tipo de cliente</option>
                {CLIENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.clientType && (
                <p className="text-red-600 text-sm mt-1">{errors.clientType}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido del Script</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Script de Ventas *
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
                    errors.content ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={20}
                  placeholder="Escribe aquí tu script de ventas..."
                />
                {errors.content && (
                  <p className="text-red-600 text-sm mt-1">{errors.content}</p>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">
                    {formData.content.length} caracteres
                  </p>
                  <p className="text-xs text-gray-400">
                    Usa [NOMBRE], [EMPRESA], [TU_NOMBRE] como variables
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plantillas Rápidas</h3>
              <p className="text-sm text-gray-600 mb-4">
                Haz clic para insertar plantillas en tu script
              </p>
              
              <div className="space-y-2">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertTemplate(template.content)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Variables Disponibles</h4>
                <div className="space-y-1 text-xs text-blue-700">
                  <p><code>[NOMBRE]</code> - Nombre del contacto</p>
                  <p><code>[EMPRESA]</code> - Nombre de la empresa</p>
                  <p><code>[TU_NOMBRE]</code> - Tu nombre</p>
                  <p><code>[SERVICIO]</code> - Servicio de interés</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{script ? 'Actualizar' : 'Guardar'} Script</span>
          </button>
        </div>
      </form>
    </div>
  );
};