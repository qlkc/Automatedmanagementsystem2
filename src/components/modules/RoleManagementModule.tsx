import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { CustomModal } from '../CustomModal';
import { StatusBadge } from '../StatusBadge';
import { Users } from 'lucide-react';

interface RoleManagementModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function RoleManagementModule({ onToast }: RoleManagementModuleProps) {
  const [roles, setRoles] = useState([
    { roleId: 'R001', roleName: 'Admin', description: 'Full system access', status: 'Active', assignedUsers: '3' },
    { roleId: 'R002', roleName: 'Staff', description: 'Limited access', status: 'Active', assignedUsers: '12' },
  ]);
  
  const [formData, setFormData] = useState({
    roleName: 'Admin',
    description: '',
    status: 'Active'
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const availableUsers = [
    { id: 'U001', name: 'Juan Santos', role: 'None' },
    { id: 'U002', name: 'Maria Cruz', role: 'Staff' },
    { id: 'U003', name: 'Pedro Reyes', role: 'Administrator' },
  ];
  
  const handleAdd = () => {
    if (!formData.description) {
      onToast('error', 'Please enter a description.');
      return;
    }
    
    // Check if role already exists
    if (roles.some(r => r.roleName === formData.roleName && r.status !== 'Archived')) {
      onToast('error', `${formData.roleName} role already exists.`);
      return;
    }
    
    const newRole = {
      roleId: `R${String(roles.length + 1).padStart(3, '0')}`,
      roleName: formData.roleName,
      description: formData.description,
      status: formData.status,
      assignedUsers: '0'
    };
    
    setRoles([...roles, newRole]);
    handleClear();
    onToast('success', 'Role added successfully.');
  };
  
  const handleUpdate = () => {
    if (selectedIndex === undefined) {
      onToast('error', 'Please select a role to update.');
      return;
    }
    
    const updated = [...roles];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      roleName: formData.roleName,
      description: formData.description,
      status: formData.status
    };
    
    setRoles(updated);
    handleClear();
    onToast('success', 'Role updated successfully.');
  };
  
  const handleArchive = () => {
    if (selectedIndex === undefined) return;
    
    const updated = [...roles];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      status: 'Archived'
    };
    
    setRoles(updated);
    setShowArchiveModal(false);
    handleClear();
    onToast('success', 'Role archived successfully.');
  };
  
  const handleClear = () => {
    setFormData({ roleName: 'Admin', description: '', status: 'Active' });
    setSelectedIndex(undefined);
  };
  
  const filteredRoles = roles.filter(r => 
    r.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleRowClick = (row: any, index: number) => {
    setSelectedIndex(index);
    setFormData({
      roleName: row.roleName,
      description: row.description,
      status: row.status
    });
  };
  
  const handleAssignUsers = () => {
    setShowAssignModal(false);
    onToast('success', `${selectedUsers.length} users assigned to role.`);
    setSelectedUsers([]);
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">ROLE MANAGEMENT</h1>
        <p className="text-help mt-1">Home / Role Management</p>
      </div>
      
      <div className="grid grid-cols-[420px_1fr] gap-6">
        {/* Form */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] h-fit">
          <h3 className="label-section text-[#2C5E2E] mb-4">Role Details</h3>
          
          <div className="space-y-3">
            <CustomSelect
              label="Role Name"
              options={[
                { value: 'Admin', label: 'Admin' },
                { value: 'Staff', label: 'Staff' }
              ]}
              value={formData.roleName}
              onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
            />
            
            <CustomInput
              label="Description"
              placeholder="Brief description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <CustomButton variant="primary" onClick={handleAdd}>Add Role</CustomButton>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="label-section text-[#2C5E2E]">Role List</h3>
            <div className="flex gap-2">
              <CustomInput
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <CustomButton variant="ghost" onClick={() => setShowAssignModal(true)}>
                <Users size={16} className="mr-2" />
                Assign Users
              </CustomButton>
            </div>
          </div>
          
          <CustomTable
            columns={[
              { key: 'roleId', label: 'Role ID', width: '80px' },
              { key: 'roleName', label: 'Role Name', width: '150px' },
              { key: 'description', label: 'Description' },
              { key: 'status', label: 'Status', width: '100px' },
              { key: 'assignedUsers', label: 'Assigned', width: '80px' },
            ]}
            data={filteredRoles}
            onRowClick={handleRowClick}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
      
      <CustomModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchive}
        title="Archive Role"
        confirmText="Archive"
        variant="archive"
      >
        <p className="text-body">
          Are you sure you want to archive role <strong>{formData.roleName}</strong>? 
          Archived roles cannot be assigned to new users.
        </p>
      </CustomModal>
      
      <CustomModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onConfirm={handleAssignUsers}
        title="Assign Users to Role"
        confirmText="Assign"
      >
        <div className="space-y-2">
          <p className="text-body mb-3">Select users to assign to this role:</p>
          {availableUsers.map(user => (
            <div key={user.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={user.id}
                checked={selectedUsers.includes(user.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers([...selectedUsers, user.id]);
                  } else {
                    setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                  }
                }}
                className="w-4 h-4 accent-[#2C5E2E]"
              />
              <label htmlFor={user.id} className="text-body cursor-pointer flex-1">
                {user.name} <span className="text-[#6B7280]">({user.role})</span>
              </label>
            </div>
          ))}
        </div>
      </CustomModal>
    </div>
  );
}
