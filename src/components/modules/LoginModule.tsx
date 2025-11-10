import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomButton } from '../CustomButton';
import logoImage from 'figma:asset/633feec2c326ae570714209ee34b387a14e7344d.png';

interface LoginModuleProps {
  onLogin: (role: 'Admin' | 'Staff') => void;
  onForgotPassword: () => void;
}

export function LoginModule({ onLogin, onForgotPassword }: LoginModuleProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Demo credentials
    if (username === 'admin' && password === 'admin') {
      onLogin('Admin');
    } else if (username === 'staff' && password === 'staff') {
      onLogin('Staff');
    } else {
      setError('Incorrect username or password.');
    }
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2C5E2E]/10 to-[#F5D000]/10">
      <div className="w-[420px] bg-white rounded-[10px] shadow-lg p-10">
        <div className="flex flex-col items-center mb-6">
          <img src={logoImage} alt="Champion Fine Tooling" className="w-20 h-20 mb-4" />
          <h2 className="text-header text-[#2C5E2E]">Welcome — Champion Fine Tooling</h2>
          <p className="text-help mt-1">Automated Management System</p>
        </div>
        
        <div className="space-y-4">
          <CustomInput
            label="Username"
            placeholder="e.g., j.santos"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <CustomInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-[#2C5E2E]"
            />
            <label htmlFor="remember" className="text-body cursor-pointer">
              Remember me
            </label>
          </div>
          
          {error && (
            <div className="text-body text-[#E02424] bg-[#E02424]/10 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <CustomButton 
            variant="primary" 
            className="w-full"
            onClick={handleLogin}
          >
            Login
          </CustomButton>
          
          <button 
            onClick={onForgotPassword}
            className="w-full text-center text-body text-[#2C5E2E] hover:underline mt-3"
          >
            Forgot Username/Password?
          </button>
        </div>
        
        <p className="text-help text-center mt-6">
          Hint: Use username "admin" and password "admin" to login
        </p>
      </div>
    </div>
  );
}
