/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useGetPartiesDetails } from "../hooks/index";
import Pagination from "@/components/Pagination";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IFilterLedgerDetailsByDate,
  ILedgerStatementDetails,
} from "../types/ILedgerStatement";
import toast from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Filter, RotateCcw, X } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { useGetLedgerById } from "@/app/enduser/(Accountings)/Ledger/hooks";
import DateConverter from "@/components/DatePicker/DateConverter";

type Props = {
  ledgerId: string;
  visible: boolean;
  onClose: () => void;
};

const LedgerName = ({ ledgerId }: { ledgerId: string }) => {
  const { data } = useGetLedgerById(ledgerId);
  return <span>{data?.name ?? ledgerId}</span>;
};

const LedgerDetails = ({ ledgerId, visible, onClose }: Props) => {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}&partyId=${ledgerId}`;
  const [params, setParams] = useState<string | null>(null);

  const {
    data: ledgerDetails,
    refetch,
    isLoading,
  } = useGetPartiesDetails(query + (params || ""));

  const { data: ledger } = useGetLedgerById(ledgerId);

  const formRef = useRef<DateRangeFilterRef>(null);

  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    form.reset();
  };

  useEffect(() => {
    refetch();
  }, [paginationParams]);

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  const handleSubmit = useForm<IFilterLedgerDetailsByDate>({
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const form = useForm<IFilterLedgerDetailsByDate>();
  const { handleError, clearError } = useErrorHandler();

  const onSubmit: SubmitHandler<IFilterLedgerDetailsByDate> = async (
    formData
  ) => {
    clearError();
    const queryParams = [
      formData.startDate
        ? `startDate=${encodeURIComponent(formData.startDate)}`
        : null,
      formData.endDate
        ? `endDate=${encodeURIComponent(formData.endDate)}`
        : null,
    ]
      .filter(Boolean)
      .join("&");

    const fullQuery = queryParams ? `&${queryParams}` : "";

    await toast
      .promise(
        (async () => {
          setParams(fullQuery);
          await refetch();
          form.reset();
        })(),
        {
          loading: "Fetching data...",
          success: "Data fetched successfully!",
        }
      )
      .catch((error) => {
        const errorMsg = handleError(error);
        Toast.error(errorMsg);
      });
  };

  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);

  useEffect(() => {
    if (ledgerDetails?.Items) {
      const amount = ledgerDetails.Items.reduce(
        (acc, i) => acc + (i.creditAmount || 0),
        0
      );
      const debitAmount = ledgerDetails.Items.reduce(
        (acc, i) => acc + (i.debitAmount || 0),
        0
      );
      setTotalCredit(amount);
      setTotalDebit(debitAmount);
    }
  }, [ledgerDetails]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden w-[80%] h-[80%]">

        {/* Header */}
        <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
            {ledger?.name ?? "..."} &nbsp; Details
          </h1>
          <button
            type="button"
            onClick={() => onClose()}
            className="text-red-400 text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
          >
            <X strokeWidth={3} />
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6 bg-white dark:bg-[#2c2c2c] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap items-end gap-4 md:gap-6"
          >
            <DateRangeFilter
              ref={formRef}
              form={form}
              onSubmit={onSubmit}
              setParams={setParams}
            />
            <div className="flex gap-2 ml-auto">
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                <th className="px-4 py-3 text-left">Entry Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Voucher/Bill Number</th>
                <th className="px-4 py-3 text-left">Ledger</th>
                <th className="px-4 py-3 text-left">Credit</th>
                <th className="px-4 py-3 text-left">Debit</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    Loading Ledgers...
                  </td>
                </tr>
              ) : ledgerDetails?.Items && ledgerDetails?.Items.length > 0 ? (
                ledgerDetails.Items.map(
                  (Ledger: ILedgerStatementDetails, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        {Ledger.dateTime ? (
                          <DateConverter date={String(Ledger.dateTime)} />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-3 px-4">{Ledger.referenceNumber}</td>
                      <td className="py-3 px-4">{Ledger.billNumber}</td>
                      <td className="py-3 px-4">
                        {Ledger.affectedLedgerId ? (
                          <LedgerName ledgerId={Ledger.affectedLedgerId} />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-3 px-4">{Ledger.creditAmount ?? 0}</td>
                      <td className="py-3 px-4">{Ledger.debitAmount ?? 0}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No Ledgers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mr-4 mt-2 gap-6 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div>Total Credit : <span className="text-emerald-600">{totalCredit}</span></div>
            <div>Total Debit : <span className="text-red-500">{totalDebit}</span></div>
          </div>
        </div>

        {/* Pagination */}
        {ledgerDetails?.Items && ledgerDetails?.Items.length > 0 && (
          <div className="my-2">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: ledgerDetails?.PageIndex ?? 1,
                firstPage: ledgerDetails?.FirstPage ?? 1,
                lastPage: ledgerDetails?.LastPage ?? 1,
                nextPage: ledgerDetails?.NextPage ?? 1,
                previousPage: ledgerDetails?.PreviousPage ?? 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LedgerDetails;