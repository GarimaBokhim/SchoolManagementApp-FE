/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useImperativeHandle, useCallback, useState } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { adToBs } from "@sbmdkl/nepali-date-converter";
// import { useType } from "@/context/auth/ReportContext";
import { ButtonElement } from "../Buttons/ButtonElement";
import { InputElement } from "../Input/InputElement";
// import { useGetFiscalYearStartedDate } from "@/modules/admin/Settings/hooks";

export type DateRangeFilterRef = {
  handleClear: () => void;
};

type DateRangeFilterProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  setParams: (param: string) => void;
  startDateKey?: Path<T>;
  endDateKey?: Path<T>;
};

function DateRangeFilterInner<T extends FieldValues>(
  {
    form,
    onSubmit,
    setParams,
    startDateKey = "startDate" as Path<T>,
    endDateKey = "endDate" as Path<T>,
  }: DateRangeFilterProps<T>,
  ref: React.Ref<DateRangeFilterRef>
) {
  const [isRunning, setIsRunning] = useState(true);
  const [activeRange, setActiveRange] = useState<number | null>(null);
  const handleClear = useCallback(() => {
    form.reset();
    setParams("");
    setActiveRange(null); // clear active button
  }, [form, setParams]);

  useImperativeHandle(ref, () => ({ handleClear }));

  const setDateRange = async (startOffset: number, endOffset: number = 0) => {
    setActiveRange(startOffset); // highlight the selected button
    setParams("");
    const today = new Date();
    const start = new Date();
    const end = new Date();
    start.setDate(today.getDate() - startOffset);
    end.setDate(today.getDate() - endOffset);

    form.setValue(
      startDateKey,
      adToBs(start.toISOString().split("T")[0]) as any
    );
    form.setValue(endDateKey, adToBs(end.toISOString().split("T")[0]) as any);
    await form.handleSubmit(onSubmit)();
  };

  return (
    <div className="flex flex-wrap items-end gap-4 ">
      {isRunning ? (
        <div className="flex flex-wrap md:flex-row md:items-end gap-2 w-full">
          <ButtonElement
            className={`sm:w-[7rem] md:w-[6.5rem] text-sm transition-all duration-300 ease-in-out ${
              activeRange === 1
                ? "bg-teal-800 text-white border border-teal-500 shadow-md scale-105"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
            onClick={() => setDateRange(1)}
            type="button"
            text="Yesterday"
          />
          <ButtonElement
            className={`sm:w-[7rem] md:w-[6.5rem] text-sm transition-all duration-200 ease-in-out ${
              activeRange === 7
                ? "bg-teal-800 text-white border border-teal-500 shadow-md scale-105"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
            onClick={() => setDateRange(7)}
            type="button"
            text="7 Days"
          />
          <ButtonElement
            className={`sm:w-[7rem] md:w-[6.5rem] text-sm transition-all duration-200 ease-in-out ${
              activeRange === 30
                ? "bg-teal-800 text-white border border-teal-500 shadow-md scale-105"
                : "bg-teal-600 text-white hover:bg-teal-700 "
            }`}
            onClick={() => setDateRange(30)}
            type="button"
            text="This Month"
          />
          <ButtonElement
            className={`sm:w-[7rem] md:w-[6.5rem] text-sm transition-all duration-200 ease-in-out ${
              activeRange === 365
                ? "bg-teal-800 text-white border border-teal-500 shadow-md scale-105"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
            onClick={() => setDateRange(365)}
            type="button"
            text="This Year"
          />
          <ButtonElement
            className={`sm:w-[7rem] md:w-[6.5rem] text-sm transition-all duration-200 ease-in-out ${
              activeRange === 999
                ? "bg-teal-800 text-white border border-teal-500 shadow-md scale-105"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
            type="submit"
            text="Submit"
          />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-end gap-2 w-full">
          <div className="w-full">
            <InputElement
              isReport
              layout="column"
              label="Start Date"
              form={form}
              inputType="date"
              name={startDateKey}
              placeholder="Start Date"
            />
          </div>

          <div className="w-full">
            <InputElement
              isReport
              layout="column"
              label="End Date"
              form={form}
              inputType="date"
              name={endDateKey}
              placeholder="End Date"
            />
          </div>

          <div className="w-full md:w-auto">
            <ButtonElement
              className=" md:w-[5rem]"
              type="submit"
              text="Submit"
            />
          </div>
          <div className="w-full md:w-auto">
            <ButtonElement
              className="md:w-[5rem]"
              type="button"
              text="Clear"
              onClick={handleClear}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const DateRangeFilter = forwardRef(DateRangeFilterInner) as <
  T extends FieldValues
>(
  props: DateRangeFilterProps<T> & { ref?: React.Ref<DateRangeFilterRef> }
) => ReturnType<typeof DateRangeFilterInner>;

export default DateRangeFilter;
