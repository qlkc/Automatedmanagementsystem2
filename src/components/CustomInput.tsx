import React from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function CustomInput({ 
  label, 
  helperText, 
  error, 
  className = '',
  ...props 
}: CustomInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="label-section text-[#1B1B1B]">
          {label}
        </label>
      )}
      <input
        className={`h-[34px] border rounded-md px-2.5 text-body transition-all
          ${error ? 'border-[#E02424]' : 'border-[#E5E7EB]'}
          focus:border-[#2C5E2E] focus:ring-2 focus:ring-[#2C5E2E]/12 outline-none
          disabled:opacity-40 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />
      {helperText && !error && (
        <span className="text-help">{helperText}</span>
      )}
      {error && (
        <span className="text-help text-[#E02424]">{error}</span>
      )}
    </div>
  );
}
