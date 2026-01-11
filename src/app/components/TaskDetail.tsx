import { X, Calendar, AlertCircle, FileText, Paperclip, Edit, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface Task {
  id: string;
  subject: string;
  type: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  completed: boolean;
  files?: string[];
}

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskDetail({ task, onClose, onEdit, onToggleComplete }: TaskDetailProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'baja':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0 && !task.completed;
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3 && !task.completed;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl md:text-2xl text-white truncate">{task.subject}</h2>
              <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs`}>
                {task.priority}
              </Badge>
            </div>
            <p className="text-blue-100">{task.type}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors ml-4"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Alert */}
          {task.completed && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                ¡Tarea completada! Bien hecho 🎉
              </AlertDescription>
            </Alert>
          )}

          {isOverdue && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                ⚠️ Esta tarea está vencida. Fecha de entrega pasada hace {Math.abs(daysUntilDue)} día(s).
              </AlertDescription>
            </Alert>
          )}

          {isDueSoon && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                ⏰ Recordatorio: Esta tarea vence en {daysUntilDue} día(s).
              </AlertDescription>
            </Alert>
          )}

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Fecha asignada</span>
              </div>
              <p className="text-gray-900">{task.assignedDate}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Fecha de entrega</span>
              </div>
              <p className={`${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                {task.dueDate}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <FileText className="w-5 h-5" />
              <h3 className="font-medium">Descripción</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              {task.description ? (
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              ) : (
                <p className="text-gray-400 italic">No hay descripción disponible</p>
              )}
            </div>
          </div>

          {/* Files */}
          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <Paperclip className="w-5 h-5" />
              <h3 className="font-medium">Archivos adjuntos</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              {task.files && task.files.length > 0 ? (
                <div className="space-y-2">
                  {task.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-700 text-sm">{file}</span>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        Ver
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-3">No hay archivos adjuntos</p>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Adjuntar archivo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {!task.completed ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => onEdit(task)}
                  className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={() => {
                    onToggleComplete(task.id);
                    onClose();
                  }}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar como hecha
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  onToggleComplete(task.id);
                  onClose();
                }}
                className="flex-1 h-12 bg-gray-600 hover:bg-gray-700 text-white"
              >
                Marcar como pendiente
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
