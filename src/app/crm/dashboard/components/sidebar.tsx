import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Plus, CheckCircle, LucideIcon } from 'lucide-react';
import { sidebarMenuItems, destinations } from '../data/mock_data';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SidebarMenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  count?: number;
}

interface Destination {
  country: string;
  students: number | string;
  color: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  return (
    <>
      {sidebarOpen && (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  Himalayan Education
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Study Abroad CRM
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {(sidebarMenuItems as SidebarMenuItem[]).map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between p-3 rounded-lg transition duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Top Destinations */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Top Destinations
              </h3>
              <div className="space-y-3">
                {(destinations as Destination[])
                  .slice(0, 3)
                  .map((dest, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${dest.color} rounded-full`} />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {dest.country}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {dest.students}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </nav>

          {/* Add New Student */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white p-3 rounded-lg flex items-center justify-center space-x-2 transition duration-200">
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Add New Student</span>
            </button>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Last updated: 5 min ago</span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
