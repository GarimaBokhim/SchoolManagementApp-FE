"use client";

import {  useState } from "react";
import { useForm } from "react-hook-form";
import { Filter, RotateCcw } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import toast, { Toaster } from "react-hot-toast";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { IAssetsReportItem } from "../types/IAssetReport";
import { useGetAllFiscalYear } from "@/app/admin/Setup/School/hooks";
import { useGetAssetsReportByFyId } from "../hooks";

type FilterForm = {
  fiscalYearId: string;
};

const AllAssetsReportByFiscalYear = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [params, setParams] = useState("");
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string | null>(
    null
  );

  const { handleError, clearError } = useErrorHandler();

  const form = useForm<FilterForm>({
    defaultValues: {
      fiscalYearId: "",
    },
  });

  const { data: allfiscalYears  } =useGetAllFiscalYear();

  const { data: report, refetch, isLoading,} = useGetAssetsReportByFyId(params);


  const onSubmit = async (data: FilterForm) => {
    clearError();

    try {
      if (!data.fiscalYearId) {
        Toast.error("Please select a fiscal year");
        return;
      }

      const query = `?fiscalYearId=${encodeURIComponent(
        data.fiscalYearId
      )}`;

      await toast.promise(
        (async () => {
          setParams(query);
          await refetch();
        })(),
        {
          loading: "Fetching report...",
          success: "Report loaded successfully",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  const onClearClick = () => {
    setParams("");
    setSelectedFiscalYear(null);
    form.reset();
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm">

          <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-semibold">
              Assets Report
            </h1>

            <ButtonElement
              type="button"
              text="Filter"
              icon={<Filter size={14} />}
              onClick={() => setOpenFilter(!openFilter)}
              className="!bg-emerald-600 hover:!bg-emerald-700"
            />
          </div>

          {openFilter && (
            <div className="bg-white dark:bg-[#2c2c2c] p-4 border-t border-gray-200">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col lg:flex-row gap-4 items-end"
              >
                <div className="flex-1 min-w-[240px]">
                <AppCombobox
                value={selectedFiscalYear}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Fiscal Year"
                name="fiscalYearId"
                form={form}
                options={allfiscalYears?.Items}
                selected={
                allfiscalYears?.Items?.find(
                (g) => g.FyName === selectedFiscalYear) || null }
                onSelect={(group) => {setSelectedFiscalYear(group ? group.FyName : null); }}
                getLabel={(g) => g?.FyName ?? ""}
                getValue={(g) => g?.Id ?? ""}
                />
                </div>

                <div className="flex gap-2">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700"
                  />

                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto border-t border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-[#80878c]">
                <tr className="text-left font-semibold">
                  <th className="px-4 py-3 text-center">S.N</th>
                  <th className="px-4 py-3 text-center">Contributor</th>
                  <th className="px-4 py-3 text-center">Fiscal Year</th>
                  <th className="px-4 py-3 text-center">Items</th>
                  <th className="px-4 py-3 text-center">Estimated Value</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      Loading report...
                    </td>
                  </tr>
                ) : report?.Items?.length ? (
                  report.Items.map(
                    (item: IAssetsReportItem, index: number) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-center">{index + 1}</td>
                        <td className="px-4 py-3 text-center">
                          {item.contributorName}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.fiscalYearName}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.totalItemsCount}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.totalEstimatedValue}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center italic">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllAssetsReportByFiscalYear;
