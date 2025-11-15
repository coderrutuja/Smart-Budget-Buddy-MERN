// frontend\smart-budget-buddy\src\utils\apiPaths.js
export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        GET_USER_INFO: "/api/auth/getUser",
    },
    DASHBOARD: {
        GET_DATA: "/api/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/income/add",
        GET_ALL_INCOME: "/api/income/get",
        DELETE_INCOME: (incomeId) => `/api/income/${incomeId}`,
        DOWNLOAD_INCOME: "/api/income/downloadexcel",
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/expense/add",
        GET_ALL_EXPENSE: "/api/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: "/api/expense/downloadexcel",
        UPLOAD_RECEIPT: "/api/expense/upload-receipt",
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },
    BUDGETS: {
        CREATE: "/api/budgets",
        LIST: "/api/budgets",
        UPDATE: (id) => `/api/budgets/${id}`,
        DELETE: (id) => `/api/budgets/${id}`,
    },
    GOALS: {
        CREATE: "/api/goals",
        LIST: "/api/goals",
        UPDATE: (id) => `/api/goals/${id}`,
        DELETE: (id) => `/api/goals/${id}`,
    },
    INSIGHTS: {
        CATEGORY_SUMMARY: "/api/insights/category-summary",
        MONTHLY_TREND: "/api/insights/monthly-trend",
        TIPS: "/api/insights/tips",
    },
    GAMIFICATION: {
        SUMMARY: "/api/gamification",
    },
    NOTIFICATIONS: {
        LIST: "/api/notifications",
    },
    SHEETS: {
        EXPORT_INCOME: "/api/sheets/export/income",
        EXPORT_EXPENSE: "/api/sheets/export/expense",
    },
};
