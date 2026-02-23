/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useGetAllSubjects } from "@/app/enduser/(Academics)/Subject/hooks";
import { useAssignClass } from "../hooks";
import { IAssignClass } from "../types/IAcademicTeam";
import { IClass } from "@/app/enduser/(Academics)/Class/types/IClass";
import { ISubject } from "@/app/enduser/(Academics)/Subject/types/ISubjects";

interface Props {
  teacherId: string;
  visible: boolean;
  onClose: () => void;
}

const AssignClass = ({ teacherId, visible, onClose }: Props) => {
  const { handleSubmit } = useForm<IAssignClass>();

  const { data: allClass, isLoading: classLoading } = useGetAllClass();
  const { data: allSubject, isLoading: subjectLoading } = useGetAllSubjects();

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const assignClass = useAssignClass();
  // const unassignClass = useUnassignClass();

  const toggleClass = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };
  const filteredSubjects =
    allSubject?.Items?.filter((sub: ISubject) =>
      selectedClasses.includes(sub.classId)
    ) || [];

  useEffect(() => {
    setSelectedSubjects((prev) =>
      prev.filter((id) =>
        filteredSubjects.some((sub) => sub.Id === id)
      )
    );
  }, [selectedClasses]);

  const onSubmit: SubmitHandler<IAssignClass> = async () => {
    if (!selectedClasses.length) {
      console.log("Please select at least one class");
      return;
    }

    if (!selectedSubjects.length) {
      console.log("Please select at least one subject");
      return;
    }

    try {
      await assignClass.mutateAsync({
        academicTeamId: teacherId,
        classIds: selectedClasses,
        subjectIds: selectedSubjects,
      });

      onClose();
    } catch (error) {
      console.error("Failed to assign class & subject", error);
    }
  };

  if (!visible) return null;

  return (
    <div className=" absolute bg-white dark:bg-[#3a3a3a] p-4 rounded-xl shadow-md border border-gray-200 w-[20rem] md:w-[12rem] sm:w-[16rem] max-h-[30vh] overflow-y-auto z-40 ml-[-20%] " >
      <h1 className="text-md font-semibold mb-3">
        Assign Class & Subject
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h2 className="font-semibold mb-1">Classes</h2>

          {classLoading && <p>Loading classes...</p>}

          <div className=" relative space-y-2">
                {allClass?.Items?.map((cls) => {
                  const subjectsForClass = filteredSubjects.filter(
                    (sub) => sub.classId === cls.id
                  );

                  return (
                    <div key={cls.id}>
                      <label
                        className="flex items-center gap-2   rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedClasses.includes(cls.id as string)}
                          onChange={() => toggleClass(cls.id as string)}
                        />
                        <span className="font-medium">{cls.name}</span>
                      </label>

                      {selectedClasses.includes(cls.id as string) && subjectsForClass.length > 0 && (
                        <div className="ml-6 mt-1 space-y-1">
                          {subjectsForClass.map((sub) => (
                            <label
                              key={sub.Id}
                              className="flex items-center   rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSubjects.includes(sub.Id!)}
                                onChange={() => toggleSubject(sub.Id!)}
                              />
                              <span>{sub.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

        </div>

        <div className="flex justify-center pt-2">
          <ButtonElement
            type="submit"
            text="Assign"
            className="hover:bg-teal-700 transition-all"
          />
        </div>
      </form>
    </div>
  );
};

export default AssignClass;
