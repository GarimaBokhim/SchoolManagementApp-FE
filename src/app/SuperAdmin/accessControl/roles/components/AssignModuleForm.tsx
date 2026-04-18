"use client";
import {
  useGetAllModules,
} from "@/app/SuperAdmin/navigation/modules/hooks";
import { useEffect, useState, MouseEvent } from "react";
import { useAssignModule } from "../assignrole/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAssignModule } from "../assignrole/types/IAssign";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X } from "lucide-react";
import { IRoleModuleGroup } from "../types/IRoles";
import { useGetModuleByRoleId } from "../hooks";

interface Props {
  roleId: string;
  refetchRoles: () => void;
  visible: boolean;
  onClose: () => void;
}

const AssignModuleForm = ({
  roleId,
  refetchRoles,
  visible,
  onClose,
}: Props) => {
  const { handleSubmit } = useForm<IAssignModule>();

  const [allModules, setAllModules] = useState<any[]>([]);
  const [groupedModules, setGroupedModules] = useState<IRoleModuleGroup[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const { data: assignedData } = useGetModuleByRoleId(roleId);
  const { data } = useGetAllModules();
  const assignModule = useAssignModule();

  // ALL MODULES (flat list for reference)
  useEffect(() => {
    if (data?.Items) {
      setAllModules(data.Items);
    }
  }, [data]);

  //  GROUPED MODULES from API response
  useEffect(() => {
    if (assignedData && Array.isArray(assignedData)) {
      setGroupedModules(assignedData as IRoleModuleGroup[]);
      // Flatten to get selected module IDs
      const ids = (assignedData as IRoleModuleGroup[]).flatMap((group) =>
        group.Modules.map((m) => m.Id)
      );
      setSelectedModules(ids);
    }
  }, [assignedData]);

  const handleCheckboxChange = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectAllForGroup = (group: IRoleModuleGroup) => {
    const groupModuleIds = group.Modules.map((m) => m.Id);
    const allSelectedInGroup = groupModuleIds.every((id) =>
      selectedModules.includes(id)
    );
    
    if (allSelectedInGroup) {
      // Remove all modules in this group
      setSelectedModules((prev) =>
        prev.filter((id) => !groupModuleIds.includes(id))
      );
    } else {
      // Add all modules in this group
      setSelectedModules((prev) => [...prev, ...groupModuleIds]);
    }
  };

  const handleSelectAll = () => {
    const allIds = allModules.map((m) => m.Id);
    const areAllSelected = allIds.every((id) =>
      selectedModules.includes(id)
    );
    setSelectedModules(areAllSelected ? [] : allIds);
  };

  const onSubmit: SubmitHandler<IAssignModule> = async () => {
    if (!selectedModules.length) return;

    try {
      await assignModule.mutateAsync({
        roleId,
        modulesId: selectedModules,
        isActive: true,
        isAssign: true,
      });

      refetchRoles();
    } finally {
      onClose();
    }
  };

  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === roleId) onClose();
  };

  if (!visible) return null;

  return (
    <div
      id={roleId}
      onClick={handleOnClose}
      className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2"
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <fieldset className="bg-white dark:bg-[#353535] rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-600">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Assign Modules
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} strokeWidth={3} color="red" />
            </button>
          </div>

          {/* Select All - Global */}
          {allModules.length > 0 && (
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded mb-4">
              <span className="font-semibold text-gray-800 dark:text-gray-50">
                Select All Modules
              </span>
              <input
                type="checkbox"
                checked={allModules.every((m) =>
                  selectedModules.includes(m.Id)
                )}
                onChange={handleSelectAll}
                className="w-4 h-4"
              />
            </div>
          )}

          {/* Grouped Modules by AppName */}
          {groupedModules.map((group, index) => (
            <div key={index} className="mb-6 border rounded-lg overflow-hidden dark:border-gray-600">
              {/* Group Header */}
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 border-b dark:border-gray-600 flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-50">
                  {group.AppName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Select All ({group.Modules.length})
                  </span>
                  <input
                    type="checkbox"
                    checked={group.Modules.every((m) =>
                      selectedModules.includes(m.Id)
                    )}
                    onChange={() => handleSelectAllForGroup(group)}
                    className="w-4 h-4"
                  />
                </div>
              </div>

              {/* Group Modules Grid */}
              <div className="grid grid-cols-1 gap-3 p-4">
                {group.Modules.map((mod) => (
                  <div
                    key={mod.Id}
                    className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                  >
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-50">
                        {mod.Name}
                      </span>
                      {mod.TargetUrl && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {mod.TargetUrl}
                        </p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(mod.Id)}
                      onChange={() => handleCheckboxChange(mod.Id)}
                      className="w-4 h-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="flex justify-center mt-6">
            <ButtonElement
              text="Submit"
              onClick={handleSubmit(onSubmit)}
              className="hover:bg-teal-700 transition-all"
            />
          </div>
          
        </fieldset>
      </div>
    </div>
  );
};

export default AssignModuleForm;