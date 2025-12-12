"use client";
import { useState, MouseEvent, useEffect } from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetAllClass } from "../../Class/hooks";
import { useGenerateSeatPlanning, useGetClassByExamSessionId } from "../hooks";
import { ISeatPlanningRequest } from "../types/IExamSession";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import toast from "react-hot-toast";

interface Props {
  examSessionId: string;
  visible: boolean;
  onClose: () => void;
}

const AssignClassToExamSession = ({
  examSessionId,
  visible,
  onClose,
}: Props) => {
  const form = useForm<ISeatPlanningRequest>({
    defaultValues: {
      examSessionId: examSessionId,
      classIds: [],
    },
  });

  const { data: classes, isLoading } = useGetAllClass();
  const generateSeatPlanning = useGenerateSeatPlanning();
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const { data: assignedData } = useGetClassByExamSessionId(examSessionId);
  const { handleError, clearError } = useErrorHandler();

  useEffect(() => {
    if (assignedData?.Items?.[0].classIds?.length) {
      setSelectedClassIds([...assignedData?.Items?.[0].classIds]);
      form.setValue("classIds", [...assignedData?.Items?.[0].classIds]);
    }
  }, [assignedData?.Items?.[0]?.classIds]);

  const toggleClass = (classId: string) => {
    setSelectedClassIds((prev) => {
      const updated = prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId];

      form.setValue("classIds", updated);
      return updated;
    });
  };

  const onSubmit: SubmitHandler<ISeatPlanningRequest> = async () => {
    clearError();
    if (selectedClassIds.length === 0) {
      console.log("No class selected");
      return;
    }

    try {
      await toast.promise(
        generateSeatPlanning.mutateAsync({
          examSessionId,
          classIds: selectedClassIds,
        }),
        {
          loading: "Assigning Classes...",
          success: "Successfully Assigned Classes",
        }
      );
    } catch (error) {
      console.log("Failed to assign classes", error);
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    } finally {
      onClose();
    }
  };

  const handleOnClose = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-bg") onClose();
  };

  if (!visible) return null;

  return (
    <div
      id="modal-bg"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
    >
      <div className="w-[16rem] bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold mb-3">Assign Classes</h1>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-60 overflow-y-auto">
            {classes?.Items && classes.Items.length > 0 ? (
              classes.Items.map((cls) => {
                return (
                  <label
                    key={cls.id}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    {cls.id && (
                      <input
                        type="checkbox"
                        checked={selectedClassIds.includes(String(cls.id))}
                        onChange={() => toggleClass(String(cls.id))}
                      />
                    )}

                    <span className="text-md font-medium">{cls.name}</span>
                  </label>
                );
              })
            ) : !isLoading ? (
              <p className="text-sm">No classes found</p>
            ) : (
              <p className="text-sm text-gray-500">Loading...</p>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <ButtonElement
              type="submit"
              customStyle="hover:bg-blue-700 transition-all"
              text="Submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignClassToExamSession;
