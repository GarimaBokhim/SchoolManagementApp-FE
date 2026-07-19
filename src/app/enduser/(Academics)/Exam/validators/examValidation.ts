import { IExam } from "../types/IExams";

export type ValidationError = {
  field: string;
  message: string;
};

export function validateExamSubjects(
  subjects: IExam["examSubjects"]
): ValidationError[] {
  const errors: ValidationError[] = [];

  subjects?.forEach((subject, index) => {
    const fields = [
      {
        value: Number(subject.fullMarksTh),
        field: `examSubjects.${index}.fullMarksTh`,
        label: "Theory Full Marks",
      },
      {
        value: Number(subject.passMarksTh),
        field: `examSubjects.${index}.passMarksTh`,
        label: "Theory Pass Marks",
      },
      {
        value: Number(subject.fullMarksPr),
        field: `examSubjects.${index}.fullMarksPr`,
        label: "Practical Full Marks",
      },
      {
        value: Number(subject.passMarksPr),
        field: `examSubjects.${index}.passMarksPr`,
        label: "Practical Pass Marks",
      },
    ];

    fields.forEach(({ value, field, label }) => {
      if (value > 100) {
        errors.push({
          field,
          message: `${label} cannot exceed 100.`,
        });
      }
    });

    if (
      Number(subject.passMarksTh) >
      Number(subject.fullMarksTh)
    ) {
      errors.push({
        field: `examSubjects.${index}.passMarksTh`,
        message: "Theory Pass Marks cannot exceed Theory Full Marks.",
      });
    }

    if (
      Number(subject.passMarksPr) >
      Number(subject.fullMarksPr)
    ) {
      errors.push({
        field: `examSubjects.${index}.passMarksPr`,
        message: "Practical Pass Marks cannot exceed Practical Full Marks.",
      });
    }
  });

  return errors;
}