import { 
  Users, FileText, Award, DollarSign, 
  GraduationCap, Calendar, MessageSquare, 
  BookOpen, Globe 
} from 'lucide-react';

export const dashboardStats = [
  {
    label: 'Total Students',
    value: '1,248',
    change: '+18%',
    icon: Users,
    color: 'from-blue-600 to-cyan-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Enrolled students'
  },
  {
    label: 'Applications',
    value: '342',
    change: '+12%',
    icon: FileText,
    color: 'from-emerald-600 to-green-500',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    description: 'Processing'
  },
  {
    label: 'Visa Success Rate',
    value: '94%',
    change: '+2%',
    icon: Award,
    color: 'from-amber-600 to-orange-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    description: 'This year'
  },
  {
    label: 'Revenue',
    value: '₨ 12.8M',
    change: '+22%',
    icon: DollarSign,
    color: 'from-purple-600 to-pink-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    description: 'YTD'
  },
];

export const students = [
  {
    id: 1,
    name: 'Aarav Sharma',
    program: 'MS Computer Science',
    university: 'University of Melbourne',
    country: 'Australia',
    email: 'aarav.sharma@email.com',
    phone: '+977-9841XXXXXX',
    status: 'active',
    stage: 'Visa Approved',
    location: 'Kathmandu',
    lastUpdate: '2 days ago',
    applicationDate: '2024-01-15',
    intake: 'Feb 2024'
  },
  {
    id: 2,
    name: 'Priya Maharjan',
    program: 'MBA',
    university: 'University of Toronto',
    country: 'Canada',
    email: 'priya.m@email.com',
    phone: '+977-9813XXXXXX',
    status: 'pending',
    stage: 'Documentation',
    location: 'Pokhara',
    lastUpdate: 'Yesterday',
    applicationDate: '2024-01-20',
    intake: 'Sep 2024'
  },
  {
    id: 3,
    name: 'Rohan Gurung',
    program: 'BSc Engineering',
    university: 'University of Leeds',
    country: 'UK',
    email: 'rohan.g@email.com',
    phone: '+977-9851XXXXXX',
    status: 'active',
    stage: 'Offer Received',
    location: 'Chitwan',
    lastUpdate: 'Today',
    applicationDate: '2024-01-10',
    intake: 'Jan 2024'
  },
  {
    id: 4,
    name: 'Sita Karki',
    program: 'MSc Data Science',
    university: 'University of British Columbia',
    country: 'Canada',
    email: 'sita.k@email.com',
    phone: '+977-9801XXXXXX',
    status: 'rejected',
    stage: 'Visa Rejected',
    location: 'Biratnagar',
    lastUpdate: '3 days ago',
    applicationDate: '2023-12-15',
    intake: 'May 2024'
  },
  {
    id: 5,
    name: 'Bikram Thapa',
    program: 'BBA',
    university: 'Monash University',
    country: 'Australia',
    email: 'bikram.t@email.com',
    phone: '+977-9860XXXXXX',
    status: 'active',
    stage: 'Under Review',
    location: 'Kathmandu',
    lastUpdate: '1 hour ago',
    applicationDate: '2024-01-18',
    intake: 'Jul 2024'
  },
  {
    id: 6,
    name: 'Anita Shrestha',
    program: 'PhD Physics',
    university: 'University of Auckland',
    country: 'New Zealand',
    email: 'anita.s@email.com',
    phone: '+977-9822XXXXXX',
    status: 'pending',
    stage: 'Interview Scheduled',
    location: 'Lalitpur',
    lastUpdate: '2 days ago',
    applicationDate: '2024-01-05',
    intake: 'Mar 2024'
  },
];

export const destinations = [
  { country: 'Australia', students: 320, color: 'bg-gradient-to-r from-red-500 to-blue-500' },
  { country: 'Canada', students: 285, color: 'bg-gradient-to-r from-red-600 to-white' },
  { country: 'UK', students: 198, color: 'bg-gradient-to-r from-blue-800 to-red-800' },
  { country: 'USA', students: 175, color: 'bg-gradient-to-r from-blue-600 to-red-600' },
  { country: 'New Zealand', students: 95, color: 'bg-gradient-to-r from-blue-900 to-red-700' },
];

export const programs = [
  { name: 'Computer Science', count: 245, color: 'bg-blue-500' },
  { name: 'Business Administration', count: 189, color: 'bg-green-500' },
  { name: 'Engineering', count: 156, color: 'bg-purple-500' },
  { name: 'Health Sciences', count: 98, color: 'bg-red-500' },
  { name: 'Data Science', count: 76, color: 'bg-amber-500' },
];

export const deadlines = [
  { university: 'University of Sydney', program: 'Masters', deadline: 'Feb 15, 2024', status: 'urgent' },
  { university: 'University of Toronto', program: 'Undergraduate', deadline: 'Mar 1, 2024', status: 'warning' },
  { university: 'University of Manchester', program: 'PhD', deadline: 'Mar 10, 2024', status: 'normal' },
  { university: 'Monash University', program: 'Diploma', deadline: 'Feb 28, 2024', status: 'urgent' },
];

export const sidebarMenuItems = [
  { icon: GraduationCap, label: 'Overview', path: '/' },
  { icon: Users, label: 'Students', count: '1,248', path: '/students' },
  { icon: Calendar, label: 'Appointments', count: '18', path: '/appointments' },
  { icon: FileText, label: 'Applications', path: '/applications' },
  { icon: MessageSquare, label: 'Communications', count: '42', path: '/communications' },
  { icon: DollarSign, label: 'Payments', path: '/payments' },
  { icon: BookOpen, label: 'Universities', path: '/universities' },
  { icon: Globe, label: 'Reports', path: '/reports' },
];