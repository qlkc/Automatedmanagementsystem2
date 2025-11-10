import React, { useState } from 'react';
import { Package, CheckCircle, Clock, Users, Plus, ArrowRightLeft, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { CustomTable } from '../CustomTable';

interface DashboardModuleProps {
  onNavigate: (module: string) => void;
}

export function DashboardModule({ onNavigate }: DashboardModuleProps) {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const kpiData = [
    { label: 'Total Tools', value: '245', icon: Package, color: 'from-[#2C5E2E] to-[#194620]' },
    { label: 'Available Tools', value: '198', icon: CheckCircle, color: 'from-[#2EA44F] to-[#2C5E2E]' },
    { label: 'Borrowed', value: '47', icon: Clock, color: 'from-[#F5D000] to-[#FFD74D]' },
    { label: 'Registered Employees', value: '86', icon: Users, color: 'from-[#A25E2D] to-[#8d5126]' },
  ];
  
  const recentActivity = [
    { date: '2025-10-14 09:23', action: 'Borrowed', item: '3/8 Drill Bit', user: 'J. Santos' },
    { date: '2025-10-14 08:15', action: 'Returned', item: 'Hammer 1kg', user: 'M. Cruz' },
    { date: '2025-10-13 16:45', action: 'Added', item: 'Caliper 150mm', user: 'Admin' },
  ];
  
  const quickActions = [
    { label: 'Add Product', icon: Plus, module: 'inventory', color: '#2C5E2E' },
    { label: 'Assign Tag', icon: Package, module: 'tagging', color: '#F5D000' },
    { label: 'Borrow Tool', icon: ArrowRightLeft, module: 'borrowing', color: '#2EA44F' },
    { label: 'View Tracking', icon: FileText, module: 'tracking', color: '#A25E2D' },
  ];
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">DASHBOARD</h1>
        <p className="text-help mt-1">Home / Dashboard</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-[10px] p-4 shadow-sm border border-[#E5E7EB]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#1B1B1B]">{kpi.value}</div>
              <div className="text-body text-[#6B7280]">{kpi.label}</div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Recent Activity</h3>
          <CustomTable
            columns={[
              { key: 'date', label: 'Date', width: '140px' },
              { key: 'action', label: 'Action', width: '80px' },
              { key: 'item', label: 'Item' },
              { key: 'user', label: 'User', width: '100px' },
            ]}
            data={recentActivity}
          />
        </div>
        
        {/* Quick Actions - Collapsible */}
        <div className="bg-white rounded-[10px] shadow-sm border border-[#E5E7EB] overflow-hidden">
          <button
            onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
            className="w-full flex items-center justify-between p-6 hover:bg-[#F8F9FA] transition-colors"
          >
            <h3 className="label-section text-[#2C5E2E]">Quick Actions</h3>
            {isQuickActionsOpen ? (
              <ChevronUp size={20} className="text-[#2C5E2E]" />
            ) : (
              <ChevronDown size={20} className="text-[#2C5E2E]" />
            )}
          </button>
          
          {isQuickActionsOpen && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onNavigate(action.module)}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 border-[#E5E7EB] hover:border-[#F5D000] transition-all hover:shadow-md"
                      style={{ borderColor: `${action.color}20` }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${action.color}20` }}
                      >
                        <Icon size={24} style={{ color: action.color }} />
                      </div>
                      <span className="text-body text-center">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
