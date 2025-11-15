// frontend\smart-budget-buddy\src\components\layouts\Navbar.jsx

import React, { useEffect, useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { LuBell, LuMoon, LuSun } from 'react-icons/lu';
import SideMenu from './SideMenu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [openNotif, setOpenNotif] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // apply theme class
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.NOTIFICATIONS.LIST);
            setNotifications(res?.data?.notifications || []);
        } catch {}
    };

    useEffect(() => { fetchNotifications(); }, []);

    const unreadCount = notifications.length;

    return (
    <div className='flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
        <div className='flex items-center gap-4'>
            <button
                className='block lg:hidden text-black'
                onClick={() => {
                    setOpenSideMenu(!openSideMenu);
                }}
            >
                {openSideMenu ? (
                    <HiOutlineX className='text-2xl' />
                ) : (
                    <HiOutlineMenu className='text-2xl' />
                )}
            </button>
            <h2 className='text-lg font-medium text-black'>Smart Budget Buddy</h2>
        </div>

        <div className='flex items-center gap-4'>
            <button
                className='relative text-gray-700 hover:text-black'
                onClick={() => setOpenNotif((o) => !o)}
                aria-label='Notifications'
            >
                <LuBell className='text-xl' />
                {unreadCount > 0 && (
                    <span className='absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5'>
                        {unreadCount}
                    </span>
                )}
            </button>
            <button
                className='text-gray-700 hover:text-black'
                onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                aria-label='Toggle theme'
            >
                {theme === 'dark' ? <LuSun className='text-xl' /> : <LuMoon className='text-xl' />}
            </button>
        </div>

        {openNotif && (
            <div className='absolute right-6 top-14 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-3'>
                <div className='flex items-center justify-between mb-2'>
                    <h4 className='text-sm font-semibold'>Notifications</h4>
                    <button className='text-xs text-gray-500 hover:text-gray-700' onClick={fetchNotifications}>Refresh</button>
                </div>
                {notifications.length === 0 ? (
                    <div className='text-xs text-gray-500 py-3'>No notifications</div>
                ) : (
                    <ul className='max-h-64 overflow-y-auto space-y-2'>
                        {notifications.map((n) => (
                            <li key={n.id} className='text-xs text-gray-700 bg-gray-50 border border-gray-100 rounded p-2'>
                                <div className='font-medium'>{n.title}</div>
                                <div className='text-gray-600'>{n.body}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}

        {openSideMenu && (
            <div className='fixed top-[61px] -ml-4 bg-white '>
                <SideMenu activeMenu={activeMenu} />
            </div>
        )}
    </div>
  )
}

export default Navbar