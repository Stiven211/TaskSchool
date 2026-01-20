import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Task } from '../../types';

interface TaskFormProps {
  onSave: (task: Omit<Task, 'id' | 'completada'>) => void;
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
    materia: editingTask?.materia || '',
    tipo: editingTask?.tipo || '',
    fechaAsignada: editingTask?.fechaAsignada || today,
    fechaEntrega: editingTask?.fechaEntrega || '',
    descripcion: editingTask?.descripcion || '',
    prioridad: editingTask?.prioridad || 'media' as 'alta' | 'media' | 'baja',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-popover border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl md:text-2xl text-foreground">
            {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="materia" className="text-foreground">
              Materia *
            </Label>
            <Select
              value={formData.materia}
              onValueChange={(value) => setFormData({ ...formData, materia: value })}
              required
            >
              <SelectTrigger className="h-12 border-input">
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
            <Label htmlFor="tipo" className="text-foreground">
              Tipo de tarea *
            </Label>
            <Input
              id="tipo"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              placeholder="Ej: Ejercicios, Trabajo práctico, Lectura..."
              className="h-12 border-input"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-foreground">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Detalles de la tarea..."
              className="min-h-24 border-input resize-none"
              rows={4}
            />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaAsignada" className="text-foreground">
                Fecha asignada *
              </Label>
              <Input
                id="fechaAsignada"
                type="date"
                value={formData.fechaAsignada}
                onChange={(e) => setFormData({ ...formData, fechaAsignada: e.target.value })}
                className="h-12 border-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaEntrega" className="text-foreground">
                Fecha de entrega *
              </Label>
              <Input
                id="fechaEntrega"
                type="date"
                value={formData.fechaEntrega}
                onChange={(e) => setFormData({ ...formData, fechaEntrega: e.target.value })}
                className="h-12 border-input"
                required
                min={formData.fechaAsignada}
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="text-foreground">Prioridad *</Label>
            <RadioGroup
              value={formData.prioridad}
              onValueChange={(value: 'alta' | 'media' | 'baja') =>
                setFormData({ ...formData, prioridad: value })
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
              className="flex-1 h-12 border-2 border-input hover:bg-accent hover-glow"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground hover-glow"
            >
              {editingTask ? 'Guardar cambios' : 'Guardar tarea'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
