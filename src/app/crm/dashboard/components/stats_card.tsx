import React from 'react';
import { TrendingUp, LucideIcon } from 'lucide-react';

interface StatProps {
  stat: {
    icon: LucideIcon;
    bgColor: string;
    color: string;
    change: string;
    value: string | number;
    label: string;
    description: string;
  };
}

const StatsCard: React.FC<StatProps> = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className={`p-3 ${stat.bgColor} rounded-lg`}>
          <Icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
        </div>
        <div className="flex items-center space-x-1 text-sm font-medium text-green-600 dark:text-green-400">
          <TrendingUp className="h-4 w-4" />
          <span>{stat.change}</span>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
        <p className="text-gray-600 dark:text-gray-300 font-medium mt-1">{stat.label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
      </div>
    </div>
  );
};

export default StatsCard;