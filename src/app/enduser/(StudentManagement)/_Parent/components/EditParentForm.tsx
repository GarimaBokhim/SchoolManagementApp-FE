"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IParent } from "../types/IParents";
import { useEditParent, useGetParentById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
type Props = {
  form: UseFormReturn<IParent>;
  onClose: () => void;
  ParentId: string;
};
const EditParentForm = ({ form, onClose, ParentId }: Props) => {
  const editParent = useEditParent();
  const { handleError, clearError } = useErrorHandler();
  const { data: ParentData } = useGetParentById(ParentId);
  const [ParentStatus, setParentStatus] = useState<number | null>(null);
  const handleClose = () => {
    form.reset();
  };
  useEffect(() => {
    if (ParentData) {
      form.reset({
        fullName: ParentData?.fullName ?? "",
        parentType: ParentData?.parentType ?? 0,
        email: ParentData?.email ?? "",
        phoneNumber: ParentData?.phoneNumber ?? "",
        occupation: ParentData?.occupation ?? "",
        address: ParentData?.address ?? "",
      });
      setParentStatus(ParentData.parentType);
    }
  }, [ParentData]);
  const onSubmit: SubmitHandler<IParent> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editParent.mutateAsync({
          id: ParentId,
          data: data,
        }),
        {
          loading: "Submitting Data",
          success: "Successfully Edited Income",
        }
      );
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
      >
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Update Parent
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500 "
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <InputElement
                label="Full Name"
                form={form}
                name="fullName"
                placeholder="Enter First Name"
                required
              />
              <InputElement
                label="Email"
                form={form}
                name="email"
                type="email"
                placeholder="Enter Email"
              />
              <InputElement
                label="Phone Number"
                form={form}
                name="phoneNumber"
                placeholder="Enter Phone Number"
              />
              <InputElement
                label="Address"
                form={form}
                name="address"
                placeholder="Enter Address"
              />
              <InputElement
                label="Occupation"
                form={form}
                name="occupation"
                placeholder="Enter the Occupation"
              />

              <AppCombobox
                label="Parent Status"
                name="parentType"
                dropdownPositionClass="absolute"
                value={ParentStatus}
                dropDownWidth="w-full"
                options={[
                  { id: 1, name: "Active" },
                  { id: 2, name: "Inactive" },
                ]}
                selected={
                  [
                    { id: 1, name: "Active" },
                    { id: 2, name: "Inactive" },
                  ].find((s) => s.id === ParentStatus) || null
                }
                onSelect={(option) => setParentStatus(option?.id ?? null)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={"Submit"} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditParentForm;
