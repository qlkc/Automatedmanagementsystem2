import React from 'react';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface CustomTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any, index: number) => void;
  selectedIndex?: number;
}

export function CustomTable({ columns, data, onRowClick, selectedIndex }: CustomTableProps) {
  return (
    <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[#2C5E2E] h-11">
            {columns.map(col => (
              <th 
                key={col.key} 
                className="text-white text-left px-3 text-body"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`h-10 cursor-pointer transition-colors border-b border-[#E5E7EB] last:border-b-0
                ${index % 2 === 0 ? 'bg-white' : 'bg-[#F6F7F8]'}
                hover:bg-[#2C5E2E]/6
                ${selectedIndex === index ? 'border-l-4 border-l-[#F5D000] bg-[#F5D000]/10' : ''}
              `}
              onClick={() => onRowClick?.(row, index)}
            >
              {columns.map(col => (
                <td key={col.key} className="px-3 text-body">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-[#6B7280] text-body">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
