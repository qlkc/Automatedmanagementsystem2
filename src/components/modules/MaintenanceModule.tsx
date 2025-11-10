import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomModal } from '../CustomModal';
import { Upload, Download, Database, AlertTriangle } from 'lucide-react';

interface MaintenanceModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onNavigate?: (module: string) => void;
}

export function MaintenanceModule({ onToast, onNavigate }: MaintenanceModuleProps) {
  const [searchTool, setSearchTool] = useState('');
  const [batchAction, setBatchAction] = useState('');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  const logs = [
    '[2025-10-14 09:30:15] User "admin" logged in',
    '[2025-10-14 09:31:42] Product "3/8 Drill Bit" added by "admin"',
    '[2025-10-14 09:35:20] Transaction T001 created - Tool borrowed by J. Santos',
    '[2025-10-14 10:12:05] Employee E004 status updated to "Inactive"',
  ];
  
  const handleBackup = () => {
    setShowBackupModal(false);
    onToast('success', 'Database backup created successfully.');
  };
  
  const handleRestore = () => {
    setShowRestoreModal(false);
    onToast('info', 'Database restoration initiated. System will restart.');
  };
  
  const handleBatchUpdate = () => {
    if (!batchAction) {
      onToast('error', 'Please select a batch action.');
      return;
    }
    onToast('success', `Batch action "${batchAction}" completed successfully.`);
  };
  
  const handleDeleteAllData = () => {
    if (deleteConfirmation !== 'ARCHIVE') {
      onToast('error', 'Please type "ARCHIVE" to confirm.');
      return;
    }
    setShowDeleteModal(false);
    setDeleteConfirmation('');
    onToast('success', 'All inactive records archived successfully.');
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="heading-module text-[#2C5E2E]">MAINTENANCE</h1>
          <p className="text-help mt-1">Home / Maintenance</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#FFD74D]/20 rounded-lg border border-[#F5D000]">
          <AlertTriangle size={16} className="text-[#A25E2D]" />
          <span className="text-body text-[#A25E2D]">Administrator Only</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Data Maintenance */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Data Maintenance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                label="Search Tool by Tag/PID"
                placeholder="Enter tag or product ID"
                value={searchTool}
                onChange={(e) => setSearchTool(e.target.value)}
              />
              <CustomButton variant="secondary" className="mt-3">
                Search & Edit
              </CustomButton>
            </div>
            <div className="space-y-2">
              <label className="label-section text-[#1B1B1B]">Quick Stats</label>
              <div className="space-y-1 text-body">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Total Products:</span>
                  <span>245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Total Employees:</span>
                  <span>86</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Total Transactions:</span>
                  <span>1,523</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Batch Actions */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Batch Actions</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <CustomButton variant="ghost" className="flex-1">
                <Upload size={16} className="mr-2" />
                Import CSV Data
              </CustomButton>
              <CustomButton variant="ghost" className="flex-1">
                <Download size={16} className="mr-2" />
                Export All Data
              </CustomButton>
            </div>
            
            <div className="flex gap-3">
              <CustomSelect
                label="Batch Status Update"
                options={[
                  { value: '', label: 'Select action' },
                  { value: 'activate-all', label: 'Activate All Products' },
                  { value: 'deactivate-all', label: 'Deactivate All Products' },
                  { value: 'reset-inventory', label: 'Reset Inventory Counts' }
                ]}
                value={batchAction}
                onChange={(e) => setBatchAction(e.target.value)}
                className="flex-1"
              />
              <div className="flex items-end">
                <CustomButton variant="secondary" onClick={handleBatchUpdate}>
                  Execute
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
        
        {/* Backup & Restore */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Backup & Restore</h3>
          <div className="flex gap-3">
            <CustomButton variant="primary" onClick={() => setShowBackupModal(true)}>
              <Database size={16} className="mr-2" />
              Create Backup
            </CustomButton>
            <CustomButton variant="ghost" onClick={() => setShowRestoreModal(true)}>
              <Upload size={16} className="mr-2" />
              Restore Backup
            </CustomButton>
            <CustomButton variant="archive" onClick={() => setShowDeleteModal(true)}>
              <AlertTriangle size={16} className="mr-2" />
              Archive All Inactive
            </CustomButton>
          </div>
          <p className="text-help mt-3">
            Last backup: October 13, 2025 11:45 PM
          </p>
        </div>
        
        {/* System Logs */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">System Logs</h3>
          <div className="bg-[#1B1B1B] rounded-md p-4 font-mono text-[11px] text-[#2EA44F] h-48 overflow-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <CustomButton variant="ghost" onClick={() => onToast('info', 'Logs refreshed')}>
              Refresh
            </CustomButton>
            <CustomButton variant="ghost" onClick={() => onToast('success', 'Logs exported')}>
              Export Logs
            </CustomButton>
          </div>
        </div>
        
        {/* Quick Navigation */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Quick Navigation</h3>
          <p className="text-body mb-3">
            Need to manage products directly? Jump to the Products/Inventory section to add, edit, or view tools.
          </p>
          {onNavigate && (
            <CustomButton 
              variant="primary" 
              onClick={() => onNavigate('inventory')}
              className="w-full"
            >
              Go to Products / Inventory →
            </CustomButton>
          )}
        </div>
      </div>
      
      <CustomModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onConfirm={handleBackup}
        title="Create Database Backup"
        confirmText="Create Backup"
      >
        <p className="text-body">
          This will create a complete backup of the database including all products, employees, suppliers, and transactions.
        </p>
        <p className="text-body mt-2">
          The backup file will be downloaded as <strong>champion_backup_{new Date().toISOString().split('T')[0]}.sql</strong>
        </p>
      </CustomModal>
      
      <CustomModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={handleRestore}
        title="Restore Database Backup"
        confirmText="Restore"
        variant="danger"
      >
        <div className="space-y-3">
          <p className="text-body">
            <strong>Warning:</strong> This will replace all current data with the backup file.
          </p>
          <CustomButton variant="ghost" className="w-full">
            <Upload size={16} className="mr-2" />
            Choose Backup File (.sql)
          </CustomButton>
        </div>
      </CustomModal>
      
      <CustomModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation('');
        }}
        onConfirm={handleDeleteAllData}
        title="Archive All Inactive Records"
        confirmText="Archive All"
        variant="archive"
      >
        <div className="space-y-3">
          <p className="text-body text-[#A25E2D]">
            <strong>WARNING:</strong> This action will archive ALL inactive records across all modules.
          </p>
          <p className="text-body">
            Type <strong>ARCHIVE</strong> to confirm:
          </p>
          <CustomInput
            placeholder="Type ARCHIVE here"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </div>
      </CustomModal>
    </div>
  );
}
