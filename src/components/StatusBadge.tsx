import React from 'react';

type BadgeStatus = 'Active' | 'Inactive' | 'Borrowed' | 'Archived' | 'Available' | 'Good' | 'Needs Repair' | 'Returned' | 'Overdue' | 'Pending' | 'Approved';

interface StatusBadgeProps {
  status: BadgeStatus;
  showDot?: boolean;
}

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const styles: Record<BadgeStatus, { bg: string; text: string; dot: string }> = {
    Active: { bg: 'bg-[#2EA44F]/10', text: 'text-[#2EA44F]', dot: 'bg-[#2EA44F]' },
    Inactive: { bg: 'bg-[#6B7280]/10', text: 'text-[#6B7280]', dot: 'bg-[#6B7280]' },
    Borrowed: { bg: 'bg-[#F5D000]/20', text: 'text-[#A25E2D]', dot: 'bg-[#F5D000]' },
    Archived: { bg: 'bg-[#6B7280]/10', text: 'text-[#6B7280]', dot: 'bg-[#6B7280]' },
    Available: { bg: 'bg-[#2EA44F]/10', text: 'text-[#2EA44F]', dot: 'bg-[#2EA44F]' },
    Good: { bg: 'bg-[#2EA44F]/10', text: 'text-[#2EA44F]', dot: 'bg-[#2EA44F]' },
    'Needs Repair': { bg: 'bg-[#E02424]/10', text: 'text-[#E02424]', dot: 'bg-[#E02424]' },
    Returned: { bg: 'bg-[#2EA44F]/10', text: 'text-[#2EA44F]', dot: 'bg-[#2EA44F]' },
    Overdue: { bg: 'bg-[#E02424]/10', text: 'text-[#E02424]', dot: 'bg-[#E02424]' },
    Pending: { bg: 'bg-[#F5D000]/20', text: 'text-[#A25E2D]', dot: 'bg-[#F5D000]' },
    Approved: { bg: 'bg-[#2EA44F]/10', text: 'text-[#2EA44F]', dot: 'bg-[#2EA44F]' }
  };
  
  const style = styles[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-body ${style.bg} ${style.text}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      {status}
    </span>
  );
}
