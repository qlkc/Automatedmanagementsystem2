import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { CustomModal } from '../CustomModal';
import { FileText, Download } from 'lucide-react';

interface ReportsModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function ReportsModule({ onToast }: ReportsModuleProps) {
  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    category: 'All',
    borrower: '',
    status: 'All'
  });
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'PDF',
    orientation: 'Landscape',
    includeLogo: true
  });
  
  const reportData = [
    { tool: '3/8 Drill Bit', tag: 'TAG-101', borrower: 'J. Santos', borrowDate: '2025-10-10', returnDate: '2025-10-14', condition: 'Good' },
    { tool: 'Hammer 1kg', tag: 'TAG-102', borrower: 'M. Cruz', borrowDate: '2025-10-12', returnDate: '-', condition: 'Good' },
    { tool: 'Caliper 150mm', tag: 'TAG-103', borrower: 'P. Reyes', borrowDate: '2025-10-08', returnDate: '2025-10-11', condition: 'Needs Repair' },
  ];
  
  const kpiData = [
    { label: 'Total Transactions', value: '156' },
    { label: 'Active Borrows', value: '23' },
    { label: 'Returns This Month', value: '89' },
    { label: 'Late Returns', value: '4' }
  ];
  
  const handleExport = () => {
    setShowExportModal(false);
    onToast('success', `Report exported as ${exportOptions.format} successfully.`);
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">REPORTS</h1>
        <p className="text-help mt-1">Home / Reports</p>
      </div>
      
      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-[10px] p-4 shadow-sm border border-[#E5E7EB]">
            <div className="text-2xl font-bold text-[#2C5E2E]">{kpi.value}</div>
            <div className="text-body text-[#6B7280]">{kpi.label}</div>
          </div>
        ))}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] mb-6">
        <h3 className="label-section text-[#2C5E2E] mb-4">Report Filters</h3>
        <div className="grid grid-cols-5 gap-3">
          <CustomInput
            label="Start Date"
            type="date"
            value={filters.dateStart}
            onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
          />
          <CustomInput
            label="End Date"
            type="date"
            value={filters.dateEnd}
            onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
          />
          <CustomSelect
            label="Category"
            options={[
              { value: 'All', label: 'All Categories' },
              { value: 'Tools', label: 'Tools' },
              { value: 'Measuring', label: 'Measuring' }
            ]}
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />
          <CustomInput
            label="Borrower"
            placeholder="Any"
            value={filters.borrower}
            onChange={(e) => setFilters({ ...filters, borrower: e.target.value })}
          />
          <CustomSelect
            label="Status"
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Borrowed', label: 'Borrowed' },
              { value: 'Returned', label: 'Returned' }
            ]}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />
        </div>
      </div>
      
      {/* Results */}
      <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="label-section text-[#2C5E2E]">Report Results</h3>
          <div className="flex gap-2">
            <CustomButton variant="secondary" onClick={() => setShowExportModal(true)}>
              <FileText size={16} className="mr-2" />
              Generate PDF
            </CustomButton>
            <CustomButton variant="ghost" onClick={() => onToast('success', 'CSV exported successfully')}>
              <Download size={16} className="mr-2" />
              Export CSV
            </CustomButton>
          </div>
        </div>
        
        <CustomTable
          columns={[
            { key: 'tool', label: 'Tool' },
            { key: 'tag', label: 'Tag', width: '100px' },
            { key: 'borrower', label: 'Borrower', width: '120px' },
            { key: 'borrowDate', label: 'Borrow Date', width: '110px' },
            { key: 'returnDate', label: 'Return Date', width: '110px' },
            { key: 'condition', label: 'Condition', width: '120px' },
          ]}
          data={reportData}
        />
      </div>
      
      <CustomModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleExport}
        title="Export Report"
        confirmText="Export"
      >
        <div className="space-y-4">
          <CustomSelect
            label="Format"
            options={[
              { value: 'PDF', label: 'PDF Document' },
              { value: 'CSV', label: 'CSV Spreadsheet' }
            ]}
            value={exportOptions.format}
            onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value })}
          />
          
          {exportOptions.format === 'PDF' && (
            <>
              <CustomSelect
                label="Orientation"
                options={[
                  { value: 'Portrait', label: 'Portrait' },
                  { value: 'Landscape', label: 'Landscape' }
                ]}
                value={exportOptions.orientation}
                onChange={(e) => setExportOptions({ ...exportOptions, orientation: e.target.value })}
              />
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeLogo"
                  checked={exportOptions.includeLogo}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeLogo: e.target.checked })}
                  className="w-4 h-4 accent-[#2C5E2E]"
                />
                <label htmlFor="includeLogo" className="text-body cursor-pointer">
                  Include company logo
                </label>
              </div>
            </>
          )}
        </div>
      </CustomModal>
    </div>
  );
}
