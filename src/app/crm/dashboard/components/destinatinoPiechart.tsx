// destinations_pie_chart.tsx - New component for the pie chart
"use client";
import React from "react";
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { destinations } from "../data/mock_data";

const DestinationsPieChart: React.FC = () => {
  // Prepare data for pie chart
  const pieData = destinations.map(dest => ({
    name: dest.country,
    value: dest.students,
    color: dest.color.includes('red') ? '#EF4444' : 
           dest.color.includes('blue') ? '#3B82F6' : 
           dest.color.includes('green') ? '#10B981' : 
           dest.color.includes('purple') ? '#8B5CF6' : '#F59E0B'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#161B27] p-3 rounded-lg shadow-lg border border-gray-200 dark:border-[#1E2A3E]">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Students: <span className="font-bold text-gray-900 dark:text-white">{payload[0].value}</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Percentage: <span className="font-bold text-gray-900 dark:text-white">
              {((payload[0].value / destinations.reduce((sum, d) => sum + d.students, 0)) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const totalStudents = destinations.reduce((sum, d) => sum + d.students, 0);

  return (
    <div className="bg-white dark:bg-[#161B27] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E2A3E] p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#0A53C3" }}
          />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Student Distribution by Country
          </h3>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Total: <span className="font-bold text-gray-900 dark:text-white">{totalStudents}</span> students
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={true}
              className="cursor-pointer"
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>
              )}
            />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#1E2A3E] grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Top Destination</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {destinations[0].country}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {destinations[0].students} students
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fastest Growing</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Canada
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            ↑ 23% this year
          </p>
        </div>
      </div>
    </div>
  );
};

export default DestinationsPieChart;