// components/AllRequirementsForm.tsx

"use client";

import { useState, useRef, useMemo } from "react";
import { Filter, Plus, RotateCcw, BookOpen, FileText, MoreVertical, Edit } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import DeleteButton from "@/components/Buttons/DeleteButton";
import AddRequirementsModal from "../pages/Add";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { useForm } from "react-hook-form";
import useRequirements from "../hooks/UseRequirements";
import { IDocumentCheckListDTO, IDocumentType, IRequirement } from "../types/IRequirement";
import { useGetAllDocumentTypesList } from "@/app/crm/documents/_document/hooks";
import { api } from "@/utils/instance";

interface FilterFormData {
  search: string;
  startDate: string;
  endDate: string;
}

// ─── Toggle Switch Component ───────────────────────────────────────────────────
const ToggleSwitch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
      ${checked ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    `}
  >
    <span
      className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow transition duration-200 ease-in-out
        ${checked ? "translate-x-4" : "translate-x-0"}
      `}
    />
  </button>
);

// ─── Document Row with Toggle ──────────────────────────────────────────────────
const DocumentToggleRow = ({
  doc,
  label,
  documentTypeMap,
}: {
  doc: IDocumentCheckListDTO & { id: string };
  label: string;
  documentTypeMap: Record<string, string>;
}) => {
  // Initial state: toggle OFF (as per requirement)
  const [isRequired, setIsRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (val: boolean) => {
    setLoading(true);
    try {
      if (val) {
        // Toggle ON → RequiredDocType
        await api.put("api/AcademicPrograms/RequiredDocType", {
          dockCheckListId: doc.id,
        });
        toast.success(`${label} marked as required`);
      } else {
        // Toggle OFF → NonRequiredDocType
        await api.put("api/AcademicPrograms/NonRequiredDocType", {
          dockCheckListId: doc.id,
        });
        toast.success(`${label} marked as not required`);
      }
      setIsRequired(val);
    } catch (error) {
      console.error("Failed to update document type requirement:", error);
      toast.error("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
      <FileText size={12} className="text-gray-400 shrink-0" />
      <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">
        {label}
      </span>
      <ToggleSwitch
        checked={isRequired}
        onChange={handleToggle}
        disabled={loading}
      />
    </div>
  );
};

// ─── Requirement Card ──────────────────────────────────────────────────────────
const RequirementCard = ({
  req,
  index,
  courseName,
  canEdit,
  canDelete,
  onDelete,
  documentTypeMap,
}: {
  req: IRequirement;
  index: number;
  courseName: string;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
  documentTypeMap: Record<string, string>;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const docs: (IDocumentCheckListDTO & { id: string })[] =
    (req.DocumentsCheckListDTOs || []).map((d) => ({
      ...d,
      // Use documenteTypeId as the id to send to the API
      id: d.documenteTypeId,
    }));

  const getDocumentTypeName = (id: string) =>
    documentTypeMap[id] || `Unknown (${id.slice(-8)})`;

  return (
    <div className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Card Body */}
      <div className="p-4 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
            #{index + 1}
          </span>

          <div className="flex items-center gap-1">
           {/* Edit Button - always visible */}
<button
  type="button"
  onClick={() => toast("Edit functionality coming soon")}
  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md transition"
>
  <Edit size={12} />
  Edit
</button>

            {/* Delete via dropdown (only if canDelete and no canEdit, or always show) */}
            {canDelete && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                >
                  <MoreVertical size={15} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-7 w-36 bg-white dark:bg-[#2c2c2c] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                    <div className="px-1 py-1">
                      <DeleteButton
                        onConfirm={() => {
                          setMenuOpen(false);
                          onDelete(req.id);
                        }}
                        headerText={<span>Delete Requirement</span>}
                        content="Are you sure you want to delete this requirement?"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex items-start gap-2">
          <BookOpen size={15} className="text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">
            {req.descriptions || "—"}
          </p>
        </div>

        {/* Course */}
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          <span className="font-medium text-gray-600 dark:text-gray-300">Course: </span>
          {courseName}
        </div>
      </div>

      {/* Document Checklist Section */}
      <div className="border-t border-gray-100 dark:border-gray-700 mt-auto">
        {docs.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-400 dark:text-gray-500 italic">
            <FileText size={13} />
            No documents required
          </div>
        ) : (
          <div className="px-4 py-3 flex flex-col gap-2">
            {docs.map((doc, idx) => (
              <DocumentToggleRow
                key={`doc-${doc.documenteTypeId}-${idx}`}
                doc={doc}
                label={getDocumentTypeName(doc.documenteTypeId)}
                documentTypeMap={documentTypeMap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AllRequirementsForm = () => {
  const { menuStatus } = usePermissions();
  const { canAdd, canEdit, canDelete } = useMenuPermissionData(menuStatus);

  const [openFilter, setOpenFilter] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [params, setParams] = useState("");
  const formRef = useRef<DateRangeFilterRef>(null);

  const form = useForm<FilterFormData>({
    defaultValues: { search: "", startDate: "", endDate: "" },
  });

  const { filtered, loading, courseMap, fetchRequirements, handleDelete } = useRequirements();
  const { handleError, clearError } = useErrorHandler();

  const { data: documentTypes = [] } = useGetAllDocumentTypesList();

  const documentTypeMap = useMemo(() => {
    const map: Record<string, string> = {};
    documentTypes.forEach((type: IDocumentType) => {
      map[type.id] = type.name;
    });
    return map;
  }, [documentTypes]);

  const onFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.search ? `search=${encodeURIComponent(formData.search)}` : null,
        formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
        formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";

      await toast.promise(
        (async () => {
          setParams(fullQuery);
          await fetchRequirements(fullQuery);
        })(),
        { loading: "Fetching data...", success: "Data fetched successfully!", error: "Failed to fetch data" }
      );
    } catch (error) {
      Toast.error(handleError(error));
    }
  };

  const handleClearFilters = () => {
    form.reset({ search: "", startDate: "", endDate: "" });
    setParams("");
    if (formRef.current?.handleClear) {
      formRef.current.handleClear();
    }
    fetchRequirements();
  };

  const inputClass = `w-full px-4 py-2.5 bg-white dark:bg-[#1f1f22] border border-gray-300
    dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
    dark:text-white text-sm`;

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex w-full justify-between p-4 items-center border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Requirements</h1>
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
            <div className="bg-gray-50 dark:bg-[#2c2c2c] p-5 border-b border-gray-200 dark:border-gray-700">
              <form
                onSubmit={form.handleSubmit(onFilterSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onFilterSubmit}
                  setParams={setParams}
                />
                <div className="flex flex-1 items-end gap-2 min-w-[200px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search Description
                    </label>
                    <input
                      type="text"
                      placeholder="Search by description..."
                      {...form.register("search")}
                      className={inputClass}
                    />
                  </div>
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={handleClearFilters}
                    className="!bg-gray-500 hover:!bg-gray-600"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Card Grid */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((req, index) => (
                  <RequirementCard
                    key={req.id}
                    req={req}
                    index={index}
                    courseName={courseMap[req.courseId] ?? "Unknown Course"}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onDelete={handleDelete}
                    documentTypeMap={documentTypeMap}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <BookOpen size={40} className="mb-3 opacity-40" />
                <p className="text-sm italic">No requirements found.</p>
              </div>
            )}
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