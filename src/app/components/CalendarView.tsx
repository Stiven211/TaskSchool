import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Task } from '../../types';

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
    return tasks.filter(task => task.fechaEntrega === dateStr);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl md:text-2xl text-foreground">Calendario</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              {/* Month Navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary to-primary/80">
                <h2 className="text-lg text-primary-foreground">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={previousMonth}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextMonth}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
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
                    <div key={day} className="text-center text-sm text-muted-foreground py-2">
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
                          ${isToday(day) ? 'bg-accent border-2 border-primary' : 'border border-border'}
                          ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}
                          ${!isSelected && !isToday(day) ? 'text-foreground' : ''}
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
                                      task.completada ? 'bg-green-500' : 
                                      task.prioridad === 'alta' ? 'bg-red-500' :
                                      task.prioridad === 'media' ? 'bg-yellow-500' :
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
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sticky top-24">
              <h3 className="text-lg text-foreground mb-4">
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
                        className="w-full text-left bg-muted hover:bg-accent rounded-xl p-4 border border-border transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                            task.completada ? 'bg-green-500' :
                            task.prioridad === 'alta' ? 'bg-red-500' :
                            task.prioridad === 'media' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-foreground text-sm mb-1 truncate">{task.materia}</h4>
                            <p className="text-xs text-muted-foreground truncate">{task.tipo}</p>
                          </div>
                        </div>
                        {task.completada && (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">
                            Completada
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">No hay tareas para este día</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">Haz clic en un día del calendario para ver las tareas</p>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Leyenda</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">Prioridad alta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">Prioridad media</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Prioridad baja</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">Completada</span>
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
