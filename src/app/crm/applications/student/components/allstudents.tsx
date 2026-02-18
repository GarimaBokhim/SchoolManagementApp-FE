'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Filter, RotateCcw, Search, Eye, Edit, Trash, MoreVertical, X } from 'lucide-react';
import { api } from '@/utils/instance';
import toast, { Toaster } from 'react-hot-toast';
import { ButtonElement } from '@/components/Buttons/ButtonElement';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  passportNo: string;
  targetCountry: string;
  status: string;
  appliedProgram: string;
}

interface ApiStudentItem {
  id?: string;
  userId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  phone?: string;
  passportNo?: string;
  targetCountry?: string;
  status?: string;
  appliedProgram?: string;
  program?: string;
}

interface ApiResponse {
  Items?: ApiStudentItem[];
  items?: ApiStudentItem[];
  data?: ApiStudentItem[];
  TotalItems?: number;
  totalItems?: number;
  TotalPages?: number;
  totalPages?: number;
  PageIndex?: number;
  pageIndex?: number;
}

// ─── Filter Button ─────────────────────────────────────────────────────────────

const FilterButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-[#00786f] text-white shadow-sm'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);

// ─── Status Badge ──────────────────────────────────────────────────────────────

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
};

// ─── Main Component ────────────────────────────────────────────────────────────

const AllStudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const actionMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // ── Close action menu on outside click ──
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = Object.keys(actionMenuRefs.current).every((key) => {
        const ref = actionMenuRefs.current[key];
        return ref && !ref.contains(event.target as Node);
      });
      if (isOutside) setOpenActionMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setActionMenuRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) actionMenuRefs.current[id] = el;
    else delete actionMenuRefs.current[id];
  };

  const toggleActionMenu = (id: string) => {
    setOpenActionMenuId((prev) => (prev === id ? null : id));
  };

  // ── Fetch Students ──
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('pageIndex', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      if (searchTerm) params.append('searchTerm', searchTerm);

      const response = await api.get<ApiResponse>(
        `/api/Enrolments/FilterCRMStudents?${params.toString()}`
      );

      console.log('API Response:', response.data);

      let raw: ApiStudentItem[] = [];
      const d = response.data;
      if (d?.Items && Array.isArray(d.Items)) raw = d.Items;
      else if (d?.items && Array.isArray(d.items)) raw = d.items;
      else if (d?.data && Array.isArray(d.data)) raw = d.data;
      else if (Array.isArray(d)) raw = d as unknown as ApiStudentItem[];

      const formatted: Student[] = raw.map((item: any, index: number) => ({
        id: item.id || item.userId || `temp-${index}`,
        userId: item.userId || item.id || `temp-${index}`,
        name: item.fullName || item.name || 'N/A',
        email: item.email || 'N/A',
        phone: item.contactNumber || item.phone || 'N/A',
        passportNo: item.passportNo || '-',
        targetCountry: item.targetCountry || 'N/A',
        status: item.status || 'pending',
        appliedProgram: item.appliedProgram || item.program || 'N/A',
      }));

      setStudents(formatted);
      const tp = d?.TotalPages || d?.totalPages;
      if (tp) setTotalPages(tp);
    } catch (err: any) {
      console.error('Fetch error:', err);
      if (err.response?.status === 403) setError("You don't have permission to view students.");
      else if (err.response?.status === 404) setError('API endpoint not found.');
      else if (err.response?.status === 500) setError('Server error. Please try again later.');
      else setError(err.response?.data?.message || 'Failed to fetch students.');
      toast.error('Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page change
  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchStudents();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Handlers ──
  const handleViewDetails = (student: Student) => {
    toast.success(`Viewing details for ${student.name}`);
    setOpenActionMenuId(null);
  };

  const handleEdit = (student: Student) => {
    toast.success(`Editing ${student.name}`);
    setOpenActionMenuId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      // Replace with actual delete API call
      setStudents((prev) => prev.filter((s) => s.id !== id));
      toast.success('Student deleted successfully!');
      setOpenActionMenuId(null);
    } catch {
      toast.error('Error deleting student.');
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    toast.success(`Filtering by ${filter}`);
  };

  const onClearClick = () => {
    setActiveFilter('');
    setOpenFilter(false);
    setSearchTerm('');
    toast.success('Filters cleared');
  };

  // ── Render ──
  if (error && students.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-6 p-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">All Students</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage all enrolled student records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ButtonElement
              icon={<Filter className="h-4 w-4" />}
              text="Filter"
              onClick={() => setOpenFilter(!openFilter)}
              className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105"
            />
            <ButtonElement
              icon={<Plus className="h-5 w-5" />}
              type="button"
              text="Add New Student"
              onClick={() => toast('Add student modal coming soon!')}
              className="!text-md !font-bold !bg-[#00786f] hover:!bg-[#00635a] !text-white transition-all duration-150 hover:shadow-md hover:scale-105"
            />
          </div>
        </div>

        {/* ── Filter Section ── */}
        {openFilter && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            {/* Date Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {['Yesterday', '7 Days', '30 Days', 'This Month', 'Last Month', 'This Year'].map(
                (label) => (
                  <FilterButton
                    key={label}
                    label={label}
                    isActive={activeFilter === label}
                    onClick={() => handleFilterClick(label)}
                  />
                )
              )}
            </div>

            {/* Search + Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00786f] focus:outline-none dark:text-white text-sm"
                />
              </div>

              <ButtonElement
                icon={<Search className="h-4 w-4" />}
                text="Search"
                onClick={fetchStudents}
                className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105 whitespace-nowrap"
              />
              <ButtonElement
                icon={<RotateCcw className="h-4 w-4" />}
                text="Clear"
                onClick={onClearClick}
                className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105 whitespace-nowrap"
              />
            </div>
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00786f]"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading Students...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="p-4">S.N</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Passport No</th>
                      <th className="p-4">Target Country</th>
                      <th className="p-4">Program</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {students.length > 0 ? (
                      students.map((student, index) => (
                        <tr
                          key={student.id}
                          id={`student-${student.id}`}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="p-4 text-gray-500 dark:text-gray-400 font-mono">
                            {((currentPage - 1) * pageSize + index + 1)
                              .toString()
                              .padStart(2, '0')}
                          </td>
                          <td className="p-4 font-medium text-gray-800 dark:text-white">
                            {student.name}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">{student.email}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">{student.phone}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {student.passportNo}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {student.targetCountry}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {student.appliedProgram}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${getStatusStyle(
                                student.status
                              )}`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div
                              className="relative"
                              ref={setActionMenuRef(student.id)}
                            >
                              <button
                                onClick={() => toggleActionMenu(student.id)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                              >
                                <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              </button>

                              {openActionMenuId === student.id && (
                                <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 py-1">
                                  <button
                                    onClick={() => handleViewDetails(student)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => handleEdit(student)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(student.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                  >
                                    <Trash className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="p-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllStudentsPage;
