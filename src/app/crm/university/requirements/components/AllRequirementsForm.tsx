"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter, Plus, Trash, Edit, BookOpen } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { EditButton } from "@/components/Buttons/EditButton";
import { api } from "@/utils/instance";
import AddRequirementsModal from "../pages/Add";


interface RequirementItem {
  id: string;
  descriptions: string;
  courseId: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface ApiResponse {
  Items: RequirementItem[];
  TotalItems: number;
}

const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr.startsWith("0001")) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const AllRequirementsForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus);

  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<RequirementItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchRequirements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse>("api/AcademicPrograms/FilterRequirements");
      const items = res.data?.Items ?? [];
      setRequirements(items);
      setFiltered(items);
    } catch {
      toast.error("Failed to load requirements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequirements(); }, [fetchRequirements]);

  const handleFilter = () => {
    const lower = searchTerm.toLowerCase();
    setFiltered(
      lower
        ? requirements.filter((r) => r.descriptions.toLowerCase().includes(lower))
        : requirements
    );
  };

  const handleClear = () => {
    setSearchTerm("");
    setFiltered(requirements);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/AcademicPrograms/DeleteRequirement/${id}`);
      toast.success("Requirement deleted successfully!");
      fetchRequirements();
    } catch {
      toast.error("Failed to delete requirement.");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* ── Header ── */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Requirements</h1>
            <div className="flex flex-wrap gap-2 justify-end">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={18} />}
                  type="button"
                  text="Add New"
                  onClick={() => setIsAddModalOpen(true)}
                  className="!font-semibold"
                />
              )}
            </div>
          </div>

          {/* ── Filter Panel ── */}
          {openFilter && (
            <div className="bg-white dark:bg-[#2c2c2c] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 mx-4">
              <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4">
                <div className="flex-1 min-w-[240px]">
                  <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Search Description
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by description..."
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600
                               bg-white dark:bg-[#1f1f22] text-gray-800 dark:text-gray-100
                               focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0 lg:ml-auto items-end">
                  <ButtonElement
                    type="button"
                    text="Filter"
                    icon={<Filter size={14} />}
                    onClick={handleFilter}
                    className="!bg-emerald-600 hover:!bg-emerald-700"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    onClick={handleClear}
                    className="!bg-gray-500 hover:!bg-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Table ── */}
          <div className="overflow-x-auto bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#80878c] text-gray-700 dark:text-white uppercase font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left">S.N</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Course ID</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Status</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Created At</th>
                  {(canEdit || canDelete) && (
                    <th className="px-4 py-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500 dark:text-gray-300">
                      Loading requirements...
                    </td>
                  </tr>
                ) : filtered.length ? (
                  filtered.map((req, index) => (
                    <tr
                      key={req.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-100"
                    >
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-emerald-500 flex-shrink-0" />
                          <span className="line-clamp-2">{req.descriptions}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 hidden md:table-cell font-mono text-xs text-gray-400 dark:text-gray-500">
                        {req.courseId}
                      </td>
                      <td className="py-2 px-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${req.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                          }`}>
                          {req.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-2 px-4 hidden lg:table-cell text-gray-500 dark:text-gray-400">
                        {formatDate(req.createdAt)}
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="py-2 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            {canDelete && (
                              <DeleteButton
                                onConfirm={() => handleDelete(req.id)}
                                headerText={<Trash size={14} />}
                                content="Are you sure you want to delete this requirement?"
                              />
                            )}
                            {canEdit && (
                              <EditButton
                                button={
                                  <ButtonElement
                                    icon={<Edit size={14} />}
                                    type="button"
                                    text=""
                                    onClick={() => toast("Edit coming soon")}
                                    className="!text-xs !bg-teal-500"
                                  />
                                }
                              />
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500 italic">
                      No requirements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <AddRequirementsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchRequirements();
        }}
      />
    </>
  );
};

export default AllRequirementsForm;