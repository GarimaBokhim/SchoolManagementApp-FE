"use client";
import { useState, MouseEvent } from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetAllClass } from "../../Class/hooks";
import { useGenerateSeatPlanning } from "../hooks";
import { ISeatPlanning, ISeatPlanningRequest } from "../types/IExamSession";

interface Props {
  examSessionId: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: (data: ISeatPlanning) => void;
}

const AssignClassToExamSession = ({
  examSessionId,
  visible,
  onClose,
  onSuccess,
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
  // useEffect(() => {
  //   if (classes?.assignedClasses) {
  //     const alreadyAssigned = classes.assignedClasses.map((c) => c.classId);
  //     setSelectedClassIds(alreadyAssigned);
  //   }
  // }, [classes]);

  const toggleClass = (classId: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const onSubmit: SubmitHandler<ISeatPlanningRequest> = async () => {
    if (selectedClassIds.length === 0) {
      console.log("No class selected");
      return;
    }

    try {
      const result = await generateSeatPlanning.mutateAsync({
        examSessionId,
        classIds: selectedClassIds,
      });
      onSuccess(result);
    } catch (error) {
      console.log("Failed to assign classes", error);
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
                    <input
                      type="checkbox"
                      onChange={() => toggleClass(cls.id || "")}
                    />
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
