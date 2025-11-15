import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '',
    targetDate: '',
    color: '#22c55e',
  });

  const fetchGoals = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.GOALS.LIST);
      setGoals(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.targetAmount) {
      toast.error('Name and target amount are required');
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.GOALS.CREATE, {
        ...form,
        targetAmount: Number(form.targetAmount),
        savedAmount: Number(form.savedAmount || 0),
      });
      toast.success('Goal created');
      setForm({ name: '', targetAmount: '', savedAmount: '', targetDate: '', color: '#22c55e' });
      fetchGoals();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create goal');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.GOALS.DELETE(id));
      toast.success('Goal deleted');
      fetchGoals();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <DashboardLayout activeMenu="Goals">
      <div className='my-5 mx-auto grid grid-cols-1 gap-6'>
        <div className='bg-white border rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-4'>Create Goal</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <label className='text-sm text-gray-700'>Name</label>
              <input className='w-full input' value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Target Amount</label>
              <input type='number' className='w-full input' value={form.targetAmount} onChange={(e)=>setForm({...form,targetAmount:e.target.value})} />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Saved Amount</label>
              <input type='number' className='w-full input' value={form.savedAmount} onChange={(e)=>setForm({...form,savedAmount:e.target.value})} />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Target Date</label>
              <input type='date' className='w-full input' value={form.targetDate} onChange={(e)=>setForm({...form,targetDate:e.target.value})} />
            </div>
            <div>
              <label className='text-sm text-gray-700'>Color</label>
              <input type='color' className='w-full input' value={form.color} onChange={(e)=>setForm({...form,color:e.target.value})} />
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <button className='add-btn add-btn-fill' onClick={handleCreate}>Save Goal</button>
          </div>
        </div>
        <div className='bg-white border rounded-lg p-4'>
          <h3 className='text-lg font-semibold mb-4'>Goals</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {goals.map((g) => {
              const utilization = g.targetAmount > 0 ? Math.min(100, Math.round((Number(g.savedAmount||0)/g.targetAmount)*100)) : 0;
              return (
                <div key={g._id} className='border rounded-lg p-4'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium'>{g.name}</h4>
                    <button className='text-red-600 text-sm' onClick={()=>handleDelete(g._id)}>Delete</button>
                  </div>
                  <div className='mt-2 text-sm'>Target: ₹{g.targetAmount}</div>
                  <div className='mt-2 text-sm'>Saved: ₹{g.savedAmount} ({utilization}%)</div>
                  <div className='w-full bg-gray-200 h-2 rounded mt-2'>
                    <div className='h-2 rounded' style={{ width: `${utilization}%`, backgroundColor: g.color || '#22c55e' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Goals;
