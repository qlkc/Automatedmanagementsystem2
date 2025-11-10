import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { CustomModal } from '../CustomModal';
import { QrCode } from 'lucide-react';

interface BorrowingModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
  userRole: 'Admin' | 'Staff';
}

export function BorrowingModule({ onToast, userRole }: BorrowingModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [transactions, setTransactions] = useState([
    { transId: 'T001', toolTag: 'TAG-101', toolName: '3/8 Drill Bit', borrower: 'J. Santos', borrowDate: '2025-10-10', returnDate: '2025-10-14', status: 'Returned' },
    { transId: 'T002', toolTag: 'TAG-102', toolName: 'Hammer 1kg', borrower: 'M. Cruz', borrowDate: '2025-10-12', returnDate: '-', status: 'Borrowed' },
  ]);
  
  const [borrowerData, setBorrowerData] = useState({
    empId: '',
    name: '',
    department: ''
  });
  
  const [toolData, setToolData] = useState({
    tagId: '',
    toolName: '',
    condition: 'Good',
    returnDate: ''
  });
  
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  
  const handleScan = () => {
    // Simulate scanning
    const sampleTools = ['3/8 Drill Bit', 'Hammer 1kg', 'Caliper 150mm'];
    const randomTool = sampleTools[Math.floor(Math.random() * sampleTools.length)];
    setToolData({
      ...toolData,
      tagId: `TAG-${Math.floor(Math.random() * 1000)}`,
      toolName: randomTool
    });
    onToast('info', 'Tool scanned successfully');
  };
  
  const handleBorrow = () => {
    if (!borrowerData.empId || !toolData.tagId || !toolData.returnDate) {
      onToast('error', 'Please fill in all required fields.');
      return;
    }
    
    setShowBorrowModal(true);
  };
  
  const confirmBorrow = () => {
    const newTransaction = {
      transId: `T${String(transactions.length + 1).padStart(3, '0')}`,
      toolTag: toolData.tagId,
      toolName: toolData.toolName,
      borrower: borrowerData.name,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: '-',
      status: 'Borrowed'
    };
    
    setTransactions([newTransaction, ...transactions]);
    handleClear();
    setShowBorrowModal(false);
    onToast('success', 'Tool borrowed successfully.');
  };
  
  const handleReturn = () => {
    if (!toolData.tagId) {
      onToast('error', 'Please scan or enter tool tag.');
      return;
    }
    setShowReturnModal(true);
  };
  
  const confirmReturn = () => {
    const updated = transactions.map(t => 
      t.toolTag === toolData.tagId && t.status === 'Borrowed'
        ? { ...t, returnDate: new Date().toISOString().split('T')[0], status: 'Returned' }
        : t
    );
    
    setTransactions(updated);
    handleClear();
    setShowReturnModal(false);
    onToast('success', 'Tool returned successfully.');
  };
  
  const handleClear = () => {
    setBorrowerData({ empId: '', name: '', department: '' });
    setToolData({ tagId: '', toolName: '', condition: 'Good', returnDate: '' });
  };
  
  // Simulate auto-fill on employee ID change
  const handleEmpIdChange = (value: string) => {
    setBorrowerData({ ...borrowerData, empId: value });
    if (value === 'E001') {
      setBorrowerData({ empId: value, name: 'Juan Santos', department: 'Engineering' });
    }
  };
  
  const filteredTransactions = transactions.filter(t => {
    const matchSearch = !searchQuery || 
      t.toolTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.transId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    
    return matchSearch && matchStatus;
  });
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateFrom('');
    setDateTo('');
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">BORROWING & RETURN</h1>
        <p className="text-help mt-1">Home / Borrowing & Return</p>
      </div>
      
      {/* Search Section */}
      <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] mb-6">
        <h3 className="label-section text-[#2C5E2E] mb-4">Search Transactions</h3>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <CustomInput
            placeholder="Tag ID / Borrower / Trans ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CustomSelect
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Borrowed', label: 'Borrowed' },
              { value: 'Returned', label: 'Returned' },
              { value: 'Overdue', label: 'Overdue' }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <CustomInput
            type="date"
            placeholder="From Date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <CustomInput
            type="date"
            placeholder="To Date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <CustomButton variant="primary">Search</CustomButton>
          <CustomButton variant="ghost" onClick={handleClearSearch}>Clear</CustomButton>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Borrower Info */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Borrower Information</h3>
          <div className="space-y-3">
            <CustomInput
              label="Employee ID"
              placeholder="Scan or enter manually"
              value={borrowerData.empId}
              onChange={(e) => handleEmpIdChange(e.target.value)}
              helperText="Try: E001"
            />
            <CustomInput
              label="Name"
              placeholder="Auto-fill"
              value={borrowerData.name}
              readOnly
            />
            <CustomInput
              label="Department"
              placeholder="Auto-fill"
              value={borrowerData.department}
              readOnly
            />
          </div>
        </div>
        
        {/* Tool Info */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Tool Information</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <CustomInput
                label="Tool Tag ID"
                placeholder="Scan QR code"
                value={toolData.tagId}
                onChange={(e) => setToolData({ ...toolData, tagId: e.target.value })}
                className="flex-1"
              />
              <div className="flex items-end">
                <CustomButton variant="secondary" onClick={handleScan}>
                  <QrCode size={16} />
                </CustomButton>
              </div>
            </div>
            <CustomInput
              label="Tool Name"
              placeholder="Auto-fill"
              value={toolData.toolName}
              readOnly
            />
            <CustomSelect
              label="Condition"
              options={[
                { value: 'Good', label: 'Good' },
                { value: 'Needs Repair', label: 'Needs Repair' }
              ]}
              value={toolData.condition}
              onChange={(e) => setToolData({ ...toolData, condition: e.target.value })}
            />
            <CustomInput
              label="Expected Return Date"
              type="date"
              value={toolData.returnDate}
              onChange={(e) => setToolData({ ...toolData, returnDate: e.target.value })}
            />
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="bg-white rounded-[10px] p-4 shadow-sm border border-[#E5E7EB] mb-6">
        <div className="flex gap-3">
          <CustomButton variant="primary" onClick={handleBorrow}>Borrow</CustomButton>
          <CustomButton variant="secondary" onClick={handleReturn}>Return</CustomButton>
          <CustomButton variant="ghost" onClick={handleClear}>Cancel</CustomButton>
        </div>
      </div>
      
      {/* Transaction Table */}
      <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
        <h3 className="label-section text-[#2C5E2E] mb-4">Transaction History</h3>
        <CustomTable
          columns={[
            { key: 'transId', label: 'Trans ID', width: '80px' },
            { key: 'toolTag', label: 'Tool Tag', width: '100px' },
            { key: 'toolName', label: 'Tool Name' },
            { key: 'borrower', label: 'Borrower', width: '120px' },
            { key: 'borrowDate', label: 'Borrow Date', width: '110px' },
            { key: 'returnDate', label: 'Return Date', width: '110px' },
            { key: 'status', label: 'Status', width: '90px' },
          ]}
          data={filteredTransactions}
        />
      </div>
      
      <CustomModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onConfirm={confirmBorrow}
        title="Confirm Borrow"
        confirmText="Confirm"
      >
        <div className="text-body space-y-2">
          <p><strong>Borrower:</strong> {borrowerData.name}</p>
          <p><strong>Tool:</strong> {toolData.toolName} ({toolData.tagId})</p>
          <p><strong>Expected Return:</strong> {toolData.returnDate}</p>
          <p><strong>Condition:</strong> {toolData.condition}</p>
        </div>
      </CustomModal>
      
      <CustomModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={confirmReturn}
        title="Confirm Return"
        confirmText="Confirm"
      >
        <div className="text-body">
          <p>Confirm return of tool <strong>{toolData.toolName}</strong> ({toolData.tagId})?</p>
          <p className="mt-2">Condition: <strong>{toolData.condition}</strong></p>
        </div>
      </CustomModal>
    </div>
  );
}
