import { useState } from 'react';
import { ArrowLeft, Filter, TrendingUp, CheckCircle2, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

interface HistoryProps {
  tasks: Task[];
  onBack: () => void;
  onTaskClick: (task: Task) => void;
}

export function History({ tasks, onBack, onTaskClick }: HistoryProps) {
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const completedTasks = tasks.filter(t => t.completed);

  // Get unique subjects
  const subjects = Array.from(new Set(tasks.map(t => t.subject))).sort();

  // Get unique months from tasks
  const getMonthYear = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('es', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const months = Array.from(
    new Set(tasks.map(t => getMonthYear(t.dueDate)))
  ).sort();

  // Filter tasks
  const filteredTasks = completedTasks.filter(task => {
    const matchesSubject = filterSubject === 'all' || task.subject === filterSubject;
    const matchesMonth = filterMonth === 'all' || getMonthYear(task.dueDate) === filterMonth;
    return matchesSubject && matchesMonth;
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const totalCompleted = completedTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Subject statistics for chart
  const subjectStats = subjects.map(subject => {
    const subjectTasks = tasks.filter(t => t.subject === subject);
    const subjectCompleted = subjectTasks.filter(t => t.completed).length;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl md:text-2xl text-gray-900">Historial y Estadísticas</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl text-gray-900 mb-1">{totalTasks}</p>
            <p className="text-sm text-gray-600">Tareas totales</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl text-gray-900 mb-1">{totalCompleted}</p>
            <p className="text-sm text-gray-600">Tareas completadas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl text-gray-900 mb-1">{completionRate}%</p>
            <p className="text-sm text-gray-600">Tasa de cumplimiento</p>
          </div>
        </div>

        {/* Chart */}
        {subjectStats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg text-gray-900 mb-6">Cumplimiento por Materia</h2>
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg text-gray-900">Filtros</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Materia</label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="h-11 border-gray-300">
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
              <label className="text-sm text-gray-600 mb-2 block">Mes</label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="h-11 border-gray-300">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg text-gray-900 mb-4">
            Tareas Completadas ({filteredTasks.length})
          </h2>

          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 mb-1 truncate">{task.subject}</h3>
                      <p className="text-sm text-gray-600 truncate">{task.type}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs flex-shrink-0">
                      ✓ Completada
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Entrega: {task.dueDate}</span>
                    <span className={`
                      ${task.priority === 'alta' ? 'text-red-600' : ''}
                      ${task.priority === 'media' ? 'text-yellow-600' : ''}
                      ${task.priority === 'baja' ? 'text-blue-600' : ''}
                    `}>
                      Prioridad: {task.priority}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2">No hay tareas completadas</h3>
              <p className="text-gray-600 text-sm">
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
