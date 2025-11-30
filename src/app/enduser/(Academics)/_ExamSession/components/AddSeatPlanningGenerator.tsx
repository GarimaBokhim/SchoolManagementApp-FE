"use client";
import React, { useState } from "react";
import { useGenerateSeatPlanning } from "../hooks";
import SeatPlanning from "./SeatPlanning";
import { ISeatPlanning, ISeatPlanningRequest } from "../types/IExamSession";
import { SubmitHandler, useForm } from "react-hook-form";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useGetAllClass } from "../../Class/hooks";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { X } from "lucide-react";

type Props = {
  examSessionId: string;
  onClose: () => void;
  schoolId: string;
};

const SeatPlanGeneratorPage = ({ examSessionId, onClose, schoolId }: Props) => {
  const [classIds, setClassIds] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [seatPlanData, setSeatPlanData] = useState<ISeatPlanning | null>(null);

  const { data: allClass } = useGetAllClass();
  const { handleError, clearError } = useErrorHandler();

  const form = useForm<ISeatPlanningRequest>({
    defaultValues: {
      examSessionId: examSessionId,
      classIds: [],
    },
  });

  const generateSeatPlanning = useGenerateSeatPlanning();

  const onSubmit: SubmitHandler<ISeatPlanningRequest> = async (data) => {
    clearError();
    try {
      const result = await generateSeatPlanning.mutateAsync(data);
      setSeatPlanData(result);
      setShowResult(true);
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  const handleAddClass = () => {
    setClassIds((prev) => [...prev, ""]);
  };

  const updateClassId = (index: number, id: string) => {
    const updated = [...classIds];
    updated[index] = id;
    setClassIds(updated);

    form.setValue(`classIds.${index}`, id, { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white  max-w-5xl p-10 rounded shadow relative">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Generate Seat Planing</h2>
          <button onClick={onClose} className="text-red-500">
            <X />
          </button>
        </div>
        {!showResult && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="border p-6 max-w-md mx-auto rounded shadow"
          >
            {classIds.map((id, index) => (
              <div key={id + index} className="my-3">
                <AppCombobox
                  dropDownWidth="w-full"
                  label="Class"
                  name={`classIds.${index}`}
                  form={form}
                  dropdownPositionClass="absolute"
                  value={classIds[index] ?? ""}
                  options={allClass?.Items ?? []}
                  selected={
                    allClass?.Items?.find(
                      (cls) => cls.id === classIds[index]
                    ) || null
                  }
                  onSelect={(selected) => {
                    updateClassId(index, selected?.id ?? "");
                  }}
                  getLabel={(item) => item?.name ?? ""}
                  getValue={(item) => item?.id ?? ""}
                />
              </div>
            ))}

            <ButtonElement
              type="button"
              onClick={handleAddClass}
              className="px-3 mt-4 py-1 bg-gray-700 text-white rounded"
              text="Add Class"
            />

            <ButtonElement
              type="submit"
              className="mt-4 w-full py-2 bg-blue-700 text-white rounded"
              text="Generate Seat Planning"
            />
          </form>
        )}
      </div>

      {showResult && seatPlanData && (
        <SeatPlanning
          data={seatPlanData}
          schoolId={schoolId}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
};

export default SeatPlanGeneratorPage;
