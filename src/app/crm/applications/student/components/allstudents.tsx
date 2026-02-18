'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Filter, RotateCcw, Search, Eye, Edit, Trash, MoreVertical } from 'lucide-react';
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
  visaId: string;  // Changed from passportNo to visaId
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
  visaId?: string;  // Changed from passportNo to visaId
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

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

// ─── Filter Button ─────────────────────────────────────────────────────────────

const FilterButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-white transition-all duration-150 whitespace-nowrap ${
      isActive
        ? 'bg-[#00786f] shadow-lg transform scale-105'
        : 'bg-[#00786f] opacity-80 hover:opacity-100 hover:shadow-md hover:scale-105'
    }`}
  >
    {label}
  </button>
);

// ─── Fixed-Position Action Menu ────────────────────────────────────────────────

interface ActionMenuProps {
  student: Student;
  onView: (s: Student) => void;
  onEdit: (s: Student) => void;
  onDelete: (id: string) => void;
}

const ActionMenu = ({ student, onView, onEdit, onDelete }: ActionMenuProps) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 110;
    const menuWidth = 176;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + 8;
    setMenuStyle({
      position: 'fixed',
      right: window.innerWidth - rect.right,
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      width: menuWidth,
      zIndex: 9999,
    });
  }, []);

  const toggle = () => {
    if (!open) calculatePosition();
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const update = () => calculatePosition();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, calculatePosition]);

  return (
    <div className="flex justify-center">
      <button
        ref={buttonRef}
        onClick={toggle}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
        >
          <button
            onClick={() => { onView(student); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> View Details
          </button>
          <button
            onClick={() => { onEdit(student); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Edit className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => { onDelete(student.id); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Trash className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('pageIndex', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      if (searchTerm) params.append('searchTerm', searchTerm);

      const response = await api.get<ApiResponse>(`/api/Enrolments/FilterCRMStudents?${params.toString()}`);

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
        visaId: item.visaId || '-',  // Changed from passportNo to visaId
        targetCountry: item.targetCountry || 'N/A',
        status: item.status || 'pending',
        appliedProgram: item.appliedProgram || item.program || 'N/A',
      }));

      setStudents(formatted);
      const tp = d?.TotalPages || d?.totalPages;
      if (tp) setTotalPages(tp);
    } catch (err: any) {
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

  useEffect(() => { fetchStudents(); }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => { setCurrentPage(1); fetchStudents(); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Handlers ──
  const handleViewDetails = (student: Student) => {
    toast.success(`Viewing details for ${student.name}`);
  };

  // ✅ No API yet — just toast, do NOT remove from state
  const handleEdit = (_student: Student) => {
    toast('Editing student...', { icon: '✏️' });
  };

  // ✅ No API yet — just toast, do NOT remove from state
  const handleDelete = (_id: string) => {
    toast('Deleting student...', { icon: '🗑️' });
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

  if (error && students.length === 0) {
    return (
      <div className="p-6">
        <Toaster position="top-right" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6 relative">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* ── Header ── */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Students</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                icon={<Filter className="h-4 w-4" />}
                text="Filter"
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105"
              />
            </div>
          </div>

          {/* ── Filter Section ── */}
          {openFilter && (
            <div className="mb-4 mx-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 dark:bg-[#353535] dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-2">
                {['Yesterday', '7 Days', '30 Days', 'This Month', 'Last Month', 'This Year'].map((label) => (
                  <FilterButton key={label} label={label} isActive={activeFilter === label} onClick={() => handleFilterClick(label)} />
                ))}
                <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00786f] focus:outline-none dark:text-white text-sm w-44 sm:w-52"
                  />
                </div>
                <ButtonElement
                  icon={<Filter className="h-4 w-4" />}
                  text="Filter"
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
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00786f]" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading Students...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                      <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Visa ID</th> {/* Changed from Passport No to Visa ID */}
                      <th className="px-4 py-3 text-left">Target Country</th>
                      <th className="px-4 py-3 text-left">Program</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.map((student, index) => (
                        <tr
                          key={student.id}
                          id={`student-${student.id}`}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                        >
                          <td className="py-3 px-4 font-mono">
                            {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, '0')}
                          </td>
                          <td className="py-3 px-4 font-medium">{student.name}</td>
                          <td className="py-3 px-4">{student.email}</td>
                          <td className="py-3 px-4">{student.phone}</td>
                          <td className="py-3 px-4">{student.visaId}</td> {/* Changed from passportNo to visaId */}
                          <td className="py-3 px-4">{student.targetCountry}</td>
                          <td className="py-3 px-4">{student.appliedProgram}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${getStatusStyle(student.status)}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <ActionMenu
                              student={student}
                              onView={handleViewDetails}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
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
                      className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-gray-300"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-gray-300"
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