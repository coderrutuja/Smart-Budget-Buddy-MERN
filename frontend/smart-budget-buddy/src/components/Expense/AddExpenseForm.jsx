import React, { useState } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../EmojiPickerPopup';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const AddExpenseForm = ({ onAddExpense }) => {

    const [income, setIncome] = useState({
        category: '',
        amount: '',
        date: '',
        icon: '',
        notes: '',
        tags: '',
        receiptUrl: '',
    });

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });
    const handleTags = (value) => setIncome({ ...income, tags: value });

    const handleUploadReceipt = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        const res = await axiosInstance.post(API_PATHS.EXPENSE.UPLOAD_RECEIPT, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res?.data?.imageUrl) {
            setIncome((prev) => ({ ...prev, receiptUrl: res.data.imageUrl }));
        }
    };
  return <div>
    <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
    />

    <Input
        value={income.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label='Category'
        placeholder='Rent, Groceries, etc'
        type='text'
    />

    <Input
        value={income.amount}
        onChange={({ target }) => handleChange('amount', target.value)}
        label='Amount'
        placeholder=''
        type='number'
    />

    <Input
        value={income.date}
        onChange={({ target }) => handleChange('date', target.value)}
        label='Date'
        placeholder=''
        type='date'
    />

    <Input
        value={income.notes}
        onChange={({ target }) => handleChange('notes', target.value)}
        label='Notes'
        placeholder='Optional description'
        type='text'
    />

    <Input
        value={income.tags}
        onChange={({ target }) => handleTags(target.value)}
        label='Tags'
        placeholder='Comma separated tags (e.g., food,lunch)'
        type='text'
    />

    <div className='mt-3'>
        <label className='text-sm text-gray-700'>Receipt</label>
        <input
            className='w-full mt-1'
            type='file'
            accept='image/*'
            onChange={(e) => handleUploadReceipt(e.target.files?.[0])}
        />
    </div>

    <div className='flex justify-end mt-6'>
        <button
            type='button'
            className='add-btn add-btn-fill'
            onClick={() => onAddExpense({
                ...income,
                tags: income.tags
                    ? income.tags.split(',').map((t) => t.trim()).filter(Boolean)
                    : [],
            })}
        >
            Add Expense
        </button>
    </div>
  </div>
}

export default AddExpenseForm