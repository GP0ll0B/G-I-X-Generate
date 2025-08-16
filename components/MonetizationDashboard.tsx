import React from 'react';
import { motion } from 'framer-motion';
import { MONETIZATION_TOOLS_DATA, PAYOUT_DATA, MonetizationTool } from '../constants';
import { 
    ArrowLeftIcon, ChartPieIcon, StarIcon, PlayIcon, UsersIcon, AwardIcon, CheckCircleIcon, ClockIcon 
} from './ui/icons';

interface MonetizationDashboardProps {
    onBack: () => void;
}

const iconMap: { [key: string]: React.FC<{className?: string}> } = {
    'Stars': StarIcon,
    'In-Stream Ads': PlayIcon,
    'Fan Subscriptions': UsersIcon
};

const statusColorMap: { [key in MonetizationTool['status']]: string } = {
    'Active': 'bg-green-500',
    'Eligible': 'bg-blue-500',
    'Set up': 'bg-yellow-500',
    'Not eligible': 'bg-gray-500'
};

const EarningsChart: React.FC = () => (
    <div className="flex items-end h-24 gap-1.5">
        {[...Array(14)].map((_, i) => (
            <div 
                key={i} 
                className="w-full bg-blue-500/50 rounded-t-sm" 
                style={{ height: `${Math.sin(i / 2) * 40 + 60}%` }}
            />
        ))}
    </div>
);

const MonetizationDashboard: React.FC<MonetizationDashboardProps> = ({ onBack }) => {

    return (
        <div className="space-y-8">
            <div>
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
                >
                    <ArrowLeftIcon />
                    <span>Back to Professional Dashboard</span>
                </button>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Monetization</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Track your earnings, tools, and payouts.</p>
            </div>

            {/* Earnings Overview */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Earnings (Last 28 Days)</p>
                        <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-1">$1,234.56</p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">+15.2%</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-black/5 dark:bg-white/5">
                        <ChartPieIcon className="h-5 w-5" />
                        <span>Overview</span>
                    </div>
                </div>
                <div className="mt-4">
                    <EarningsChart />
                </div>
            </div>

            {/* Monetization Tools */}
            <div className="space-y-4">
                 <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Your Tools</h3>
                 {MONETIZATION_TOOLS_DATA.map(tool => {
                     const Icon = iconMap[tool.name] || StarIcon;
                     return (
                        <div key={tool.name} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg border border-white/20 dark:border-white/10 p-4 flex items-center gap-4">
                            <div className="flex-shrink-0 text-blue-500 dark:text-blue-400">
                                <Icon />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-gray-800 dark:text-gray-200">{tool.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2.5 h-2.5 rounded-full ${statusColorMap[tool.status]}`}></div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{tool.status}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">${tool.earnings.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Last 28 days</p>
                            </div>
                        </div>
                     );
                 })}
            </div>
            
            {/* Performance Bonus */}
             <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-white/10">
                <div className="flex items-center gap-3">
                    <AwardIcon className="h-8 w-8 text-yellow-500"/>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Performance Bonus</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Earn bonuses for creating engaging content.</p>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="text-gray-700 dark:text-gray-300">Monthly Progress</span>
                        <span className="text-gray-800 dark:text-gray-200">$850 / $1,000</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">22 days left in this bonus period.</p>
                </div>
            </div>

            {/* Recent Payouts */}
            <div>
                 <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Recent Payouts</h3>
                 <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg border border-white/20 dark:border-white/10 overflow-hidden">
                     <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                        {PAYOUT_DATA.map(payout => (
                            <div key={payout.date} className="p-4 grid grid-cols-3 gap-4 items-center">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{new Date(payout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{payout.method}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-800 dark:text-gray-200">${payout.amount.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center justify-end gap-2 text-sm">
                                    {payout.status === 'Paid' ? <CheckCircleIcon className="text-green-500"/> : <ClockIcon className="text-yellow-500"/>}
                                    <span className={payout.status === 'Paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>{payout.status}</span>
                                </div>
                            </div>
                        ))}
                     </div>
                 </div>
            </div>

        </div>
    );
};

export default MonetizationDashboard;