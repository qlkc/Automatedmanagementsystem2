import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { CustomModal } from '../CustomModal';

interface EmployeesModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function EmployeesModule({ onToast }: EmployeesModuleProps) {
  const [employees, setEmployees] = useState([
    { empId: 'E001', name: 'Juan Santos', role: 'Technician', contact: '0917-123-4567', status: 'Active' },
    { empId: 'E002', name: 'Maria Cruz', role: 'Engineer', contact: '0918-234-5678', status: 'Active' },
    { empId: 'E003', name: 'Pedro Reyes', role: 'Supervisor', contact: '0919-345-6789', status: 'Inactive' },
  ]);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    contact: '',
    status: 'Active'
  });
  
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  
  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.contact) {
      onToast('error', 'Please fill in all required fields.');
      return;
    }
    
    const newEmployee = {
      empId: `E${String(employees.length + 1).padStart(3, '0')}`,
      name: formData.name,
      role: formData.role,
      contact: formData.contact,
      status: formData.status
    };
    
    setEmployees([...employees, newEmployee]);
    handleClear();
    onToast('success', 'Employee saved successfully.');
  };
  
  const handleUpdate = () => {
    if (selectedIndex === undefined) {
      onToast('error', 'Please select an employee to update.');
      return;
    }
    
    const updated = [...employees];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      name: formData.name,
      role: formData.role,
      contact: formData.contact,
      status: formData.status
    };
    
    setEmployees(updated);
    handleClear();
    onToast('success', 'Employee updated successfully.');
  };
  
  const handleArchive = () => {
    if (selectedIndex === undefined) return;
    
    const updated = [...employees];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      status: 'Archived'
    };
    setEmployees(updated);
    setShowArchiveModal(false);
    handleClear();
    onToast('success', 'Employee archived successfully.');
  };
  
  const handleClear = () => {
    setFormData({ name: '', role: '', contact: '', status: 'Active' });
    setSelectedIndex(undefined);
  };
  
  const handleRowClick = (row: any, index: number) => {
    setSelectedIndex(index);
    setFormData({
      name: row.name,
      role: row.role,
      contact: row.contact,
      status: row.status
    });
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">EMPLOYEES</h1>
        <p className="text-help mt-1">Home / Employees</p>
      </div>
      
      <div className="grid grid-cols-[420px_1fr] gap-6">
        {/* Form */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] h-fit">
          <h3 className="label-section text-[#2C5E2E] mb-4">Employee Details</h3>
          
          <div className="space-y-3">
            <CustomInput
              label="Full Name"
              placeholder="e.g., Juan Santos"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <CustomSelect
              label="Role"
              options={[
                { value: '', label: 'Select role' },
                { value: 'Technician', label: 'Technician' },
                { value: 'Engineer', label: 'Engineer' },
                { value: 'Supervisor', label: 'Supervisor' },
                { value: 'Manager', label: 'Manager' }
              ]}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            
            <CustomInput
              label="Contact"
              placeholder="0917-123-4567"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            
            <CustomSelect
              label="Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>
          
          <div className="flex gap-2 mt-6">
            <CustomButton variant="primary" onClick={handleSave}>Save</CustomButton>
            <CustomButton variant="secondary" onClick={handleUpdate}>Update</CustomButton>
          </div>
          <div className="flex gap-2 mt-2">
            <CustomButton variant="archive" onClick={() => setShowArchiveModal(true)} className="flex-1">
              Archive
            </CustomButton>
            <CustomButton variant="ghost" onClick={handleClear} className="flex-1">Clear</CustomButton>
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Employee List</h3>
          <CustomTable
            columns={[
              { key: 'empId', label: 'Emp ID', width: '80px' },
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role', width: '120px' },
              { key: 'contact', label: 'Contact', width: '140px' },
              { key: 'status', label: 'Status', width: '90px' },
            ]}
            data={employees}
            onRowClick={handleRowClick}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
      
      <CustomModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchive}
        title="Archive Employee"
        confirmText="Archive"
        cancelText="Cancel"
        variant="archive"
      >
        <p className="text-body">
          Are you sure you want to archive employee <strong>{formData.name}</strong>? Archived employees will no longer have system access.
        </p>
      </CustomModal>
    </div>
  );
}
