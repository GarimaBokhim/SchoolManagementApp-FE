'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Filter, RotateCcw, Search, Eye, Edit, Trash, MoreVertical, UserCheck, X } from 'lucide-react';
import { api } from '@/utils/instance';
import toast, { Toaster } from 'react-hot-toast';
import { ButtonElement } from '@/components/Buttons/ButtonElement';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface Applicant {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  appliedProgram: string;
  status: 'pending' | 'approved' | 'rejected';
  passportNo?: string;
  targetCountry?: string;
}

interface ApiApplicant {
  id?: string;
  userId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  phone?: string;
  appliedProgram?: string;
  program?: string;
  status?: 'pending' | 'approved' | 'rejected';
  passportNo?: string;
  targetCountry?: string;
}

interface ApiResponse {
  Items?: ApiApplicant[];
  items?: ApiApplicant[];
  data?: ApiApplicant[];
  TotalPages?: number;
  totalPages?: number;
  TotalItems?: number;
  totalItems?: number;
  PageIndex?: number;
  pageIndex?: number;
}

interface ConvertToStudentPayload {
  userId: string;
  universityName: string;
  visaId: string;
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

// ─── Convert to Student Modal ──────────────────────────────────────────────────

interface ConvertToStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApplicant: Applicant | null;
  onSuccess: () => void;
}

const ConvertToStudentModal = ({
  isOpen,
  onClose,
  selectedApplicant,
  onSuccess,
}: ConvertToStudentModalProps) => {
  const [formData, setFormData] = useState<ConvertToStudentPayload>({
    userId: '',
    universityName: '',
    visaId: '',
  });
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (selectedApplicant) {
      setFormData({
        userId: selectedApplicant.userId || selectedApplicant.id,
        universityName: '',
        visaId: '',
      });
    }
  }, [selectedApplicant]);

  if (!isOpen || !selectedApplicant) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setConverting(true);
      await api.post('/api/Enrolments/ConvertToStudents', formData);
      toast.success(`Successfully converted ${selectedApplicant.name} to student!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to convert to student';
      toast.error(`Error: ${msg}`);
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <UserCheck size={20} />
                  Convert to Student
                </h2>
                <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Converting{' '}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {selectedApplicant.name}
                </span>{' '}
                to a student. Please provide the additional information below.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    University Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Harvard University"
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Visa ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="visaId"
                    value={formData.visaId}
                    onChange={handleChange}
                    required
                    placeholder="e.g., V-123456"
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={converting}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg text-sm"
                  >
                    {converting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Converting...
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} />
                        Convert to Student
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Fixed-Position Action Menu ────────────────────────────────────────────────

interface ActionMenuProps {
  applicant: Applicant;
  onView: (a: Applicant) => void;
  onEdit: (a: Applicant) => void;
  onConvert: (a: Applicant) => void;
  onDelete: (id: string) => void;
}

const ActionMenu = ({ applicant, onView, onEdit, onConvert, onDelete }: ActionMenuProps) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 148;
    const menuWidth = 192;
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
            onClick={() => { onView(applicant); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> View Details
          </button>
          <button
            onClick={() => { onEdit(applicant); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Edit className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => { onConvert(applicant); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4" /> Convert to Student
          </button>
          <button
            onClick={() => { onDelete(applicant.id); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Trash className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
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

// ─── Main Component ────────────────────────────────────────────────────────────

const AllApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('pageIndex', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      if (searchTerm) params.append('searchTerm', searchTerm);

      const response = await api.get<ApiResponse>(`/api/Enrolments/FilterApplicants?${params.toString()}`);

      let raw: ApiApplicant[] = [];
      const d = response.data;
      if (d?.Items && Array.isArray(d.Items)) raw = d.Items;
      else if (d?.items && Array.isArray(d.items)) raw = d.items;
      else if (d?.data && Array.isArray(d.data)) raw = d.data;
      else if (Array.isArray(d)) raw = d as unknown as ApiApplicant[];

      const formatted: Applicant[] = raw.map((item: any, index: number) => ({
        id: item.id || `temp-${index}`,
        userId: item.userId || item.id || `temp-${index}`,
        name: item.fullName || item.name || 'N/A',
        email: item.email || 'N/A',
        phone: item.contactNumber || item.phone || 'N/A',
        appliedProgram: item.appliedProgram || item.program || item.targetCountry || 'N/A',
        status: item.status || 'pending',
        passportNo: item.passportNo,
        targetCountry: item.targetCountry,
      }));

      setApplicants(formatted);
      const tp = d?.TotalPages || d?.totalPages;
      if (tp) setTotalPages(tp);
    } catch (err: any) {
      if (err.response?.status === 403) setError("You don't have permission to view applicants.");
      else if (err.response?.status === 400) setError('Invalid request parameters.');
      else if (err.response?.status === 404) setError('API endpoint not found.');
      else if (err.response?.status === 500) setError('Server error. Please try again later.');
      else setError(err.response?.data?.message || 'Failed to fetch applicants.');
      toast.error('Failed to fetch applicants');
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplicants(); }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => { setCurrentPage(1); fetchApplicants(); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Handlers ──
  const handleViewDetails = (applicant: Applicant) => {
    toast.success(`Viewing details for ${applicant.name}`);
  };

  // ✅ No API yet — just toast, do NOT remove from state
  const handleEdit = (_applicant: Applicant) => {
    toast('Editing applicant...', { icon: '✏️' });
  };

  const handleConvertClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowConvertModal(true);
  };

  // ✅ No API yet — just toast, do NOT remove from state
  const handleDelete = (_id: string) => {
    toast('Deleting applicant...', { icon: '🗑️' });
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

  if (error && applicants.length === 0) {
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
        <div className={`bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
          showConvertModal ? 'blur-sm' : ''
        }`}>

          {/* ── Header ── */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Applicants</h1>
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
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00786f] focus:outline-none dark:text-white text-sm w-44 sm:w-52"
                  />
                </div>
                <ButtonElement
                  icon={<Filter className="h-4 w-4" />}
                  text="Filter"
                  onClick={fetchApplicants}
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
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading Applicants...</p>
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
                      <th className="px-4 py-3 text-left">Program / Country</th>
                      <th className="px-4 py-3 text-left">Passport No</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.length > 0 ? (
                      applicants.map((applicant, index) => (
                        <tr
                          key={applicant.id}
                          id={`applicant-${applicant.id}`}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                        >
                          <td className="py-3 px-4 font-mono">
                            {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, '0')}
                          </td>
                          <td className="py-3 px-4 font-medium">{applicant.name}</td>
                          <td className="py-3 px-4">{applicant.email}</td>
                          <td className="py-3 px-4">{applicant.phone}</td>
                          <td className="py-3 px-4">{applicant.appliedProgram}</td>
                          <td className="py-3 px-4">{applicant.passportNo || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${getStatusStyle(applicant.status)}`}>
                              {applicant.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <ActionMenu
                              applicant={applicant}
                              onView={handleViewDetails}
                              onEdit={handleEdit}
                              onConvert={handleConvertClick}
                              onDelete={handleDelete}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                          No applicants found.
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

        {showConvertModal && (
          <ConvertToStudentModal
            isOpen={showConvertModal}
            onClose={() => setShowConvertModal(false)}
            selectedApplicant={selectedApplicant}
            onSuccess={fetchApplicants}
          />
        )}
      </div>
    </>
  );
};

export default AllApplicants;