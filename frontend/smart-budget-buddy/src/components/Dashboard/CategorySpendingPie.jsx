import React, { useMemo } from 'react';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ['#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#f472b6', '#22d3ee'];

const CategorySpendingPie = ({ data }) => {
  const chartData = useMemo(() => {
    const mapped = (data || []).map((d) => ({ name: d.category, amount: d.total }));
    const total = mapped.reduce((s, x) => s + (Number(x.amount) || 0), 0);
    return { mapped, total };
  }, [data]);

  return (
    <div className='bg-white border rounded-lg p-4'>
      <h3 className='text-lg font-semibold mb-4'>Category-wise Spending (Last 30 days)</h3>
      <CustomPieChart
        data={chartData.mapped}
        label={'Total'}
        totalAmount={`₹${chartData.total}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default CategorySpendingPie;
