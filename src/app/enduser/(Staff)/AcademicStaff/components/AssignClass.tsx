import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useAssignClass } from "../hooks";
import { IAssignClass } from "../types/IAcademicTeam";
import { IClass } from "@/app/enduser/(Academics)/Class/types/IClass";

interface Props {
  teacherId: string;
  visible: boolean;
  onClose: () => void;
}

const AssignClass = ({ teacherId, visible, onClose }: Props) => {
  const { handleSubmit } = useForm<IAssignClass>();
  const { data: allClass, isLoading } = useGetAllClass();

  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const assignClass = useAssignClass();

  const onSubmit: SubmitHandler<IAssignClass> = async () => {
    if (!selectedClass) {
      console.log("No class selected");
      return;
    }

    try {
      await assignClass.mutateAsync({
        academicTeamId: teacherId,
        classesId: selectedClass,
      });
      onClose();
    } catch (error) {
      console.log("Failed to assign class", error);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="
        absolute bg-white dark:bg-[#3a3a3a] p-4 rounded-xl shadow-md border border-gray-200
        w-[20rem] md:w-[12rem] sm:w-[16rem] max-h-[30vh] overflow-y-auto z-40
      "
    >
      <h1 className="text-md font-semibold mb-2">Assign Class</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-2">
          {isLoading && <p>Loading...</p>}

          {allClass?.Items && allClass?.Items?.length > 0 ? (
            allClass?.Items.map((cls: IClass) => (
              <label
                key={cls.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="selectedClass"
                  value={cls.id}
                  checked={selectedClass === cls.id}
                  onChange={() => setSelectedClass(cls?.id || "")}
                />
                <span>{cls.name}</span>
              </label>
            ))
          ) : (
            <p>No classes found</p>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <ButtonElement
            type="submit"
            className="hover:bg-teal-700 transition-all"
            text={"Submit"}
          />
        </div>
      </form>
    </div>
  );
};

export default AssignClass;
