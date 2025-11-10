"use client";
import { useState } from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import AllParentForm from "../components/AllParentForm";
import { useForm } from "react-hook-form";
import { IFilterParentByDate } from "../types/IParents";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { usePermissions } from "@/context/auth/PermissionContext";
import AddParent from "./Add";
const AllParent = () => {
  const [Parent, setShowParent] = useState(false);
  const ParentForm = useForm<IFilterParentByDate>();
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  // useHotkeys(
  //   "alt+shift+n",
  //   () => {
  //     setShowParent(true);
  //   },
  //   {
  //     enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
  //     preventDefault: true,
  //   }
  // );
  const buttonElement = () => {
    return (
      <div>
        <div>
          {canAdd && (
            <ButtonElement
              type="button"
              text="Add New"
              onClick={() => setShowParent(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="dark:bg-[#2a2b2e]  w-[98%]">
      <AllParentForm form={ParentForm} />
      <AddParent visible={Parent} onClose={() => setShowParent(false)} />
    </div>
  );
};
export default AllParent;
