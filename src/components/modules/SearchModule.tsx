import React, { useState } from 'react';
import { CustomInput } from '../CustomInput';
import { CustomSelect } from '../CustomSelect';
import { CustomButton } from '../CustomButton';
import { CustomTable } from '../CustomTable';
import { Search as SearchIcon } from 'lucide-react';

export function SearchModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Tool');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const allResults = [
    { type: 'Tool', id: 'TAG-101', name: '3/8 Drill Bit', category: 'Tools', status: 'Available', details: 'Qty: 30' },
    { type: 'Tool', id: 'TAG-102', name: 'Hammer 1kg', category: 'Tools', status: 'Borrowed', details: 'By: M. Cruz' },
    { type: 'Employee', id: 'E001', name: 'Juan Santos', category: 'Engineering', status: 'Active', details: 'Technician' },
    { type: 'Supplier', id: 'S001', name: 'ACME Tools Inc.', category: 'Tools', status: 'Active', details: '555-1234' },
  ];
  
  const [results, setResults] = useState(allResults);
  
  const handleSearch = () => {
    let filtered = allResults;
    
    if (searchType !== 'All') {
      filtered = filtered.filter(r => r.type === searchType);
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setResults(filtered);
  };
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="heading-module text-[#2C5E2E]">SEARCH</h1>
        <p className="text-help mt-1">Home / Search</p>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white rounded-[10px] p-8 shadow-sm border border-[#E5E7EB] mb-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 mb-4">
            <CustomInput
              placeholder="Search tools, borrowers, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-12 text-base"
            />
            <CustomButton 
              variant="secondary" 
              onClick={handleSearch}
              className="h-12 px-6"
            >
              <SearchIcon size={20} className="mr-2" />
              Search
            </CustomButton>
          </div>
          
          <div className="flex gap-3">
            <CustomSelect
              label="Search Type"
              options={[
                { value: 'All', label: 'All Types' },
                { value: 'Tool', label: 'Tools' },
                { value: 'Employee', label: 'Employees' },
                { value: 'Supplier', label: 'Suppliers' },
                { value: 'Transaction', label: 'Transactions' }
              ]}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="flex-1"
            />
            
            <CustomSelect
              label="Status"
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Available', label: 'Available' },
                { value: 'Borrowed', label: 'Borrowed' }
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="label-section text-[#2C5E2E]">
            Search Results ({results.length})
          </h3>
        </div>
        
        <CustomTable
          columns={[
            { key: 'type', label: 'Type', width: '100px' },
            { key: 'id', label: 'ID', width: '100px' },
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category', width: '150px' },
            { key: 'status', label: 'Status', width: '100px' },
            { key: 'details', label: 'Details', width: '150px' },
          ]}
          data={results}
        />
      </div>
    </div>
  );
}
