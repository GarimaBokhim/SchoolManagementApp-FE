'use client';

import { useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Calendar, Filter, BarChart3 } from 'lucide-react';

interface Activity {
  id: number;
  name: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Community' | 'Other';
  date: string;
  participants: number;
  classesInvolved: string[];
  budget: number;
  status: 'Completed' | 'Ongoing' | 'Planned';
  description: string;
}

interface MonthlySummary {
  month: string;
  totalActivities: number;
  totalParticipants: number;
  totalBudget: number;
  academicCount: number;
  sportsCount: number;
  culturalCount: number;
}

const SchoolActivityReport = () => {
  const [currentMonth, setCurrentMonth] = useState('Falgun 2081');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Sample activity data for the school
  const activities: Activity[] = [
    {
      id: 1,
      name: 'Annual Sports Day',
      category: 'Sports',
      date: '2081-11-15',
      participants: 450,
      classesInvolved: ['Grade 1-10'],
      budget: 25000,
      status: 'Completed',
      description: 'Inter-house sports competition including athletics, football, and volleyball'
    },
    {
      id: 2,
      name: 'Science Exhibition',
      category: 'Academic',
      date: '2081-11-20',
      participants: 120,
      classesInvolved: ['Grade 6-10'],
      budget: 15000,
      status: 'Completed',
      description: 'Students presented innovative science projects and models'
    },
    {
      id: 3,
      name: 'Nepali Language Day',
      category: 'Cultural',
      date: '2081-11-25',
      participants: 300,
      classesInvolved: ['Grade 1-10'],
      budget: 8000,
      status: 'Completed',
      description: 'Poetry recitation, essay writing, and drama performances'
    },
    {
      id: 4,
      name: 'Tree Plantation Drive',
      category: 'Community',
      date: '2081-12-05',
      participants: 200,
      classesInvolved: ['Grade 5-10'],
      budget: 5000,
      status: 'Ongoing',
      description: 'Planting 500 trees in school premises and local community'
    },
    {
      id: 5,
      name: 'Mathematics Olympiad',
      category: 'Academic',
      date: '2081-12-10',
      participants: 85,
      classesInvolved: ['Grade 7-10'],
      budget: 10000,
      status: 'Planned',
      description: 'Inter-school mathematics competition'
    },
    {
      id: 6,
      name: 'Cultural Dance Competition',
      category: 'Cultural',
      date: '2081-11-18',
      participants: 150,
      classesInvolved: ['Grade 3-10'],
      budget: 12000,
      status: 'Completed',
      description: 'Traditional Nepali dance performances by different houses'
    },
    {
      id: 7,
      name: 'Health and Hygiene Workshop',
      category: 'Academic',
      date: '2081-12-15',
      participants: 350,
      classesInvolved: ['Grade 1-10'],
      budget: 7000,
      status: 'Planned',
      description: 'Workshop on personal hygiene, dental care, and healthy habits'
    },
    {
      id: 8,
      name: 'Basketball Tournament',
      category: 'Sports',
      date: '2081-11-22',
      participants: 80,
      classesInvolved: ['Grade 8-10'],
      budget: 18000,
      status: 'Completed',
      description: 'Inter-class basketball competition for senior grades'
    },
    {
      id: 9,
      name: 'Community Cleaning Campaign',
      category: 'Community',
      date: '2081-11-28',
      participants: 250,
      classesInvolved: ['Grade 6-10'],
      budget: 3000,
      status: 'Completed',
      description: 'Cleaning and beautification of local temple area'
    },
    {
      id: 10,
      name: 'Art Competition',
      category: 'Cultural',
      date: '2081-12-20',
      participants: 100,
      classesInvolved: ['Grade 1-10'],
      budget: 6000,
      status: 'Planned',
      description: 'Theme-based drawing and painting competition'
    }
  ];

  // Monthly summary data
  const monthlySummaries: MonthlySummary[] = [
    {
      month: 'Mangsir 2081',
      totalActivities: 4,
      totalParticipants: 1120,
      totalBudget: 53000,
      academicCount: 1,
      sportsCount: 1,
      culturalCount: 1,
    },
    {
      month: 'Poush 2081',
      totalActivities: 3,
      totalParticipants: 635,
      totalBudget: 23000,
      academicCount: 2,
      sportsCount: 0,
      culturalCount: 1,
    },
    {
      month: 'Falgun 2081',
      totalActivities: 3,
      totalParticipants: 750,
      totalBudget: 33000,
      academicCount: 0,
      sportsCount: 1,
      culturalCount: 1,
    }
  ];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-700';
      case 'Sports':
        return 'bg-green-100 text-green-700';
      case 'Cultural':
        return 'bg-purple-100 text-purple-700';
      case 'Community':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Ongoing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Planned':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const calculateStats = () => {
    const totalActivities = filteredActivities.length;
    const totalParticipants = filteredActivities.reduce((sum, act) => sum + act.participants, 0);
    const totalBudget = filteredActivities.reduce((sum, act) => sum + act.budget, 0);
    const completedCount = filteredActivities.filter(act => act.status === 'Completed').length;
    
    return { totalActivities, totalParticipants, totalBudget, completedCount };
  };

  const stats = calculateStats();

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          School Activity Report
        </h2>
        <p className="text-center text-gray-600">
          Co-curricular and Extra-curricular Activities Overview
        </p>
        <div className="text-center text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      {/* Controls Section */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Calendar className="w-4 h-4" />
            <span>{currentMonth}</span>
          </button>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Community">Community</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Planned">Planned</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Activities Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">S.N.</th>
              <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Activity Name</th>
              <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Category</th>
              <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Date</th>
              <th className="border border-gray-300 p-3 text-center font-bold text-gray-700">Participants</th>
              <th className="border border-gray-300 p-3 text-left font-bold text-gray-700">Classes</th>
              <th className="border border-gray-300 p-3 text-right font-bold text-gray-700">Budget (NPR)</th>
              <th className="border border-gray-300 p-3 text-center font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity, index) => (
              <tr key={activity.id} className="hover:bg-gray-50 transition">
                <td className="border border-gray-300 p-3 text-center">{index + 1}</td>
                <td className="border border-gray-300 p-3 font-medium">
                  {activity.name}
                  <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
                </td>
                <td className="border border-gray-300 p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(activity.category)}`}>
                    {activity.category}
                  </span>
                </td>
                <td className="border border-gray-300 p-3">
                  {new Date(activity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="border border-gray-300 p-3 text-center font-semibold">{activity.participants}</td>
                <td className="border border-gray-300 p-3 text-sm">{activity.classesInvolved.join(', ')}</td>
                <td className="border border-gray-300 p-3 text-right font-semibold">रु. {activity.budget.toLocaleString()}</td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(activity.status)}`}>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={4} className="border border-gray-300 p-3 text-right">Total:</td>
              <td className="border border-gray-300 p-3 text-center">{stats.totalParticipants}</td>
              <td className="border border-gray-300 p-3"></td>
              <td className="border border-gray-300 p-3 text-right text-blue-700">
                रु. {stats.totalBudget.toLocaleString()}
              </td>
              <td className="border border-gray-300 p-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Monthly Summary Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Monthly Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {monthlySummaries.map((summary, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
              <h4 className="font-bold text-lg text-gray-800 mb-3">{summary.month}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Activities:</span>
                  <span className="font-semibold">{summary.totalActivities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Participants:</span>
                  <span className="font-semibold">{summary.totalParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-semibold">रु. {summary.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Academic: {summary.academicCount}</span>
                  <span className="text-gray-500">Sports: {summary.sportsCount}</span>
                  <span className="text-gray-500">Cultural: {summary.culturalCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Academic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Sports</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
          <span>Cultural</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span>Community</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Ongoing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Planned</span>
        </div>
      </div>
    </div>
  );
};

export default SchoolActivityReport;