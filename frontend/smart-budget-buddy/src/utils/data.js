import {
    LuLayoutDashboard,
    LuHandCoins, 
    LuWalletMinimal,
    LuTarget,
    LuLogOut,
} from 'react-icons/lu';
import { IoPieChart } from 'react-icons/io5';

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense",
    },
    {
        id: "04",
        label: "Budgets",
        icon: IoPieChart,
        path: "/budgets",
    },
    {
        id: "05",
        label: "Goals",
        icon: LuTarget,
        path: "/goals",
    },
    {
        id: "06",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    }
]