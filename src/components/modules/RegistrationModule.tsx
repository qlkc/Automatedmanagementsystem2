import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { CheckCircle } from 'lucide-react';

interface RegistrationModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function RegistrationModule({ onToast }: RegistrationModuleProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Staff',
    securityQuestion: '',
    securityAnswer: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const securityQuestions = [
    { value: '', label: 'Select a security question' },
    { value: 'q1', label: "What is your mother's maiden name?" },
    { value: 'q2', label: 'What was the name of your first pet?' },
    { value: 'q3', label: 'What city were you born in?' },
    { value: 'q4', label: 'What is your favorite food?' },
    { value: 'q5', label: 'What was the name of your elementary school?' },
  ];
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 'U001', fullName: 'Juan Santos', username: 'j.santos', email: 'j.santos@example.com', role: 'Staff', status: 'Approved' },
    { id: 'U002', fullName: 'Maria Cruz', username: 'm.cruz', email: 'm.cruz@example.com', role: 'Admin', status: 'Approved' },
    { id: 'U003', fullName: 'Pedro Reyes', username: 'p.reyes', email: 'p.reyes@example.com', role: 'Staff', status: 'Pending' },
  ]);
  
  const handleRegister = () => {
    if (!formData.fullName || !formData.email || !formData.username || !formData.password || 
        !formData.securityQuestion || !formData.securityAnswer) {
      onToast('error', 'Please fill in all required fields including security question.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      onToast('error', 'Passwords do not match.');
      return;
    }
    
    if (!formData.email.includes('@')) {
      onToast('error', 'Please enter a valid email address.');
      return;
    }
    
    setStep(2);
  };
  
  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      onToast('error', 'Please enter a 6-digit verification code.');
      return;
    }
    
    setStep(3);
    onToast('success', 'User registered successfully.');
  };
  
  const handleResendCode = () => {
    onToast('info', 'Verification code resent to your email.');
  };
  
  const handleBackToLogin = () => {
    setStep(1);
    setFormData({
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'Staff',
      securityQuestion: '',
      securityAnswer: ''
    });
    setVerificationCode('');
  };
  
  const filteredUsers = registeredUsers.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">REGISTRATION & VERIFICATION</h1>
        <p className="text-help mt-1">Home / Registration</p>
      </div>
      
      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-body ${
            step >= 1 ? 'bg-[#2C5E2E] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#2C5E2E]' : 'bg-[#E5E7EB]'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-body ${
            step >= 2 ? 'bg-[#2C5E2E] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
          }`}>
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-[#2C5E2E]' : 'bg-[#E5E7EB]'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-body ${
            step >= 3 ? 'bg-[#2C5E2E] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
          }`}>
            3
          </div>
        </div>
      </div>
      
      <div className="max-w-xl mx-auto">
        {/* Step 1: Registration Form */}
        {step === 1 && (
          <div className="bg-white rounded-[10px] p-8 shadow-sm border border-[#E5E7EB]">
            <h3 className="label-section text-[#2C5E2E] mb-6">User Information</h3>
            
            <div className="space-y-3">
              <CustomInput
                label="Full Name"
                placeholder="Juan Dela Cruz"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              
              <CustomInput
                label="Email"
                type="email"
                placeholder="juan.delacruz@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              
              <CustomInput
                label="Username"
                placeholder="j.delacruz"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              
              <CustomInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              
              <CustomInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              
              <CustomSelect
                label="Role"
                options={[
                  { value: 'Admin', label: 'Administrator' },
                  { value: 'Staff', label: 'Staff' }
                ]}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              
              <div className="pt-3 border-t border-[#E5E7EB]">
                <p className="text-help mb-3">Security Question (for password recovery)</p>
                <CustomSelect
                  label="Security Question"
                  options={securityQuestions}
                  value={formData.securityQuestion}
                  onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                />
                
                <CustomInput
                  label="Your Answer"
                  placeholder="Enter your answer"
                  value={formData.securityAnswer}
                  onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                  className="mt-3"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <CustomButton variant="secondary" onClick={handleRegister} className="flex-1">
                Register
              </CustomButton>
              <CustomButton variant="ghost" onClick={handleBackToLogin}>
                Cancel
              </CustomButton>
            </div>
          </div>
        )}
        
        {/* Step 2: Verification Code */}
        {step === 2 && (
          <div className="bg-white rounded-[10px] p-8 shadow-sm border border-[#E5E7EB]">
            <h3 className="label-section text-[#2C5E2E] mb-4">Verification Code</h3>
            <p className="text-body mb-6">
              We've sent a 6-digit verification code to <strong>{formData.email}</strong>
            </p>
            
            <CustomInput
              label="Enter Code"
              placeholder="123456"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              helperText="Enter the 6-digit code sent to your email"
            />
            
            <div className="mt-4">
              <button
                onClick={handleResendCode}
                className="text-body text-[#2C5E2E] hover:underline"
              >
                Didn't receive the code? Resend
              </button>
            </div>
            
            <div className="flex gap-3 mt-6">
              <CustomButton variant="primary" onClick={handleVerify} className="flex-1">
                Verify
              </CustomButton>
              <CustomButton variant="ghost" onClick={() => setStep(1)}>
                Back
              </CustomButton>
            </div>
          </div>
        )}
        
        {/* Step 3: Success */}
        {step === 3 && (
          <div className="bg-white rounded-[10px] p-8 shadow-sm border border-[#E5E7EB] text-center">
            <div className="w-16 h-16 rounded-full bg-[#2EA44F]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-[#2EA44F]" />
            </div>
            
            <h3 className="label-section text-[#2C5E2E] mb-2">Account Created Successfully!</h3>
            <p className="text-body text-[#6B7280] mb-6">
              Your account is pending admin approval. You will be notified once approved.
            </p>
            
            <CustomButton variant="primary" onClick={handleBackToLogin}>
              Back to Login
            </CustomButton>
          </div>
        )}
      </div>
      
      {/* Registered Users List */}
      <div className="max-w-5xl mx-auto mt-6">
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="label-section text-[#2C5E2E]">Registered Users</h3>
            <CustomInput
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
          
          <CustomTable
            columns={[
              { key: 'id', label: 'User ID', width: '80px' },
              { key: 'fullName', label: 'Full Name', width: '180px' },
              { key: 'username', label: 'Username', width: '120px' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role', width: '100px' },
              { key: 'status', label: 'Status', width: '100px' }
            ]}
            data={filteredUsers}
          />
        </div>
      </div>
    </div>
  );
}
