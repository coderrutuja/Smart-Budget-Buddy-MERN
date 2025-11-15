import React from 'react';

const InsightsPanel = ({ tips = [], forecast = 0 }) => {
  return (
    <div className='bg-white border rounded-lg p-4'>
      <h3 className='text-lg font-semibold mb-3'>AI Insights</h3>
      <div className='text-sm text-gray-700 mb-3'>
        Next month forecast (expenses): <span className='font-semibold text-gray-900'>₹{forecast}</span>
      </div>
      <ul className='list-disc pl-5 space-y-1'>
        {tips.length === 0 && (
          <li className='text-sm text-gray-500'>No notable changes detected yet.</li>
        )}
        {tips.map((t, i) => (
          <li key={i} className='text-sm text-gray-700'>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsightsPanel;
