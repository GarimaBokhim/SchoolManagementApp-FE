/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { useGetSubModuleByRoleId } from "@/app/SuperAdmin/navigation/subModules/hooks";
import MenuByRoleId from "./MenuByRoleId";
import { useUpdateAssignSubModules } from "../hooks";

interface Props {
  roleId: string;
  moduleId: string;
  activateAll?: boolean;
}

const SubModulesByRoleId = ({ roleId, moduleId }: Props) => {
  const editSubModule = useUpdateAssignSubModules();
  const { data, isLoading, refetch } = useGetSubModuleByRoleId(roleId);
  const [subModuleStatuses, setSubModuleStatuses] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setSubModuleStatuses((prev) => {
        const newStatuses = { ...prev };
        data.forEach((subMod) => {
          if (!(subMod.id in newStatuses)) {
            newStatuses[subMod.id] = subMod.isActive;
          }
        });
        return newStatuses;
      });
    }
  }, [data]);

  const handleToggle = async (subModuleId: string) => {
    const currentStatus = subModuleStatuses[subModuleId] ?? false;
    const newStatus = !currentStatus;
    setSubModuleStatuses((prev) => ({ ...prev, [subModuleId]: newStatus }));

    try {
      await editSubModule.mutateAsync({
        subModuleId,
        roleId,
        isActive: newStatus,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update submodule:", error);
      setSubModuleStatuses((prev) => ({
        ...prev,
        [subModuleId]: currentStatus,
      }));
    }
  };

  if (isLoading) return null;

  // Filter the role's submodules to only those belonging to this specific module
  const filteredSubModules = (data ?? []).filter(
    (subMod) => subMod.modulesId === moduleId
  );

  if (!filteredSubModules.length) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-base font-normal ml-2">
        No submodules found
      </p>
    );
  }

  return (
    <div className="ml-4 flex flex-wrap gap-4">
      {filteredSubModules.map((subMod) => (
        <div
          key={subMod.id}
          className="border dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-[#2a2a2a] hover:bg-gray-100 dark:hover:bg-[#303030] transition cursor-pointer w-60"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {subMod.name}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={subModuleStatuses[subMod.id] ?? subMod.isActive}
                onChange={() => handleToggle(subMod.id)}
              />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div className="absolute left-1 w-4 h-4 bg-white rounded-full shadow transform transition-all peer-checked:translate-x-5"></div>
            </label>
          </div>

          {/* Horizontal nested menus */}
          {(subModuleStatuses[subMod.id] ?? subMod.isActive) && (
            <div className="mt-2">
              <MenuByRoleId subModuleId={subMod.id} roleId={roleId} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubModulesByRoleId;
