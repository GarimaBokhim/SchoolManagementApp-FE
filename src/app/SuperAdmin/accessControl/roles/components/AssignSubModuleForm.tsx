"use client";
import { useEffect, useState, MouseEvent } from "react";
import { useGetSubModuleByRoleId } from "@/app/SuperAdmin/navigation/subModules/hooks";
import { ISubModules } from "@/app/SuperAdmin/navigation/subModules/types/ISubModules";
import { useAssignSubModule } from "../assignrole/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAssignSubModule } from "../assignrole/types/IAssign";
import { useGetModuleByRoleId } from "@/app/SuperAdmin/navigation/modules/hooks";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import SubModuleList from "../assignrole/components/SubModuleList";
import { X } from "lucide-react";

interface Props {
  roleId: string;
  refetchRoles: () => void;
  visible: boolean;
  onClose: () => void;
}

const AssignSubModuleForm = ({
  roleId,
  refetchRoles,
  visible,
  onClose,
}: Props) => {
  const { handleSubmit } = useForm<IAssignSubModule>();
  const [selectedSubModules, setSelectedSubModules] = useState<string[]>([]);
  const { data: assignedSubModule, refetch } = useGetSubModuleByRoleId(roleId);
  const { data: ModuleData, isLoading } = useGetModuleByRoleId(roleId);
  const assignSubModule = useAssignSubModule();

  useEffect(() => {
    if (assignedSubModule) {
      const assignedSubModuleIds = assignedSubModule.map(
        (subModule: ISubModules) => subModule.id
      );
      setSelectedSubModules(assignedSubModuleIds);
    }
  }, [assignedSubModule]);

  const handleCheckboxChange = (subModuleId: string) => {
    setSelectedSubModules((prev) =>
      prev.includes(subModuleId)
        ? prev.filter((id) => id !== subModuleId)
        : [...prev, subModuleId]
    );
  };

  const handleSelectAllChange = (allSubModIds: string[]) => {
    setSelectedSubModules((prev) => {
      const allSelected = allSubModIds.every((id) => prev.includes(id));
      return allSelected
        ? prev.filter((id) => !allSubModIds.includes(id))
        : [...prev, ...allSubModIds];
    });
  };

  const onSubmit: SubmitHandler<IAssignSubModule> = async () => {
    if (!selectedSubModules.length)
      return console.log("No subModules selected");
    try {
      await assignSubModule.mutateAsync({
        roleId,
        subModulesId: selectedSubModules,
        isActive: true,
        isAssign: true,
      });
      refetch();
      refetchRoles();
    } catch (error) {
      console.error("Failed to assign subModules", error);
    } finally {
      onClose();
    }
  };

  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "assign-submodule-modal") onClose();
  };

  if (!visible) return null;

  return (
    <div
      id="assign-submodule-modal"
      onClick={handleOnClose}
      className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2"
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <fieldset className="bg-white dark:bg-[#353535] rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-600">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Assign SubModules
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} strokeWidth={3} color="red" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {ModuleData && ModuleData.length > 0 ? (
              // New schema: ModuleData is IModulesByRoleId[] — grouped by AppName
              ModuleData.map((appGroup) => (
                <div key={appGroup.AppName} className="space-y-3">
                  {/* App group label */}
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-blue-100 dark:border-blue-900 pb-1">
                    {appGroup.AppName}
                  </h2>

                  {appGroup.Modules.map((mod) => (
                    <div
                      key={mod.Id}
                      className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                          {mod.Name}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <SubModuleList
                          moduleId={mod.Id}
                          selectedSubModules={selectedSubModules}
                          handleCheckboxChange={handleCheckboxChange}
                          handleSelectAllChange={handleSelectAllChange}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : !isLoading ? (
              <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
                No modules found
              </p>
            ) : (
              <p className="text-gray-400 dark:text-gray-500">Loading modules...</p>
            )}
            
            <div className="flex justify-center mt-4">
              <ButtonElement
                type="submit"
                className="hover:bg-teal-700 transition-all"
                text="Submit"
              />
            </div>
          </form>
          
        </fieldset>
      </div>
    </div>
  );
};

export default AssignSubModuleForm;