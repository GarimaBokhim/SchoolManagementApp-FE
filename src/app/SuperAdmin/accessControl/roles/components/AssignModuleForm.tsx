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

  // ✅ ALL MODULES (flat list for reference)
  useEffect(() => {
    if (data?.Items) {
      setAllModules(data.Items);
    }
  }, [data]);

  // ✅ GROUPED MODULES from API response
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
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between mb-4 sticky top-0 bg-white pb-2">
          <h2 className="text-xl font-semibold">Assign Modules</h2>
          <X onClick={onClose} className="cursor-pointer text-red-500" />
        </div>

        {/* Select All - Global */}
        {allModules.length > 0 && (
          <div className="flex justify-between p-3 bg-gray-100 rounded mb-4">
            <span className="font-semibold">Select All Modules</span>
            <input
              type="checkbox"
              checked={allModules.every((m) =>
                selectedModules.includes(m.Id)
              )}
              onChange={handleSelectAll}
            />
          </div>
        )}

        {/* Grouped Modules by AppName */}
        {groupedModules.map((group, index) => (
          <div key={index} className="mb-6 border rounded-lg overflow-hidden">
            {/* Group Header */}
            <div className="bg-blue-50 p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">{group.AppName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Select All ({group.Modules.length})
                </span>
                <input
                  type="checkbox"
                  checked={group.Modules.every((m) =>
                    selectedModules.includes(m.Id)
                  )}
                  onChange={() => handleSelectAllForGroup(group)}
                  className="ml-2"
                />
              </div>
            </div>

            {/* Group Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
              {group.Modules.map((mod) => (
                <div
                  key={mod.Id}
                  className="flex justify-between items-center p-3 border rounded hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium">{mod.Name}</span>
                    {mod.TargetUrl && (
                      <p className="text-xs text-gray-500 mt-1">{mod.TargetUrl}</p>
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
        <div className="flex justify-center mt-6 sticky bottom-0 bg-white pt-4 border-t">
          <ButtonElement
            text="Submit"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignModuleForm;