import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { CustomModal } from '../CustomModal';
import { Search } from 'lucide-react';

interface InventoryModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
  isViewOnly?: boolean;
}

export function InventoryModule({ onToast, isViewOnly = false }: InventoryModuleProps) {
  const [products, setProducts] = useState([
    { pid: '001', category: 'Tools', supplier: 'ACME', name: '3/8 Drill Bit', price: '120.00', qty: '30', location: 'Shelf A1', status: 'Active' },
    { pid: '002', category: 'Measuring', supplier: 'Priya', name: 'Caliper 150mm', price: '850.00', qty: '12', location: 'Shelf B2', status: 'Active' },
    { pid: '003', category: 'Tools', supplier: 'Priya', name: 'Hammer 1kg', price: '200.00', qty: '6', location: 'Shelf A3', status: 'Inactive' },
  ]);
  
  const [formData, setFormData] = useState({
    category: '',
    supplier: '',
    name: '',
    description: '',
    price: '',
    qty: '',
    location: '',
    status: 'Active'
  });
  
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  
  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.supplier || !formData.price || !formData.qty) {
      onToast('error', 'Please fill in all required fields.');
      return;
    }
    
    const newProduct = {
      pid: String(products.length + 1).padStart(3, '0'),
      category: formData.category,
      supplier: formData.supplier,
      name: formData.name,
      price: parseFloat(formData.price).toFixed(2),
      qty: formData.qty,
      location: formData.location || 'N/A',
      status: formData.status
    };
    
    setProducts([...products, newProduct]);
    handleClear();
    onToast('success', 'Product saved successfully.');
  };
  
  const handleUpdate = () => {
    if (selectedIndex === undefined) {
      onToast('error', 'Please select a product to update.');
      return;
    }
    
    const updated = [...products];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      category: formData.category,
      supplier: formData.supplier,
      name: formData.name,
      price: parseFloat(formData.price).toFixed(2),
      qty: formData.qty,
      location: formData.location || 'N/A',
      status: formData.status
    };
    
    setProducts(updated);
    handleClear();
    onToast('success', 'Product updated successfully.');
  };
  
  const handleArchive = () => {
    if (selectedIndex === undefined) {
      onToast('error', 'Please select a product to archive.');
      return;
    }
    
    const updated = [...products];
    updated[selectedIndex] = {
      ...updated[selectedIndex],
      status: 'Archived'
    };
    setProducts(updated);
    setShowArchiveModal(false);
    handleClear();
    onToast('success', 'Product archived successfully.');
  };
  
  const handleClear = () => {
    setFormData({ category: '', supplier: '', name: '', description: '', price: '', qty: '', location: '', status: 'Active' });
    setSelectedIndex(undefined);
  };
  
  const handleRowClick = (row: any, index: number) => {
    setSelectedIndex(index);
    setFormData({
      category: row.category,
      supplier: row.supplier,
      name: row.name,
      description: row.description || '',
      price: row.price,
      qty: row.qty,
      location: row.location || '',
      status: row.status
    });
  };
  
  const filteredProducts = products.filter(p => {
    const value = p[filterBy as keyof typeof p].toLowerCase();
    return value.includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">PRODUCTS / INVENTORY</h1>
        <p className="text-help mt-1">Home / Products / Inventory</p>
      </div>
      
      <div className="grid grid-cols-[480px_1fr] gap-6">
        {/* Form */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB] h-fit">
          <h3 className="label-section text-[#2C5E2E] mb-4">
            {!isViewOnly && selectedIndex === undefined ? 'Add New Tool' : 'Product Details'} 
            {isViewOnly && <span className="text-[#6B7280]"> (View Only)</span>}
          </h3>
          {!isViewOnly && selectedIndex === undefined && (
            <p className="text-help mb-3">Fill in the details below to add a new tool to the inventory.</p>
          )}
          
          <div className="space-y-3">
            <CustomSelect
              label="Category"
              options={[
                { value: '', label: 'Select category' },
                { value: 'Tools', label: 'Tools' },
                { value: 'Measuring', label: 'Measuring' },
                { value: 'Safety', label: 'Safety' }
              ]}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={isViewOnly}
            />
            
            <CustomSelect
              label="Supplier"
              options={[
                { value: '', label: 'Select supplier' },
                { value: 'ACME', label: 'ACME' },
                { value: 'Priya', label: 'Priya' },
                { value: 'TechTools', label: 'TechTools' }
              ]}
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              disabled={isViewOnly}
            />
            
            <CustomInput
              label="Product Name"
              placeholder="e.g., 3/8 Drill Bit"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isViewOnly}
            />
            
            <CustomInput
              label="Description (Optional)"
              placeholder="Brief description of the tool"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isViewOnly}
            />
            
            <CustomInput
              label="Price"
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              disabled={isViewOnly}
            />
            
            <CustomInput
              label="Quantity"
              type="number"
              placeholder="0"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
              disabled={isViewOnly}
            />
            
            <CustomInput
              label="Storage Location (Optional)"
              placeholder="e.g., Shelf A1, Cabinet B3"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={isViewOnly}
            />
            
            <CustomSelect
              label="Status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              disabled={isViewOnly}
            />
          </div>
          
          {!isViewOnly && (
            <>
              <div className="flex gap-2 mt-6">
                <CustomButton 
                  variant="primary" 
                  onClick={handleSave}
                  disabled={selectedIndex !== undefined}
                >
                  {selectedIndex === undefined ? 'Add Tool' : 'Save'}
                </CustomButton>
                <CustomButton 
                  variant="secondary" 
                  onClick={handleUpdate}
                  disabled={selectedIndex === undefined}
                >
                  Update
                </CustomButton>
              </div>
              <div className="flex gap-2 mt-2">
                <CustomButton 
                  variant="archive" 
                  onClick={() => setShowArchiveModal(true)} 
                  className="flex-1"
                  disabled={selectedIndex === undefined}
                >
                  Archive
                </CustomButton>
                <CustomButton variant="ghost" onClick={handleClear} className="flex-1">
                  {selectedIndex === undefined ? 'Clear' : 'New Tool'}
                </CustomButton>
              </div>
            </>
          )}
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-4">
            <CustomSelect
              options={[
                { value: 'name', label: 'By: Name' },
                { value: 'category', label: 'By: Category' },
                { value: 'supplier', label: 'By: Supplier' }
              ]}
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-40"
            />
            <div className="flex-1 flex gap-2">
              <CustomInput
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <CustomButton variant="secondary">
                <Search size={16} />
              </CustomButton>
            </div>
          </div>
          
          <CustomTable
            columns={[
              { key: 'pid', label: 'PID', width: '60px' },
              { key: 'category', label: 'Category', width: '90px' },
              { key: 'supplier', label: 'Supplier', width: '90px' },
              { key: 'name', label: 'Name' },
              { key: 'price', label: 'Price', width: '70px' },
              { key: 'qty', label: 'Qty', width: '50px' },
              { key: 'location', label: 'Location', width: '90px' },
              { key: 'status', label: 'Status', width: '70px' },
            ]}
            data={filteredProducts}
            onRowClick={handleRowClick}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
      
      <CustomModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchive}
        title="Archive Product"
        confirmText="Archive"
        cancelText="Cancel"
        variant="archive"
      >
        <p className="text-body">
          Are you sure you want to archive <strong>{formData.name}</strong>? Archived products will no longer be available for borrowing.
        </p>
      </CustomModal>
    </div>
  );
}
