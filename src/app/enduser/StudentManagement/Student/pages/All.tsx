"use client";
import { useState } from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import AllStudentForm from "../components/AllStudentForm";
import { useForm } from "react-hook-form";
import { IFilterStudentByDate } from "../types/IStudents";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { usePermissions } from "@/context/auth/PermissionContext";
import AddStudent from "./Add";
const AllStudent = () => {
  const [Student, setShowStudent] = useState(false);
  const StudentForm = useForm<IFilterStudentByDate>();
  const { menuStatus } = usePermissions();
  const { canAdd } = useMenuPermissionData(menuStatus);
  // useHotkeys(
  //   "alt+shift+n",
  //   () => {
  //     setShowStudent(true);
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
              onClick={() => setShowStudent(true)}
              className="!text-xs font-bold !bg-teal-500"
            />
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="dark:bg-[#2a2b2e]  w-[98%]">
      <AllStudentForm form={StudentForm} />
      <AddStudent visible={Student} onClose={() => setShowStudent(false)} />
    </div>
  );
};
export default AllStudent;
