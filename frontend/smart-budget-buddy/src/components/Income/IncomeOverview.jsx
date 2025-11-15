import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../Charts/CustomBarChart'
import { prepareIncomeBarChartData } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const IncomeOverview = ({transactions, onAddIncome}) => {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setChartData(result);

        return () => {};

    }, [transactions]);
  return <div className='card'>
        <div className='flex items-center justify-between'>
            <div className=''>
                <h5 className='text-lg'>Income Overview</h5>
                <p className='text-xs text-gray-400 mt-0.5'>
                    Track your earnings over time and analyze your income trends.
                </p>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    className='card-btn'
                    onClick={async () => {
                        try {
                            await axiosInstance.post(API_PATHS.SHEETS.EXPORT_INCOME);
                            toast.success('Export triggered');
                        } catch (e) {
                            const msg = e?.response?.data?.message || 'Export not configured yet';
                            toast.error(msg);
                        }
                    }}
                >
                    Export to Sheets
                </button>
                <button className='add-btn' onClick={onAddIncome}>
                    <LuPlus className='text-lg' />
                    Add Income
                </button>
            </div>
        </div>

        <div className='mt-10'>
            <CustomBarChart data={chartData} />
        </div>
  </div>
}

export default IncomeOverview