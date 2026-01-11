import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
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
}

interface CalendarViewProps {
  tasks: Task[];
  onBack: () => void;
  onTaskClick: (task: Task) => void;
}

export function CalendarView({ tasks, onBack, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl md:text-2xl text-gray-900">Calendario</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Month Navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-lg text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={previousMonth}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextMonth}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4 md:p-6">
                {/* Days of week */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-sm text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    const dayTasks = day ? getTasksForDate(day) : [];
                    const isSelected = selectedDate?.toDateString() === day?.toDateString();
                    
                    return (
                      <button
                        key={index}
                        onClick={() => day && setSelectedDate(day)}
                        disabled={!day}
                        className={`
                          aspect-square p-1 md:p-2 rounded-lg transition-all relative
                          ${!day ? 'invisible' : ''}
                          ${isToday(day) ? 'bg-blue-100 border-2 border-blue-600' : 'border border-gray-200'}
                          ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}
                          ${!isSelected && !isToday(day) ? 'text-gray-700' : ''}
                        `}
                      >
                        {day && (
                          <>
                            <span className="text-sm md:text-base block">{day.getDate()}</span>
                            {dayTasks.length > 0 && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                {dayTasks.slice(0, 3).map((task, i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      task.completed ? 'bg-green-500' : 
                                      task.priority === 'alta' ? 'bg-red-500' :
                                      task.priority === 'media' ? 'bg-yellow-500' :
                                      'bg-blue-500'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Task Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg text-gray-900 mb-4">
                {selectedDate
                  ? `Tareas del ${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`
                  : 'Selecciona un día'}
              </h3>

              {selectedDate ? (
                selectedTasks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                            task.completed ? 'bg-green-500' :
                            task.priority === 'alta' ? 'bg-red-500' :
                            task.priority === 'media' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 text-sm mb-1 truncate">{task.subject}</h4>
                            <p className="text-xs text-gray-600 truncate">{task.type}</p>
                          </div>
                        </div>
                        {task.completed && (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">
                            Completada
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No hay tareas para este día</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">Haz clic en un día del calendario para ver las tareas</p>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-3">Leyenda</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-600">Prioridad alta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-gray-600">Prioridad media</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600">Prioridad baja</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Completada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
