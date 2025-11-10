import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CustomButton } from './CustomButton';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'archive';
}

export function CustomModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}: CustomModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && onConfirm) onConfirm();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, onConfirm]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[520px] bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="h-2 bg-gradient-to-r from-[#2C5E2E] to-[#F5D000]" />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-module text-[#2C5E2E]">{title}</h3>
            <button 
              onClick={onClose}
              className="text-[#6B7280] hover:text-[#1B1B1B] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            {children}
          </div>
          
          <div className="flex gap-3 justify-end">
            <CustomButton variant="ghost" onClick={onClose}>
              {cancelText}
            </CustomButton>
            {onConfirm && (
              <CustomButton 
                variant={variant === 'danger' ? 'danger' : variant === 'archive' ? 'archive' : 'secondary'}
                onClick={onConfirm}
              >
                {confirmText}
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
