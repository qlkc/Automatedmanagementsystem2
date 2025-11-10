import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { CustomModal } from '../CustomModal';
import { StatusBadge } from '../StatusBadge';
import { FileText } from 'lucide-react';

interface TrackingModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
  userRole: 'Admin' | 'Staff';
}

export function TrackingModule({ onToast, userRole }: TrackingModuleProps) {
  const currentUser = userRole === 'Staff' ? 'J. Santos' : ''; // Mock current user for staff
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    dateFrom: '',
    dateTo: ''
  });
  
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const transactions = [
    {
      transId: '00001',
      tagId: 'TAG-001',
      toolName: 'Torque Wrench',
      borrower: 'J. Santos',
      department: 'FAB',
      borrowDate: '2025-01-10',
      expectedReturn: '2025-01-12',
      actualReturn: '2025-01-12',
      condition: 'Good',
      status: 'Returned'
    },
    {
      transId: '00002',
      tagId: 'TAG-014',
      toolName: 'Drill',
      borrower: 'R. Cruz',
      department: 'MFG',
      borrowDate: '2025-01-13',
      expectedReturn: '2025-01-15',
      actualReturn: '—',
      condition: '—',
      status: 'Borrowed'
    },
    {
      transId: '00003',
      tagId: 'TAG-023',
      toolName: 'Welding Mask',
      borrower: 'K. Rivera',
      department: 'FAB',
      borrowDate: '2025-01-05',
      expectedReturn: '2025-01-07',
      actualReturn: '2025-01-09',
      condition: 'Damaged',
      status: 'Overdue'
    },
    {
      transId: '00004',
      tagId: 'TAG-102',
      toolName: 'Hammer 1kg',
      borrower: 'M. Cruz',
      department: 'Assembly',
      borrowDate: '2025-01-12',
      expectedReturn: '2025-01-14',
      actualReturn: '—',
      condition: '—',
      status: 'Borrowed'
    },
    {
      transId: '00005',
      tagId: 'TAG-101',
      toolName: '3/8 Drill Bit',
      borrower: 'P. Reyes',
      department: 'Maintenance',
      borrowDate: '2025-01-08',
      expectedReturn: '2025-01-10',
      actualReturn: '2025-01-10',
      condition: 'Good',
      status: 'Returned'
    }
  ];
  
  const filteredTransactions = transactions.filter(t => {
    // Staff can only see their own transactions
    const matchUser = userRole === 'Admin' || t.borrower === currentUser;
    
    const matchSearch = !filters.search || 
      t.tagId.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.borrower.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.toolName.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchStatus = filters.status === 'All' || t.status === filters.status;
    
    return matchUser && matchSearch && matchStatus;
  });
  
  const handleClear = () => {
    setFilters({ search: '', status: 'All', dateFrom: '', dateTo: '' });
  };
  
  const handleExportCSV = () => {
    onToast('success', 'Records exported successfully.');
  };
  
  const handleExportPDF = () => {
    onToast('success', 'PDF report generated successfully.');
  };
  
  const handleRowClick = (row: any) => {
    setSelectedTransaction(row);
    setShowDetailModal(true);
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">TRACKING & ACCOUNTABILITY</h1>
        <p className="text-help mt-1">Home / Tracking & Accountability</p>
      </div>
      
      {/* Filters & Search */}
      <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] mb-6">
        <h3 className="label-section text-[#2C5E2E] mb-4">Filters & Search</h3>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          <CustomInput
            placeholder="Search by Tool Tag, Borrower..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          
          <CustomSelect
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Borrowed', label: 'Borrowed' },
              { value: 'Returned', label: 'Returned' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Archived', label: 'Archived' }
            ]}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />
          
          <CustomInput
            type="date"
            placeholder="From Date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />
          
          <CustomInput
            type="date"
            placeholder="To Date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
        </div>
        
        <div className="flex gap-2">
          <CustomButton variant="primary">Search</CustomButton>
          <CustomButton variant="ghost" onClick={handleClear}>Clear</CustomButton>
          {userRole === 'Admin' && (
            <CustomButton variant="outline" onClick={handleExportCSV}>Export CSV</CustomButton>
          )}
        </div>
      </div>
      
      {/* Accountability Table */}
      <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="label-section text-[#2C5E2E]">
            Transaction Records ({filteredTransactions.length})
            {userRole === 'Staff' && <span className="text-[#6B7280] ml-2">(Your Transactions)</span>}
          </h3>
          {userRole === 'Admin' && (
            <CustomButton variant="secondary" onClick={handleExportPDF}>
              <FileText size={16} className="mr-2" />
              Export PDF
            </CustomButton>
          )}
        </div>
        
        {filteredTransactions.length > 0 ? (
          <CustomTable
            columns={[
              { key: 'transId', label: 'Trans ID', width: '80px' },
              { key: 'tagId', label: 'Tag ID', width: '90px' },
              { key: 'toolName', label: 'Tool Name', width: '150px' },
              { key: 'borrower', label: 'Borrower', width: '120px' },
              { key: 'department', label: 'Dept', width: '100px' },
              { key: 'borrowDate', label: 'Borrow Date', width: '100px' },
              { key: 'expectedReturn', label: 'Exp. Return', width: '100px' },
              { key: 'actualReturn', label: 'Act. Return', width: '100px' },
              { key: 'condition', label: 'Condition', width: '100px' },
              { key: 'status', label: 'Status', width: '90px' }
            ]}
            data={filteredTransactions}
            onRowClick={handleRowClick}
          />
        ) : (
          <div className="text-center py-12 text-[#6B7280] text-body">
            No accountability records found. Try adjusting your filters.
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-help">
            Total records: {filteredTransactions.length}
          </p>
        </div>
      </div>
      
      {/* Transaction Detail Modal */}
      <CustomModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Transaction Details"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-help">Transaction ID</label>
                <p className="text-body">{selectedTransaction.transId}</p>
              </div>
              <div>
                <label className="text-help">Tag ID</label>
                <p className="text-body">{selectedTransaction.tagId}</p>
              </div>
              <div>
                <label className="text-help">Tool Name</label>
                <p className="text-body">{selectedTransaction.toolName}</p>
              </div>
              <div>
                <label className="text-help">Status</label>
                <StatusBadge status={selectedTransaction.status as any} />
              </div>
            </div>
            
            <div className="border-t border-[#E5E7EB] pt-4">
              <h4 className="label-section text-[#2C5E2E] mb-3">Borrower Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-help">Name</label>
                  <p className="text-body">{selectedTransaction.borrower}</p>
                </div>
                <div>
                  <label className="text-help">Department</label>
                  <p className="text-body">{selectedTransaction.department}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-[#E5E7EB] pt-4">
              <h4 className="label-section text-[#2C5E2E] mb-3">Timeline</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-help">Borrow Date</label>
                  <p className="text-body">{selectedTransaction.borrowDate}</p>
                </div>
                <div>
                  <label className="text-help">Expected Return</label>
                  <p className="text-body">{selectedTransaction.expectedReturn}</p>
                </div>
                <div>
                  <label className="text-help">Actual Return</label>
                  <p className="text-body">{selectedTransaction.actualReturn}</p>
                </div>
                <div>
                  <label className="text-help">Condition</label>
                  <p className="text-body">{selectedTransaction.condition}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <CustomButton variant="secondary" onClick={handleExportPDF} className="flex-1">
                Export as PDF
              </CustomButton>
              <CustomButton variant="ghost" onClick={() => setShowDetailModal(false)}>
                Close
              </CustomButton>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
