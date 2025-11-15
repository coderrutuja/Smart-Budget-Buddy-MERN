import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomLineChart from '../Charts/CustomLineChart';
import { prepareExpenseLineChartData } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const ExpenseOverview = ({transactions, onExpenseIncome}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);


  return <div className='card'>
    <div className='flex items-center justify-between'>
        <div className=''>
            <h5 className='text-lg'>Expense Overview</h5>
            <p className='text-xs text-gray-400 mt-0.5'>
                Track your spending trends over time and gain insights into where your money goes.
            </p>
        </div>

        <div className='flex items-center gap-2'>
            <button
                className='card-btn'
                onClick={async () => {
                    try {
                        await axiosInstance.post(API_PATHS.SHEETS.EXPORT_EXPENSE);
                        toast.success('Export triggered');
                    } catch (e) {
                        const msg = e?.response?.data?.message || 'Export not configured yet';
                        toast.error(msg);
                    }
                }}
            >
                Export to Sheets
            </button>
            <button className='add-btn' onClick={onExpenseIncome}>
                <LuPlus className='text-lg' />
                Add Expense
            </button>
        </div>
    </div>

    <div className='mt-10'>
        <CustomLineChart data={chartData} />
    </div>
  </div>
}

export default ExpenseOverview