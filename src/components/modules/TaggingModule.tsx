import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { CustomModal } from '../CustomModal';
import { StatusBadge } from '../StatusBadge';
import { QrCode, Printer } from 'lucide-react';

interface TaggingModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function TaggingModule({ onToast }: TaggingModuleProps) {
  const [tags, setTags] = useState([
    { tagId: 'TAG-101', productId: 'P001', productName: '3/8 Drill Bit', status: 'Assigned', condition: 'Good', lastBorrower: 'J. Santos' },
    { tagId: 'TAG-102', productId: 'P002', productName: 'Hammer 1kg', status: 'Assigned', condition: 'Good', lastBorrower: 'M. Cruz' },
    { tagId: 'TAG-103', productId: '', productName: 'Unassigned', status: 'Unassigned', condition: 'Good', lastBorrower: '-' },
  ]);
  
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    tagId: '',
    condition: 'Good',
    status: 'Active'
  });
  
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const products = [
    { value: '', label: 'Select product' },
    { value: 'P001', label: 'P001 - 3/8 Drill Bit' },
    { value: 'P002', label: 'P002 - Hammer 1kg' },
    { value: 'P003', label: 'P003 - Caliper 150mm' },
  ];
  
  const handleProductChange = (value: string) => {
    setFormData({ ...formData, productId: value });
    const product = products.find(p => p.value === value);
    if (product && value) {
      setFormData({ 
        ...formData, 
        productId: value, 
        productName: product.label.split(' - ')[1] 
      });
    }
  };
  
  const handleScan = () => {
    const randomTag = `TAG-${Math.floor(Math.random() * 1000)}`;
    setFormData({ ...formData, tagId: randomTag });
    onToast('info', 'Tag scanned successfully');
  };
  
  const handleAssign = () => {
    if (!formData.productId || !formData.tagId) {
      onToast('error', 'Please select a product and enter/scan a tag ID.');
      return;
    }
    
    const newTag = {
      tagId: formData.tagId,
      productId: formData.productId,
      productName: formData.productName,
      status: formData.status,
      condition: formData.condition,
      lastBorrower: '-'
    };
    
    setTags([...tags, newTag]);
    handleClear();
    onToast('success', 'Tag assigned successfully.');
  };
  
  const handleUpdate = () => {
    if (selectedIndex === undefined) {
      onToast('error', 'Please select a tag to update.');
      return;
    }
    
    const updated = [...tags];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      productId: formData.productId,
      productName: formData.productName,
      condition: formData.condition,
      status: formData.status
    };
    
    setTags(updated);
    handleClear();
    onToast('success', 'Tag updated successfully.');
  };
  
  const handleArchive = () => {
    if (selectedIndex === undefined) return;
    
    const updated = [...tags];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      status: 'Archived'
    };
    
    setTags(updated);
    setShowArchiveModal(false);
    handleClear();
    onToast('success', 'Tag archived successfully.');
  };
  
  const handleClear = () => {
    setFormData({ productId: '', productName: '', tagId: '', condition: 'Good', status: 'Active' });
    setSelectedIndex(undefined);
  };
  
  const handleRowClick = (row: any, index: number) => {
    setSelectedIndex(index);
    setFormData({
      productId: row.productId,
      productName: row.productName,
      tagId: row.tagId,
      condition: row.condition,
      status: row.status
    });
  };
  
  const filteredTags = tags.filter(t => {
    const matchSearch = !searchQuery || 
      t.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    
    return matchSearch && matchStatus;
  });
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setStatusFilter('All');
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">TAGGING</h1>
        <p className="text-help mt-1">Home / Tagging / Assign QR Tags to Tools</p>
      </div>
      
      <div className="grid grid-cols-[480px_1fr] gap-6">
        {/* Form */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] h-fit">
          <h3 className="label-section text-[#2C5E2E] mb-4">Tag Assignment</h3>
          
          <div className="space-y-3">
            <CustomSelect
              label="Product"
              options={products}
              value={formData.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              helperText="Select the product to assign a tag"
            />
            
            <div className="flex gap-2">
              <CustomInput
                label="Tag ID"
                placeholder="Scan or enter manually"
                value={formData.tagId}
                onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                className="flex-1"
              />
              <div className="flex items-end">
                <CustomButton variant="secondary" onClick={handleScan}>
                  <QrCode size={16} />
                </CustomButton>
              </div>
            </div>
            
            <CustomSelect
              label="Condition"
              options={[
                { value: 'Good', label: 'Good' },
                { value: 'Needs Repair', label: 'Needs Repair' }
              ]}
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
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
            <CustomButton variant="primary" onClick={handleAssign}>Assign Tag</CustomButton>
            <CustomButton variant="secondary" onClick={handleUpdate}>Update</CustomButton>
          </div>
          <div className="flex gap-2 mt-2">
            <CustomButton variant="archive" onClick={() => setShowArchiveModal(true)} className="flex-1">
              Archive
            </CustomButton>
            <CustomButton variant="ghost" onClick={handleClear} className="flex-1">Clear</CustomButton>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <CustomButton variant="ghost" onClick={() => setShowQrModal(true)} className="w-full">
              <Printer size={16} className="mr-2" />
              Preview QR Code
            </CustomButton>
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <h3 className="label-section text-[#2C5E2E] mb-4">Tag List</h3>
          
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <CustomInput
              placeholder="Search Tag ID or Tool Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <CustomSelect
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Assigned', label: 'Assigned' },
                { value: 'Unassigned', label: 'Unassigned' },
                { value: 'Archived', label: 'Archived' }
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
            <CustomButton variant="primary">Search</CustomButton>
            <CustomButton variant="ghost" onClick={handleClearSearch}>Clear</CustomButton>
          </div>
          
          <CustomTable
            columns={[
              { key: 'tagId', label: 'Tag ID', width: '100px' },
              { key: 'productName', label: 'Product Name' },
              { key: 'status', label: 'Status', width: '100px' },
              { key: 'condition', label: 'Condition', width: '120px' },
              { key: 'lastBorrower', label: 'Last Borrower', width: '120px' },
            ]}
            data={filteredTags}
            onRowClick={handleRowClick}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
      
      <CustomModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchive}
        title="Archive Tag"
        confirmText="Archive"
        variant="archive"
      >
        <p className="text-body">
          Are you sure you want to archive tag <strong>{formData.tagId}</strong>? 
          This tag will no longer be available for borrowing.
        </p>
      </CustomModal>
      
      <CustomModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title="QR Code Preview"
      >
        <div className="text-center">
          <div className="w-48 h-48 mx-auto bg-white border-2 border-[#E5E7EB] rounded-lg flex items-center justify-center mb-4">
            <QrCode size={128} className="text-[#2C5E2E]" />
          </div>
          <p className="text-body mb-2">
            <strong>Tag ID:</strong> {formData.tagId || 'Not assigned'}
          </p>
          <p className="text-body mb-4">
            <strong>Product:</strong> {formData.productName || 'None'}
          </p>
          <CustomButton variant="secondary">
            <Printer size={16} className="mr-2" />
            Print QR Code
          </CustomButton>
        </div>
      </CustomModal>
    </div>
  );
}
