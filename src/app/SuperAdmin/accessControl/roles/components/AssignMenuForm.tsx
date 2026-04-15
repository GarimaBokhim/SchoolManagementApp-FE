"use client";
import { useGetMenuByRoleId } from "@/app/SuperAdmin/navigation/menu/hooks";
import { IMenu } from "@/app/SuperAdmin/navigation/menu/types/IMenu";
import { useEffect, useState } from "react";
import { useAssignMenu } from "../assignrole/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAssignMenu } from "../assignrole/types/IAssign";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { MouseEvent } from "react";
import { useGetSubModuleByRoleId } from "@/app/SuperAdmin/navigation/subModules/hooks";
import MenuList from "../assignrole/components/MenuList";
import { X } from "lucide-react";

interface Props {
  roleId: string;
  refetchRoles: () => void;
  visible: boolean;
  onClose: () => void;
}
const AssignMenuForm = ({ roleId, refetchRoles, visible, onClose }: Props) => {
  const { handleSubmit } = useForm<IAssignMenu>();
  const { data: subModuleData, isLoading } = useGetSubModuleByRoleId(roleId);
  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  const { data: assignedData, refetch } = useGetMenuByRoleId(roleId);

  useEffect(() => {
    if (assignedData) {
      const assignedMenu = assignedData.map((menu: IMenu) => menu.id);
      setSelectedMenu(assignedMenu);
    }
  }, [assignedData]);
  const assignMenu = useAssignMenu();

  const handleCheckboxChange = (menuId: string) => {
    setSelectedMenu((prevSelected) =>
      prevSelected.includes(menuId)
        ? prevSelected.filter((id) => id !== menuId)
        : [...prevSelected, menuId]
    );
  };

  const handleSelectAllChange = (allMenuIds: string[]) => {
    setSelectedMenu((prevSelected) => {
      const areAllSelected = allMenuIds.every((id) =>
        prevSelected.includes(id)
      );
      return areAllSelected
        ? prevSelected.filter((id) => !allMenuIds.includes(id)) // Unselect all
        : [...prevSelected, ...allMenuIds]; // Select all
    });
  };
  const onSubmit: SubmitHandler<IAssignMenu> = async () => {
    if (selectedMenu.length === 0) {
      console.log("No menu selected");
      return;
    }

    try {
      await assignMenu.mutateAsync({
        roleId,
        menusId: selectedMenu,
        isActive: true,
        isAssign: true,
      });
      refetch();
      refetchRoles();
    } catch (error) {
      console.log("Failed to assign menus", error);
    } finally {
      onClose();
    }
  };

  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "assign-menu-modal") onClose();
  };
  if (!visible) return null;

  return (
    <div
      id="assign-menu-modal"
      onClick={handleOnClose}
      className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2"
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <fieldset className="bg-white dark:bg-[#353535] rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-600">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Assign Menu
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
            {subModuleData && subModuleData.length > 0 ? (
              subModuleData.map((mod) => (
                <div
                  key={mod.id}
                  className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {mod.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <MenuList
                      subModuleId={mod.id}
                      selectedMenu={selectedMenu}
                      handleCheckboxChange={handleCheckboxChange}
                      handleSelectAllChange={handleSelectAllChange}
                    />
                  </div>
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
export default AssignMenuForm;