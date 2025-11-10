import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { LoginModule } from './components/modules/LoginModule';
import { ForgotPasswordModule } from './components/modules/ForgotPasswordModule';
import { DashboardModule } from './components/modules/DashboardModule';
import { RoleManagementModule } from './components/modules/RoleManagementModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { TaggingModule } from './components/modules/TaggingModule';
import { BorrowingModule } from './components/modules/BorrowingModule';
import { TrackingModule } from './components/modules/TrackingModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { MaintenanceModule } from './components/modules/MaintenanceModule';
import { HelpModule } from './components/modules/HelpModule';


type ToastType = 'success' | 'error' | 'info';
type UserRole = 'Admin' | 'Staff';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    // Set default module based on role
    if (role === 'Staff') {
      setActiveModule('inventory');
    } else {
      setActiveModule('dashboard');
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('Admin');
    setActiveModule('dashboard');
    addToast('info', 'Logged out successfully.');
  };
  
  const handleModuleChange = (module: string) => {
    if (module === 'exit') {
      handleLogout();
    } else {
      setActiveModule(module);
    }
  };

  
  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="w-[1280px] h-[720px] mx-auto bg-white overflow-hidden shadow-2xl">
        <LoginModule
          onLogin={handleLogin}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
        
        <ForgotPasswordModule
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
          onSuccess={() => addToast('success', 'Password reset successfully.')}
        />

        
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  
  // Main application
  return (
    <div className="w-[1280px] h-[720px] mx-auto bg-white overflow-hidden shadow-2xl flex flex-col">
      <Header onLogout={handleLogout} onToast={addToast} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeModule={activeModule} 
          onModuleChange={handleModuleChange}
          userRole={userRole}
        />
        
        <main className="flex-1 overflow-hidden bg-[#F8F9FA]">
          {activeModule === 'dashboard' && userRole === 'Admin' && (
            <DashboardModule onNavigate={handleModuleChange} />
          )}
          {activeModule === 'inventory' && (
            <InventoryModule onToast={addToast} isViewOnly={userRole === 'Staff'} />
          )}
          {activeModule === 'tagging' && userRole === 'Admin' && (
            <TaggingModule onToast={addToast} />
          )}
          {activeModule === 'borrowing' && (
            <BorrowingModule onToast={addToast} userRole={userRole} />
          )}
          {activeModule === 'tracking' && (
            <TrackingModule onToast={addToast} userRole={userRole} />
          )}
          {activeModule === 'reports' && userRole === 'Admin' && (
            <ReportsModule onToast={addToast} />
          )}
          {activeModule === 'maintenance' && userRole === 'Admin' && (
            <MaintenanceModule onToast={addToast} onNavigate={handleModuleChange} />
          )}
          {activeModule === 'roles' && userRole === 'Admin' && (
            <RoleManagementModule onToast={addToast} />
          )}
          {activeModule === 'help' && (
            <HelpModule onToast={addToast} />
          )}
        </main>
      </div>


      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
