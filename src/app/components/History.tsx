import { useState } from 'react';
import { ArrowLeft, Filter, TrendingUp, CheckCircle2, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Task } from '../../types';

interface HistoryProps {
  tasks: Task[];
  onBack: () => void;
  onTaskClick: (task: Task) => void;
}

export function History({ tasks, onBack, onTaskClick }: HistoryProps) {
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const completedTasks = tasks.filter(t => t.completada);

  // Get unique subjects
  const subjects = Array.from(new Set(tasks.map(t => t.materia))).sort();

  // Get unique months from tasks
  const getMonthYear = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('es', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const months = Array.from(
    new Set(tasks.map(t => getMonthYear(t.fechaEntrega)))
  ).sort();

  // Filter tasks
  const filteredTasks = completedTasks.filter(task => {
    const matchesSubject = filterSubject === 'all' || task.materia === filterSubject;
    const matchesMonth = filterMonth === 'all' || getMonthYear(task.fechaEntrega) === filterMonth;
    return matchesSubject && matchesMonth;
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const totalCompleted = completedTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Subject statistics for chart
  const subjectStats = subjects.map(subject => {
    const subjectTasks = tasks.filter(t => t.materia === subject);
    const subjectCompleted = subjectTasks.filter(t => t.completada).length;
    const percentage = subjectTasks.length > 0 
      ? Math.round((subjectCompleted / subjectTasks.length) * 100)
      : 0;
    
    return {
      subject: subject.length > 15 ? subject.substring(0, 12) + '...' : subject,
      fullSubject: subject,
      percentage,
      completed: subjectCompleted,
      total: subjectTasks.length,
    };
  }).sort((a, b) => b.percentage - a.percentage);

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return '#16a34a'; // green-600
    if (percentage >= 50) return '#2563eb'; // blue-600
    if (percentage >= 30) return '#eab308'; // yellow-500
    return '#dc2626'; // red-600
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl md:text-2xl text-foreground">Historial y Estadísticas</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 transition-smooth">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl text-foreground mb-1">{totalTasks}</p>
            <p className="text-sm text-muted-foreground">Tareas totales</p>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl text-foreground mb-1">{totalCompleted}</p>
            <p className="text-sm text-muted-foreground">Tareas completadas</p>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 transition-smooth">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl text-foreground mb-1">{completionRate}%</p>
            <p className="text-sm text-muted-foreground">Tasa de cumplimiento</p>
          </div>
        </div>

        {/* Chart */}
        {subjectStats.length > 0 && (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8 transition-smooth">
            <h2 className="text-lg text-foreground mb-6">Cumplimiento por Materia</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="subject" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={[0, 100]}
                  label={{ value: '% Completado', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value}% (${props.payload.completed}/${props.payload.total})`,
                    props.payload.fullSubject
                  ]}
                  labelFormatter={() => ''}
                />
                <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                  {subjectStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6 transition-smooth">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg text-foreground">Filtros</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Materia</label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="h-11 border-input">
                  <SelectValue placeholder="Todas las materias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Mes</label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="h-11 border-input">
                  <SelectValue placeholder="Todos los meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los meses</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Completed Tasks List */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 transition-smooth">
          <h2 className="text-lg text-foreground mb-4">
            Tareas Completadas ({filteredTasks.length})
          </h2>

          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="w-full text-left bg-muted hover:bg-accent rounded-xl p-4 border border-border transition-smooth hover-glow"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-foreground mb-1 truncate">{task.materia}</h3>
                      <p className="text-sm text-muted-foreground truncate">{task.tipo}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs flex-shrink-0">
                      ✓ Completada
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Entrega: {task.fechaEntrega}</span>
                    <span className={`
                      ${task.prioridad === 'alta' ? 'text-red-600' : ''}
                      ${task.prioridad === 'media' ? 'text-yellow-600' : ''}
                      ${task.prioridad === 'baja' ? 'text-blue-600' : ''}
                    `}>
                      Prioridad: {task.prioridad}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-foreground mb-2">No hay tareas completadas</h3>
              <p className="text-muted-foreground text-sm">
                {filterSubject !== 'all' || filterMonth !== 'all'
                  ? 'Intenta cambiar los filtros'
                  : 'Completa tareas para verlas aquí'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
