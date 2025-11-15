import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    period: 'monthly',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    amount: '',
    thresholdPercent: 90,
    startDate: '',
    endDate: '',
  });

  const fetchBudgets = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.BUDGETS.LIST);
      setBudgets(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.amount) {
      toast.error('Name and amount are required');
      return;
    }
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (payload.period !== 'monthly') {
        delete payload.month; delete payload.year;
      }
      if (payload.period !== 'custom') {
        delete payload.startDate; delete payload.endDate;
      }
      await axiosInstance.post(API_PATHS.BUDGETS.CREATE, payload);
      toast.success('Budget created');
      setForm({ ...form, name: '', category: '', amount: '' });
      fetchBudgets();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create budget');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.BUDGETS.DELETE(id));
      toast.success('Budget deleted');
      fetchBudgets();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <DashboardLayout activeMenu="Budgets">
      <div className='my-5 mx-auto grid grid-cols-1 gap-6'>
        <div className='bg-white border rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-4'>Create Budget</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm text-gray-700'>Name</label>
              <input className='w-full input' value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Category (optional)</label>
              <input className='w-full input' value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Amount</label>
              <input type='number' className='w-full input' value={form.amount} onChange={(e)=>setForm({...form,amount:e.target.value})} />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Period</label>
              <select className='w-full input' value={form.period} onChange={(e)=>setForm({...form,period:e.target.value})}>
                <option value='monthly'>Monthly</option>
                <option value='weekly'>Weekly</option>
                <option value='custom'>Custom</option>
              </select>
            </div>
            {form.period === 'monthly' && (
              <>
                <div>
                  <label className='text-sm text-gray-700'>Month</label>
                  <input type='number' min={0} max={11} className='w-full input' value={form.month} onChange={(e)=>setForm({...form,month:Number(e.target.value)})} />
                </div>
                <div>
                  <label className='text-sm text-gray-700'>Year</label>
                  <input type='number' className='w-full input' value={form.year} onChange={(e)=>setForm({...form,year:Number(e.target.value)})} />
                </div>
              </>
            )}
            {form.period === 'custom' && (
              <>
                <div>
                  <label className='text-sm text-gray-700'>Start Date</label>
                  <input type='date' className='w-full input' value={form.startDate} onChange={(e)=>setForm({...form,startDate:e.target.value})} />
                </div>
                <div>
                  <label className='text-sm text-gray-700'>End Date</label>
                  <input type='date' className='w-full input' value={form.endDate} onChange={(e)=>setForm({...form,endDate:e.target.value})} />
                </div>
              </>
            )}
            <div>
              <label className='text-sm text-gray-700'>Alert Threshold (%)</label>
              <input type='number' className='w-full input' value={form.thresholdPercent} onChange={(e)=>setForm({...form,thresholdPercent:Number(e.target.value)})} />
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <button className='add-btn add-btn-fill' onClick={handleCreate}>Save Budget</button>
          </div>
        </div>
        <div className='bg-white border rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-4'>Budgets</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {budgets.map((b) => (
              <div key={b._id} className='border rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>{b.name}</h4>
                  <button className='text-red-600 text-sm' onClick={()=>handleDelete(b._id)}>Delete</button>
                </div>
                <div className='text-sm text-gray-600 mt-2'>
                  {b.category ? `Category: ${b.category}` : 'Overall'}
                </div>
                <div className='mt-2 text-sm'>Amount: ₹{b.amount}</div>
                <div className='mt-2 text-sm'>Spent: ₹{b.spent} ({b.utilization}%)</div>
                <div className='w-full bg-gray-200 h-2 rounded mt-2'>
                  <div className='h-2 rounded' style={{ width: `${b.utilization}%`, backgroundColor: b.utilization >= (b.thresholdPercent || 90) ? '#ef4444' : '#3b82f6' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Budgets;
