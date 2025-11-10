import React, { useState, useEffect } from 'react';
import { CustomButton } from './CustomButton';
import { ProfileModule } from './modules/ProfileModule';
import logoImage from 'figma:asset/633feec2c326ae570714209ee34b387a14e7344d.png';

interface HeaderProps {
  onLogout: () => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function Header({ onLogout, onToast }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfile, setShowProfile] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <>
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Champion Fine Tooling" className="w-14 h-14" />
          <span className="text-header text-[#2C5E2E]">Automated Management System</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-body text-[#6B7280]">{formatDateTime(currentTime)}</span>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 hover:bg-[#F8F9FA] px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2C5E2E] to-[#F5D000] flex items-center justify-center text-white text-body">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-body">John Doe</span>
              <span className="text-help">Administrator</span>
            </div>
          </button>
          <CustomButton variant="outline" onClick={onLogout}>
            Logout
          </CustomButton>
        </div>
      </header>
      
      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[900px] h-[600px] bg-[#F8F9FA] rounded-lg shadow-2xl overflow-hidden">
            <div className="h-12 bg-gradient-to-r from-[#2C5E2E] to-[#F5D000] flex items-center justify-between px-6">
              <h3 className="text-white label-section">Profile</h3>
              <button 
                onClick={() => setShowProfile(false)}
                className="text-white hover:text-gray-200 text-body"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(100%-3rem)] overflow-auto">
              <ProfileModule onToast={onToast} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
