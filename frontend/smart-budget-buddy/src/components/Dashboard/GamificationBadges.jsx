import React from 'react';

const Badge = ({ name, desc }) => (
  <div className='flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-lg p-3'>
    <div className='w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center text-violet-800 text-sm font-semibold'>🏅</div>
    <div className='flex flex-col'>
      <div className='text-sm font-semibold text-violet-900'>{name}</div>
      {desc ? <div className='text-xs text-violet-700'>{desc}</div> : null}
    </div>
  </div>
);

const GamificationBadges = ({ badges = [], streakDays = 0 }) => {
  return (
    <div className='bg-white border rounded-lg p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-lg font-semibold'>Achievements</h3>
        <div className='text-sm text-gray-600'>Logging streak: <span className='font-semibold text-gray-900'>{streakDays} day{streakDays === 1 ? '' : 's'}</span></div>
      </div>
      {badges.length === 0 ? (
        <div className='text-sm text-gray-500'>No badges yet. Keep tracking to earn achievements!</div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {badges.map((b) => (
            <Badge key={b.id} name={b.name} desc={b.desc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GamificationBadges;
