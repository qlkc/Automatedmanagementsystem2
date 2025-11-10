import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'archive';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function CustomButton({ 
  variant = 'primary', 
  children, 
  className = '',
  disabled,
  ...props 
}: CustomButtonProps) {
  const baseStyles = 'h-9 px-3 rounded-lg transition-all duration-200 text-body cursor-pointer inline-flex items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-[#2C5E2E] text-white hover:bg-[#234d25] active:bg-[#1a3b1c]',
    secondary: 'bg-gradient-to-r from-[#F5D000] to-[#FFD74D] text-[#1B1B1B] hover:from-[#e6c400] hover:to-[#f0ca45] active:from-[#d4b600] active:to-[#e0bb3d]',
    danger: 'bg-[#A25E2D] text-white hover:bg-[#8d5126] active:bg-[#764420]',
    archive: 'bg-[#A25E2D] text-white hover:bg-[#8d5126] active:bg-[#764420]',
    ghost: 'bg-transparent border border-[#E5E7EB] text-[#1B1B1B] hover:bg-[#F8F9FA] active:bg-[#E5E7EB]',
    outline: 'bg-transparent border-2 border-[#F5D000] text-[#1B1B1B] hover:bg-[#F5D000]/10 active:bg-[#F5D000]/20'
  };
  
  const disabledStyles = disabled ? 'opacity-40 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
