// frontend\smart-budget-buddy\src\pages\Dashboard
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useUserAuth } from '../../hooks/useUserAuth';
import InfoCard from '../../components/Cards/InfoCard';

import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';

import { addThousandsSeparator } from '../../utils/helper';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';
import CategorySpendingPie from '../../components/Dashboard/CategorySpendingPie';
import MonthlyTrend from '../../components/Dashboard/MonthlyTrend';
import InsightsPanel from '../../components/Dashboard/InsightsPanel';
import GamificationBadges from '../../components/Dashboard/GamificationBadges';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState({ income: [], expense: [] });
  const [insights, setInsights] = useState({ tips: [], forecast: 0 });
  const [achievements, setAchievements] = useState({ badges: [], streakDays: 0 });

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const [dash, cat, trend, tips, gam] = await Promise.all([
        axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA),
        axiosInstance.get(API_PATHS.INSIGHTS.CATEGORY_SUMMARY),
        axiosInstance.get(API_PATHS.INSIGHTS.MONTHLY_TREND),
        axiosInstance.get(API_PATHS.INSIGHTS.TIPS),
        axiosInstance.get(API_PATHS.GAMIFICATION.SUMMARY),
      ]);

      if (dash.data) setDashboardData(dash.data);
      if (Array.isArray(cat.data)) setCategorySummary(cat.data);
      if (trend.data) setMonthlyTrend(trend.data);
      if (tips.data) setInsights(tips.data);
      if (gam.data) setAchievements(gam.data);
    }
    catch (error) {
      console.log("Something went wrong. Please try again.", error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-green-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0} 
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpenses || 0} 
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />  

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />

          <CategorySpendingPie data={categorySummary} />
          <MonthlyTrend data={monthlyTrend} />
          <InsightsPanel tips={insights?.tips || []} forecast={insights?.forecast || 0} />
          <GamificationBadges badges={achievements.badges} streakDays={achievements.streakDays} />
            
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home