import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface Task {
  id: string;
  subject: string;
  type: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
}

interface TaskFormProps {
  onSave: (task: Omit<Task, 'id' | 'completed'>) => void;
  onCancel: () => void;
  editingTask?: Task;
}

const subjects = [
  'Matemáticas',
  'Lengua y Literatura',
  'Ciencias Naturales',
  'Ciencias Sociales',
  'Inglés',
  'Educación Física',
  'Arte',
  'Música',
  'Informática',
  'Física',
  'Química',
  'Historia',
  'Geografía',
];

export function TaskForm({ onSave, onCancel, editingTask }: TaskFormProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    subject: editingTask?.subject || '',
    type: editingTask?.type || '',
    assignedDate: editingTask?.assignedDate || today,
    dueDate: editingTask?.dueDate || '',
    description: editingTask?.description || '',
    priority: editingTask?.priority || 'media' as 'alta' | 'media' | 'baja',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl md:text-2xl text-gray-900">
            {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-gray-700">
              Materia *
            </Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
              required
            >
              <SelectTrigger className="h-12 border-gray-300">
                <SelectValue placeholder="Selecciona una materia" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700">
              Tipo de tarea *
            </Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Ej: Ejercicios, Trabajo práctico, Lectura..."
              className="h-12 border-gray-300"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalles de la tarea..."
              className="min-h-24 border-gray-300 resize-none"
              rows={4}
            />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedDate" className="text-gray-700">
                Fecha asignada *
              </Label>
              <Input
                id="assignedDate"
                type="date"
                value={formData.assignedDate}
                onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                className="h-12 border-gray-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-gray-700">
                Fecha de entrega *
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="h-12 border-gray-300"
                required
                min={formData.assignedDate}
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="text-gray-700">Prioridad *</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value: 'alta' | 'media' | 'baja') =>
                setFormData({ ...formData, priority: value })
              }
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="alta" id="alta" className="border-red-500 text-red-600" />
                <Label
                  htmlFor="alta"
                  className="flex-1 cursor-pointer rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-red-700 hover:bg-red-100 transition-colors"
                >
                  🔴 Alta
                </Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="media" id="media" className="border-yellow-500 text-yellow-600" />
                <Label
                  htmlFor="media"
                  className="flex-1 cursor-pointer rounded-lg border-2 border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700 hover:bg-yellow-100 transition-colors"
                >
                  🟡 Media
                </Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="baja" id="baja" className="border-blue-500 text-blue-600" />
                <Label
                  htmlFor="baja"
                  className="flex-1 cursor-pointer rounded-lg border-2 border-blue-200 bg-blue-50 px-4 py-3 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  🔵 Baja
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingTask ? 'Guardar cambios' : 'Guardar tarea'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
