import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { UserCircle } from 'lucide-react';

interface ProfileModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function ProfileModule({ onToast }: ProfileModuleProps) {
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    username: 'admin',
    role: 'Administrator',
    email: 'john.doe@champion.com',
    contact: '0917-555-0123'
  });
  
  const borrowingHistory = [
    { toolName: '3/8 Drill Bit', borrowDate: '2025-09-15', returnDate: '2025-09-18', status: 'Returned' },
    { toolName: 'Caliper 150mm', borrowDate: '2025-09-20', returnDate: '2025-09-22', status: 'Returned' },
  ];
  
  const handleSaveProfile = () => {
    onToast('success', 'Profile updated successfully.');
  };
  
  const handleChangePassword = () => {
    onToast('info', 'Password change functionality would open a modal.');
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">PROFILE</h1>
        <p className="text-help mt-1">Home / Profile</p>
      </div>
      
      <div className="grid grid-cols-[320px_1fr] gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] h-fit">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2C5E2E] to-[#F5D000] flex items-center justify-center text-white mb-4">
              <UserCircle size={48} />
            </div>
            <h3 className="label-section text-[#2C5E2E]">{profileData.fullName}</h3>
            <p className="text-body text-[#6B7280]">{profileData.role}</p>
            <p className="text-help mt-2">Last login: Oct 14, 2025 08:30 AM</p>
          </div>
          
          <div className="space-y-2 py-4 border-t border-[#E5E7EB]">
            <div className="flex justify-between text-body">
              <span className="text-[#6B7280]">Username:</span>
              <span>{profileData.username}</span>
            </div>
            <div className="flex justify-between text-body">
              <span className="text-[#6B7280]">Email:</span>
              <span>{profileData.email}</span>
            </div>
            <div className="flex justify-between text-body">
              <span className="text-[#6B7280]">Contact:</span>
              <span>{profileData.contact}</span>
            </div>
          </div>
        </div>
        
        {/* Edit Form & History */}
        <div className="space-y-6">
          <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
            <h3 className="label-section text-[#2C5E2E] mb-4">Edit Profile</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <CustomInput
                label="Full Name"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              />
              
              <CustomInput
                label="Username"
                value={profileData.username}
                readOnly
                helperText="Username cannot be changed"
              />
              
              <CustomInput
                label="Role"
                value={profileData.role}
                readOnly
              />
              
              <CustomInput
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
              
              <CustomInput
                label="Contact"
                value={profileData.contact}
                onChange={(e) => setProfileData({ ...profileData, contact: e.target.value })}
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <CustomButton variant="primary" onClick={handleSaveProfile}>
                Save Profile
              </CustomButton>
              <CustomButton variant="secondary" onClick={handleChangePassword}>
                Change Password
              </CustomButton>
            </div>
          </div>
          
          <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
            <h3 className="label-section text-[#2C5E2E] mb-4">My Borrowing History</h3>
            <CustomTable
              columns={[
                { key: 'toolName', label: 'Tool Name' },
                { key: 'borrowDate', label: 'Borrow Date', width: '120px' },
                { key: 'returnDate', label: 'Return Date', width: '120px' },
                { key: 'status', label: 'Status', width: '100px' },
              ]}
              data={borrowingHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
