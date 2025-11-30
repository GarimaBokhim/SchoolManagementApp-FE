import { SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { X } from "lucide-react";
import { useAddExamSession } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { IExamSession } from "../types/IExamSession";

type Props = {
  form: UseFormReturn<IExamSession>;
  onClose: () => void;
};

const AddExamSessionForm = ({ form, onClose }: Props) => {
  const addExamSession = useAddExamSession();
  const { handleError, clearError } = useErrorHandler();

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "examHallDTOs",
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };
  const onSubmit: SubmitHandler<IExamSession> = async (data) => {
    clearError();
    try {
      await toast.promise(addExamSession.mutateAsync(data), {
        loading: "Adding Exam Session...",
        success: "Successfully added Exam Session",
      });

      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center w-full h-full">
      <div className="w-full h-full bg-white dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
        <fieldset>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Add Student Attendance
            </h1>

            <button
              type="button"
              onClick={handleClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputElement
                label="Exam Session Name"
                form={form}
                name="name"
                type="string"
                placeholder="Enter Exam Session Name"
              />
              <InputElement
                label="Exam Date"
                form={form}
                name="examDate"
                inputType="date"
                placeholder="Enter Date"
              />
            </div>
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-3">Hall</h2>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md mb-4 relative"
                >
                  <InputElement
                    label="Hall Name"
                    form={form}
                    name={`examHallDTOs.${index}.hallName`}
                    type="string"
                    placeholder="Enter Hall Name"
                  />
                  <InputElement
                    label="Capacity"
                    form={form}
                    name={`examHallDTOs.${index}.capacity`}
                    type="number"
                    placeholder="Enter Capacity"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                    className="absolute right-2 top-2 text-red-400 hover:text-red-600"
                  >
                    <X />
                  </button>
                </div>
              ))}
              <ButtonElement
                type="button"
                text="Add Hall"
                onClick={() =>
                  append({
                    hallName: "",
                    capacity: 0,
                  })
                }
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text="Submit" />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddExamSessionForm;
