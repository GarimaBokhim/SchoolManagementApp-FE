"use client";

import { useGetAllModules } from "@/app/SuperAdmin/navigation/modules/hooks";
import { useEffect, useState, MouseEvent } from "react";
import { useAssignModule } from "../assignrole/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAssignModule } from "../assignrole/types/IAssign";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X } from "lucide-react";
import { useGetModuleByRoleId } from "../hooks";

interface Props {
  roleId: string;
  refetchRoles: () => void;
  visible: boolean;
  onClose: () => void;
}

interface IGroup {
  AppId: string;
  AppName: string;
  Modules: any[];
}

const AssignModuleForm = ({
  roleId,
  refetchRoles,
  visible,
  onClose,
}: Props) => {
  const { handleSubmit } = useForm<IAssignModule>();

  const [allModules, setAllModules] = useState<any[]>([]);
  const [groupedModules, setGroupedModules] = useState<IGroup[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const { data } = useGetAllModules();
  const { data: assignedData } = useGetModuleByRoleId(roleId);
  const assignModule = useAssignModule();

  // ✅ Load all modules
  useEffect(() => {
    if (data?.Items) {
      setAllModules(data.Items);
    }
  }, [data]);

  // ✅ Group by appId (BEST FIX)
  useEffect(() => {
    if (allModules.length > 0) {
      const grouped = allModules.reduce((acc: any, module: any) => {
        const key = module.appId;

        if (!acc[key]) {
          acc[key] = {
            AppId: module.appId,
            AppName: module.appName,
            Modules: [],
          };
        }

        acc[key].Modules.push(module);

        return acc;
      }, {});

      setGroupedModules(Object.values(grouped));
    }
  }, [allModules]);

  // ✅ Load assigned modules
  useEffect(() => {
    if (assignedData && Array.isArray(assignedData)) {
      const ids = assignedData.flatMap((group) =>
        group.Modules.map((m) => m.Id)
      );

      setSelectedModules(ids);
    }
  }, [assignedData]);

  // ✅ toggle single module
  const handleCheckboxChange = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // ✅ select all in group
  const handleSelectAllForGroup = (group: IGroup) => {
    const groupIds = group.Modules.map((m) => m.Id);

    const allSelected = groupIds.every((id) =>
      selectedModules.includes(id)
    );

    setSelectedModules((prev) =>
      allSelected
        ? prev.filter((id) => !groupIds.includes(id))
        : [...prev, ...groupIds]
    );
  };

  // ✅ select all global
  const handleSelectAll = () => {
    const allIds = allModules.map((m) => m.Id);

    const allSelected = allIds.every((id) =>
      selectedModules.includes(id)
    );

    setSelectedModules(allSelected ? [] : allIds);
  };

  // ✅ submit
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
            <button onClick={onClose}>
              <X size={24} color="red" />
            </button>
          </div>

          {/* Global Select All */}
          {allModules.length > 0 && (
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded mb-4">
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

          {/* GROUPED UI */}
          {groupedModules.map((group) => (
            <div key={group.AppId} className="mb-6 border rounded-lg">

              {/* Group Header */}
              <div className="bg-blue-50 p-3 flex justify-between">
                <h3 className="font-semibold">{group.AppName}</h3>

                <input
                  type="checkbox"
                  checked={group.Modules.every((m) =>
                    selectedModules.includes(m.Id)
                  )}
                  onChange={() => handleSelectAllForGroup(group)}
                />
              </div>

              {/* Modules */}
              <div className="p-4 space-y-2">
                {group.Modules.map((mod) => (
                  <div
                    key={mod.Id}
                    className="flex justify-between border p-2 rounded"
                  >
                    <div>
                      <div className="font-medium">{mod.Name}</div>
                      <div className="text-xs text-gray-500">
                        {mod.Description}
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={selectedModules.includes(mod.Id)}
                      onChange={() => handleCheckboxChange(mod.Id)}
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
            />
          </div>

        </fieldset>
      </div>
    </div>
  );
};

export default AssignModuleForm;