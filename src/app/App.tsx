import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { TaskForm } from './components/TaskForm';
import { TaskDetail } from './components/TaskDetail';
import { CalendarView } from './components/CalendarView';
import { History } from './components/History';
import { Toaster } from './components/ui/sonner';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { Task, User, Group } from '../types';
import { updateStreakAndBadges } from '../utils/taskUtils';

type View = 'login' | 'dashboard' | 'calendar' | 'history';

export default function App() {
  const [user, setUser] = useLocalStorage<User | null>('taskSchool_user', null);
  const [groups, setGroups] = useLocalStorage<Group[]>('taskSchool_groups', []);
  const [theme] = useTheme(); // Initialize theme
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('login');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage when user changes
  useEffect(() => {
    const key = user?.isGuest ? 'taskSchool_tasks_guest' : 'taskSchool_tasks';
    const saved = localStorage.getItem(key);
    setTasks(saved ? JSON.parse(saved) : []);
  }, [user]);

  // Save tasks to localStorage when tasks change
  useEffect(() => {
    const key = user?.isGuest ? 'taskSchool_tasks_guest' : 'taskSchool_tasks';
    localStorage.setItem(key, JSON.stringify(tasks));
  }, [tasks, user]);

  // Update streak and badges when tasks or user change
  useEffect(() => {
    updateStreakAndBadges(tasks, user, setUser);
  }, [tasks, user, setUser]);

  const handleLogin = (user: User) => {
    // Asegurar que los nuevos campos estén inicializados
    const updatedUser: User = {
      ...user,
      streak: user.streak ?? 0,
      lastCompletionDate: user.lastCompletionDate ?? null,
      badges: user.badges ?? [],
      groupIds: user.groupIds ?? [],
      points: user.points ?? 0
    };
    setUser(updatedUser);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
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

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completada'>) => {
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
        completada: false,
      };
      setTasks([...tasks, newTask]);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
  };
  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, completada: !t.completada }
        : t
    ));
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
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
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
          user={user}
          setUser={setUser}
          groups={groups}
          setGroups={setGroups}
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
      <Toaster position="top-right" richColors />
    </div>
  );
}
