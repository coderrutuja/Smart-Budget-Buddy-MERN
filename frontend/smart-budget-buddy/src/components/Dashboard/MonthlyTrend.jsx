import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const monthLabel = (y, m) => {
  const date = new Date(y, m - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
};

const MonthlyTrend = ({ data }) => {
  const chartData = useMemo(() => {
    const income = (data?.income || []).map((x) => ({ key: `${x.year}-${x.month}`, month: monthLabel(x.year, x.month), income: x.total }));
    const expense = (data?.expense || []).map((x) => ({ key: `${x.year}-${x.month}`, month: monthLabel(x.year, x.month), expense: x.total }));
    const map = new Map();
    income.forEach((i) => map.set(i.key, { month: i.month, income: i.income, expense: 0 }));
    expense.forEach((e) => {
      const prev = map.get(e.key) || { month: e.month, income: 0, expense: 0 };
      map.set(e.key, { ...prev, expense: e.expense });
    });
    return Array.from(map.values());
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const inc = payload.find((p) => p.dataKey === 'income')?.value || 0;
      const exp = payload.find((p) => p.dataKey === 'expense')?.value || 0;
      return (
        <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
          <p className='text-xs font-semibold text-purple-800 mb-1'>{label}</p>
          <p className='text-sm text-gray-600'>Income: <span className='font-medium text-gray-900'>₹{inc}</span></p>
          <p className='text-sm text-gray-600'>Expense: <span className='font-medium text-gray-900'>₹{exp}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white border rounded-lg p-4'>
      <h3 className='text-lg font-semibold mb-4'>Monthly Trend (Income vs Expense)</h3>
      <ResponsiveContainer width='100%' height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id='incGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#22c55e' stopOpacity={0.4} />
              <stop offset='95%' stopColor='#22c55e' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='expGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#ef4444' stopOpacity={0.4} />
              <stop offset='95%' stopColor='#ef4444' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke='none' />
          <XAxis dataKey='month' tick={{ fontSize: 12, fill: '#555' }} stroke='none' />
          <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke='none' />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area type='monotone' dataKey='income' name='Income' stroke='#16a34a' fill='url(#incGrad)' strokeWidth={3} dot={{ r: 3, fill: '#22c55e' }} />
          <Area type='monotone' dataKey='expense' name='Expense' stroke='#dc2626' fill='url(#expGrad)' strokeWidth={3} dot={{ r: 3, fill: '#ef4444' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrend;
