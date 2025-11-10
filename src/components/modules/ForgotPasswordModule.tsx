import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomModal } from '../CustomModal';
import { CheckCircle } from 'lucide-react';

interface ForgotPasswordModuleProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ForgotPasswordModule({ isOpen, onClose, onSuccess }: ForgotPasswordModuleProps) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  // Mock security question (in real app, fetch from database based on username)
  const mockSecurityQuestion = "What is your mother's maiden name?";
  const mockSecurityAnswer = "santos"; // Mock correct answer
  
  const handleVerifyUsername = () => {
    if (!username) {
      setError('Please enter your username.');
      return;
    }
    // In real app, verify username exists and fetch their security question
    setError('');
    setSecurityQuestion(mockSecurityQuestion);
    setStep(2);
  };
  
  const handleVerifyAnswer = () => {
    if (!securityAnswer) {
      setError('Please answer the security question.');
      return;
    }
    // Verify answer (case-insensitive)
    if (securityAnswer.toLowerCase() !== mockSecurityAnswer.toLowerCase()) {
      setError('Incorrect answer. Please try again.');
      return;
    }
    setError('');
    setStep(3);
  };
  
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setStep(4);
    setTimeout(() => {
      handleClose();
      onSuccess();
    }, 2000);
  };
  
  const handleClose = () => {
    setStep(1);
    setUsername('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 1) handleVerifyUsername();
      else if (step === 2) handleVerifyAnswer();
      else if (step === 3) handleResetPassword();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };
  
  return (
    <CustomModal isOpen={isOpen} onClose={handleClose} title="Forgot Username/Password">
      <div className="w-[400px]" onKeyDown={handleKeyPress}>
        {/* Step 1: Enter Username */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-body text-[#6B7280]">
              Enter your username to retrieve your account.
            </p>
            
            <CustomInput
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            
            {error && (
              <p className="text-body text-[#E02424]">{error}</p>
            )}
            
            <div className="flex gap-2 pt-2">
              <CustomButton variant="primary" onClick={handleVerifyUsername} className="flex-1">
                Continue
              </CustomButton>
              <CustomButton variant="ghost" onClick={handleClose}>
                Cancel
              </CustomButton>
            </div>
          </div>
        )}
        
        {/* Step 2: Answer Security Question */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-body text-[#6B7280]">
              Please answer your security question to verify your identity.
            </p>
            
            <div>
              <label className="label-section text-[#1B1B1B] mb-2 block">Security Question</label>
              <div className="p-3 bg-[#F8F9FA] rounded-md border border-[#E5E7EB]">
                <p className="text-body">{securityQuestion}</p>
              </div>
            </div>
            
            <CustomInput
              label="Your Answer"
              placeholder="Enter your answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              autoFocus
            />
            
            {error && (
              <p className="text-body text-[#E02424]">{error}</p>
            )}
            
            <div className="flex gap-2 pt-2">
              <CustomButton variant="primary" onClick={handleVerifyAnswer} className="flex-1">
                Verify Answer
              </CustomButton>
              <CustomButton variant="ghost" onClick={() => setStep(1)}>
                Back
              </CustomButton>
            </div>
          </div>
        )}
        
        {/* Step 3: Set New Password */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-body text-[#6B7280]">
              Security question verified! Please set your new password.
            </p>
            
            <CustomInput
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
            />
            
            <CustomInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            {error && (
              <p className="text-body text-[#E02424]">{error}</p>
            )}
            
            <div className="flex gap-2 pt-2">
              <CustomButton variant="primary" onClick={handleResetPassword} className="flex-1">
                Reset Password
              </CustomButton>
              <CustomButton variant="ghost" onClick={() => setStep(2)}>
                Back
              </CustomButton>
            </div>
          </div>
        )}
        
        {/* Step 4: Success */}
        {step === 4 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#2EA44F]/10 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-[#2EA44F]" />
            </div>
            
            <h3 className="label-section text-[#2C5E2E]">Password Reset Successfully!</h3>
            <p className="text-body text-[#6B7280]">
              Your password has been updated. You can now log in with your new password.
            </p>
          </div>
        )}
      </div>
    </CustomModal>
  );
}
