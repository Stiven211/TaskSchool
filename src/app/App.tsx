import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { TaskForm } from './components/TaskForm';
import { TaskDetail } from './components/TaskDetail';
import { CalendarView } from './components/CalendarView';
import { History } from './components/History';

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

type View = 'login' | 'dashboard' | 'calendar' | 'history';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('login');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  
  // Sample tasks with realistic data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      subject: 'Matemáticas',
      type: 'Ejercicios de álgebra',
      assignedDate: '2026-01-08',
      dueDate: '2026-01-12',
      description: 'Resolver ejercicios del capítulo 5, páginas 120-125. Enfocarse en ecuaciones de segundo grado y sistemas de ecuaciones.',
      priority: 'alta',
      completed: false,
    },
    {
      id: '2',
      subject: 'Lengua y Literatura',
      type: 'Análisis de texto',
      assignedDate: '2026-01-07',
      dueDate: '2026-01-14',
      description: 'Leer el cuento "El Aleph" de Jorge Luis Borges y escribir un análisis de 2 páginas sobre los símbolos principales.',
      priority: 'media',
      completed: false,
    },
    {
      id: '3',
      subject: 'Ciencias Naturales',
      type: 'Trabajo práctico',
      assignedDate: '2026-01-06',
      dueDate: '2026-01-15',
      description: 'Investigar sobre el ciclo del agua y crear una presentación visual explicando cada etapa del proceso.',
      priority: 'baja',
      completed: false,
    },
    {
      id: '4',
      subject: 'Historia',
      type: 'Informe escrito',
      assignedDate: '2026-01-05',
      dueDate: '2026-01-11',
      description: 'Escribir un ensayo de 3 páginas sobre las causas de la Revolución Industrial.',
      priority: 'alta',
      completed: false,
    },
    {
      id: '5',
      subject: 'Inglés',
      type: 'Vocabulario',
      assignedDate: '2026-01-04',
      dueDate: '2026-01-08',
      description: 'Estudiar las 50 palabras nuevas de la unidad 6 y prepararse para la prueba oral.',
      priority: 'alta',
      completed: true,
    },
    {
      id: '6',
      subject: 'Química',
      type: 'Problemas de estequiometría',
      assignedDate: '2025-12-28',
      dueDate: '2026-01-09',
      description: 'Resolver los 15 problemas de la guía de estequiometría.',
      priority: 'media',
      completed: true,
    },
    {
      id: '7',
      subject: 'Educación Física',
      type: 'Investigación sobre deportes',
      assignedDate: '2025-12-20',
      dueDate: '2026-01-05',
      description: 'Investigar sobre la historia del fútbol y presentar en clase.',
      priority: 'baja',
      completed: true,
    },
  ]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
    setShowTaskDetail(false);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...taskData }
          : t
      ));
    } else {
      // Add new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(undefined);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, completed: !t.completed }
        : t
    ));
  };

  const handleViewCalendar = () => {
    setCurrentView('calendar');
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (!isLoggedIn && currentView === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onViewTask={handleViewTask}
          onToggleComplete={handleToggleComplete}
          onViewCalendar={handleViewCalendar}
          onViewHistory={handleViewHistory}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'calendar' && (
        <CalendarView
          tasks={tasks}
          onBack={handleBackToDashboard}
          onTaskClick={handleViewTask}
        />
      )}

      {currentView === 'history' && (
        <History
          tasks={tasks}
          onBack={handleBackToDashboard}
          onTaskClick={handleViewTask}
        />
      )}

      {showTaskForm && (
        <TaskForm
          onSave={handleSaveTask}
          onCancel={handleCancelForm}
          editingTask={editingTask}
        />
      )}

      {showTaskDetail && selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={handleCloseTaskDetail}
          onEdit={handleEditTask}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </>
  );
}
