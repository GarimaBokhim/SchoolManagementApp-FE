/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState, MouseEvent } from "react";
import { useGetModuleByRoleId } from "@/app/SuperAdmin/navigation/modules/hooks";
import { useUpdateAssignModules } from "../hooks";
import SubModulesByRoleId from "./SubModulesByRoleId";
import { X } from "lucide-react";

interface Props {
  roleId: string;
  visible: boolean;
  onClose: () => void;
}

const ModuleByRoleId = ({ roleId, visible, onClose }: Props) => {
  const editModule = useUpdateAssignModules();
  const { data, isLoading, refetch } = useGetModuleByRoleId(roleId);
  const [moduleStatuses, setModuleStatuses] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setModuleStatuses((prev) => {
        const newStatuses = { ...prev };
        data.forEach((mod) => {
          if (!(mod.Id in newStatuses)) {
            newStatuses[mod.Id] = mod.IsActive;
          }
        });
        return newStatuses;
      });
    }
  }, [data]);

  const handleToggle = async (moduleId: string) => {
    setModuleStatuses((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
    try {
      await editModule.mutateAsync({
        moduleId,
        roleId,
        isActive: !moduleStatuses[moduleId],
      });
      refetch();
    } catch (error) {
      console.error("Failed to update module:", error);
      setModuleStatuses((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
    }
  };

  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "module-modal") onClose();
  };

  if (!visible) return null;

  return (
    <div
      id="module-modal"
      onClick={handleOnClose}
      className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2"
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <fieldset className="bg-white dark:bg-[#353535] rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-600">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Modules
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} strokeWidth={3} color="red" />
            </button>
          </div>

          {isLoading && (
            <p className="text-gray-400 dark:text-gray-500 text-center py-4">
              Loading modules...
            </p>
          )}

          {data && data.length > 0 ? (
            <div className="space-y-6">
              {data.map((mod) => (
                <div key={mod.Id} className="flex flex-col w-full">
                  <div className="flex items-center space-x-5 mb-3 border-b pb-2 dark:border-gray-600">
                    <span className="font-medium text-gray-700 dark:text-gray-200 text-lg">
                      {mod.Name}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={moduleStatuses[mod.Id]}
                        onChange={() => handleToggle(mod.Id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                      <div className="absolute left-1 w-4 h-4 bg-white rounded-full shadow transform transition-all peer-checked:translate-x-5"></div>
                    </label>
                  </div>
                  {moduleStatuses[mod.Id] && (
                    <div className="flex flex-wrap gap-3">
                      <SubModulesByRoleId
                        roleId={roleId}
                        moduleId={mod.Id}
                        activateAll={moduleStatuses[mod.Id]}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : !isLoading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No modules found
            </p>
          ) : null}
          
        </fieldset>
      </div>
    </div>
  );
};

export default ModuleByRoleId;