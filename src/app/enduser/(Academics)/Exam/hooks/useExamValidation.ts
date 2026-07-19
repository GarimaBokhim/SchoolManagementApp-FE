import { useEffect, useRef } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { IExam } from "../types/IExams";
import { Toast } from "@/components/Toast/toast";

type ExamSubject = NonNullable<IExam["examSubjects"]>[number];

export const useExamValidation = (
  form: UseFormReturn<IExam>
) => {
  const subjects = useWatch({
    control: form.control,
    name: "examSubjects",
  });

  const previousToast = useRef<string>("");

  useEffect(() => {
    if (!subjects) return;

    subjects.forEach((subject, index) => {
      validateSubject(subject, index);
    });
  }, [subjects]);

  const validateSubject = (
    subject: ExamSubject,
    index: number
  ) => {
    const validations = [
      {
        field: "fullMarksTh",
        value: Number(subject.fullMarksTh),
        label: "Theory Full Marks",
      },
      {
        field: "passMarksTh",
        value: Number(subject.passMarksTh),
        label: "Theory Pass Marks",
      },
      {
        field: "fullMarksPr",
        value: Number(subject.fullMarksPr),
        label: "Practical Full Marks",
      },
      {
        field: "passMarksPr",
        value: Number(subject.passMarksPr),
        label: "Practical Pass Marks",
      },
    ] as const;

    validations.forEach(({ field, value, label }) => {
      const path = `examSubjects.${index}.${field}` as const;

      if (value > 100) {
        form.setError(path, {
          type: "manual",
          message: `${label} cannot exceed 100`,
        });
      } else {
        form.clearErrors(path);
      }
    });

    validatePassMarks(
      index,
      "passMarksTh",
      Number(subject.passMarksTh),
      Number(subject.fullMarksTh),
      "Theory"
    );

    validatePassMarks(
      index,
      "passMarksPr",
      Number(subject.passMarksPr),
      Number(subject.fullMarksPr),
      "Practical"
    );
  };

  const validatePassMarks = (
    index: number,
    field: "passMarksTh" | "passMarksPr",
    pass: number,
    full: number,
    type: string
  ) => {
    const path = `examSubjects.${index}.${field}` as const;

    if (pass > full) {
      form.setError(path, {
        type: "manual",
        message: `${type} Pass Marks cannot exceed ${type} Full Marks`,
      });

      if (previousToast.current !== path) {
        Toast.error(`${type} Pass Marks cannot exceed Full Marks`);
        previousToast.current = path;
      }
    } else {
      form.clearErrors(path);

      if (previousToast.current === path) {
        previousToast.current = "";
      }
    }
  };
};