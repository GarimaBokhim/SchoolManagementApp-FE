"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useState } from "react";
import { X } from "lucide-react";
import { IParent } from "../types/IParents";
import { useAddParent } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
type Props = {
  form: UseFormReturn<IParent>;
  onClose: () => void;
};
const AddParentForm = ({ form, onClose }: Props) => {
  const addParent = useAddParent();
  const { handleError, clearError } = useErrorHandler();
  const [ParentStatus, setParentStatus] = useState<number | null>(null);
  const handleClose = () => {
    form.reset();
  };
  const onSubmit: SubmitHandler<IParent> = async (data) => {
    clearError();
    try {
      await toast.promise(addParent.mutateAsync(data), {
        loading: "Adding Parent...",
        success: "Successfully added Parent",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Parent
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

export default AddParentForm;
