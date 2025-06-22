import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Calendar from './components/Calendar';
import Kanban from './components/Kanban';
import Users from './components/Users';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'calendar':
        return <Calendar />;
      case 'kanban':
        return <Kanban />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="ml-16 lg:ml-64 p-6 transition-all duration-300">
          {renderActiveView()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;