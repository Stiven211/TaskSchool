import { useState } from 'react';
import { Plus, BookOpen, Edit, Check, Calendar, BarChart3, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

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

interface DashboardProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onViewCalendar: () => void;
  onViewHistory: () => void;
  onLogout: () => void;
  tasks: Task[];
}

export function Dashboard({
  onAddTask,
  onEditTask,
  onViewTask,
  onToggleComplete,
  onViewCalendar,
  onViewHistory,
  onLogout,
  tasks,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

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

  const getSubjectColor = (subject: string) => {
    const colors = [
      'bg-purple-600',
      'bg-pink-600',
      'bg-indigo-600',
      'bg-blue-600',
      'bg-teal-600',
      'bg-green-600',
    ];
    const index = subject.length % colors.length;
    return colors[index];
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 ${getSubjectColor(task.subject)} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 mb-1 truncate">{task.subject}</h3>
          <p className="text-sm text-gray-600">{task.type}</p>
        </div>
        <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-xs`}>
          {task.priority}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Asignada:</span>
          <span className="text-gray-700">{task.assignedDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Entrega:</span>
          <span className={`${task.completed ? 'text-gray-700' : 'text-red-600'}`}>
            {task.dueDate}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewTask(task)}
          className="flex-1 border-gray-300 hover:bg-gray-50"
        >
          Ver detalles
        </Button>
        {!task.completed ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditTask(task)}
              className="border-gray-300 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => onToggleComplete(task.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            onClick={() => onToggleComplete(task.id)}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Deshacer
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl text-gray-900">TaskSchool</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewCalendar}
                className="hidden md:flex"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendario
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewHistory}
                className="hidden md:flex"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Historial
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border border-gray-200 p-1 h-auto">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2.5"
            >
              Pendientes ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white py-2.5"
            >
              Completadas ({completedTasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white py-2.5 md:hidden"
            >
              Más
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-2">¡Todo al día!</h3>
                <p className="text-gray-600">No tienes tareas pendientes</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {completedTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">Aún no hay tareas completadas</h3>
                <p className="text-gray-600">Las tareas que completes aparecerán aquí</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-0 md:hidden">
            <div className="space-y-3">
              <Button
                onClick={onViewCalendar}
                className="w-full h-14 bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 justify-start"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Ver Calendario
              </Button>
              <Button
                onClick={onViewHistory}
                className="w-full h-14 bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 justify-start"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Ver Historial y Estadísticas
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={onAddTask}
        className="fixed right-6 bottom-6 w-14 h-14 md:w-16 md:h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
      >
        <Plus className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
      </button>
    </div>
  );
}
