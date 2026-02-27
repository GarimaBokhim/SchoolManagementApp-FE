"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Filter, Plus, Trash, Edit, BookOpen, MoreVertical } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import DeleteButton from "@/components/Buttons/DeleteButton";
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

interface Course {
  id: string;
  title: string;
}

interface CourseApiResponse {
  Items: Course[];
}

const AllRequirementsForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus);

  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<RequirementItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await api.get<CourseApiResponse>("api/AcademicPrograms/FilterCourse");
      const items = res.data?.Items ?? [];
      const map: Record<string, string> = {};

      items.forEach((c) => {
        map[String(c.id)] = c.title;
      });

      setCourseMap(map);
    } catch {
      toast.error("Failed to load courses.");
    }
  };

  // Fetch Requirements
  const fetchRequirements = async () => {
    try {
      const res = await api.get<ApiResponse>("api/AcademicPrograms/FilterRequirements");
      const items = res.data?.Items ?? [];
      setRequirements(items);
      setFiltered(items);
    } catch {
      toast.error("Failed to load requirements.");
    }
  };

  // Load courses first, then requirements
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCourses();
      await fetchRequirements();
      setLoading(false);
    };

    loadData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilter = () => {
    const lower = searchTerm.toLowerCase();
    setFiltered(
      lower
        ? requirements.filter((r) =>
            r.descriptions.toLowerCase().includes(lower)
          )
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

          {/* Header */}
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

          {/* Filter Panel */}
          {openFilter && (
            <div className="bg-white dark:bg-[#2c2c2c] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 mx-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 min-w-[240px]">
                  <label className="block mb-1.5 text-sm font-medium">
                    Search Description
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by description..."
                    className="w-full px-4 py-2.5 border rounded-lg"
                  />
                </div>
                <div className="flex gap-2 items-end">
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#80878c] uppercase font-semibold border-b">
                  <th className="px-4 py-3 text-left">S.N</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Course Name</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Status</th>
                  {(canEdit || canDelete) && (
                    <th className="px-4 py-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      Loading requirements...
                    </td>
                  </tr>
                ) : filtered.length ? (
                  filtered.map((req, index) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-emerald-500" />
                          <span>{req.descriptions}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 hidden md:table-cell">
                        {courseMap[req.courseId] ?? "Unknown Course"}
                      </td>
                      <td className="py-2 px-4 hidden lg:table-cell">
                        {req.isActive ? "Active" : "Inactive"}
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="py-2 px-4 text-center">
                          <div className="relative" ref={openMenuId === req.id ? menuRef : null}>
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(openMenuId === req.id ? null : req.id)
                              }
                            >
                              <MoreVertical size={16} />
                            </button>

                            {openMenuId === req.id && (
                              <div className="absolute right-0 top-8 w-36 bg-white border rounded shadow">
                                {canEdit && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      toast("Edit coming soon");
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                                  >
                                    <Edit size={14} />
                                    Edit
                                  </button>
                                )}
                               
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center italic">
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