import React from 'react';

function RenderFlatTable({ modalData }) {
  const processedData = modalData.processedData || [];
  const message = modalData.message || '';

  // Extract column names from the first row of data
  const columns = processedData.length > 0 ? Object.keys(processedData[0]) : [];

  // Reverse the columns array for display
  const reversedColumns = columns.reverse();

  return (
    <div>

      {/* Render data in a table format */}
      <table className="table table-dark table-bordered" style={{ width: '100%' }}>
        {/* Render table header */}
        <thead>
          <tr>
            {reversedColumns.map((col, idx) => (
              <th key={idx} style={{ padding: '0.6rem', textAlign: 'left' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Render table rows */}
        <tbody>
          {processedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {reversedColumns.map((col, colIndex) => (
                <td key={colIndex} style={{padding: '0.6rem', textAlign: 'left' }}>
                  {row[col] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RenderFlatTable;
