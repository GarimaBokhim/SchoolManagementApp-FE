"use client";
import { useEffect, useRef, useState } from "react";
import {
  IJournal,
  IFilterJournalByDate,
  AddJournalEntryDetail,
} from "../types/IJournal";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import React from "react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Edit, Filter, Plus, RotateCcw, Trash } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import {
  useFilterJournalByDate,
  useGetAllJournals,
  useRemoveJournal,
} from "../hooks";
import AddJournal from "../pages/Add";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { usePermissions } from "@/context/auth/PermissionContext";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { EditButton } from "@/components/Buttons/EditButton";
import EditJournal from "../pages/Edit";
import { useGetAllLedgers } from "../../Ledger/hooks";

const AllJournalForm = () => {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 9,
    pageIndex: 1,
    isPagination: true,
  });

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  const [addModal, setAddModal] = useState(false);
  const { menuStatus } = usePermissions();
  const [params, setParams] = useState("");
  const { data: allLedger } = useGetAllLedgers();
  const { data: allJournal } = useGetAllJournals();
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);
  const form = useForm<IFilterJournalByDate>({
    defaultValues: {
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  const fullQuery = query + (params || "");
  const [selectedId, setSelectedId] = useState<string>("");
  const [showJournal, setShowJournal] = useState<boolean>(false);
  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowJournal(true);
          setSelectedId(id);
        }}
        className="!text-xs font-bold !bg-teal-500"
      />
    );
  };
  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });

  const { data: filteredJournal, refetch } = useFilterJournalByDate(fullQuery);

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const { handleError, clearError } = useErrorHandler();
  const [openFilter, setOpenFilter] = useState(false);

  const onSubmit: SubmitHandler<IFilterJournalByDate> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        formData.description
          ? `description=${encodeURIComponent(formData.description)}`
          : null,
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

      await toast.promise(
        (async () => {
          setParams(fullQuery);
          await refetch();
        })(),
        {
          loading: "Fetching data...",
          success: "Data fetched successfully!",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
      console.error("Error during form submission:", error);
    }
  };
  const deleteJournal = useRemoveJournal();
  const handleDelete = async (id: string) => {
    try {
      await deleteJournal.mutateAsync(id);
      toast.success("User deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting user.");
    }
  };
  const sortedJournals = allJournal?.Items?.slice().sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).getTime()
  );
  const refForInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refForInput.current?.focus();
  }, []);

  const formRef = useRef<DateRangeFilterRef>(null);

  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    form.reset();
  };

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center ">
            <h1 className=" text-xl font-semibold ">All Journals</h1>

            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />

              {canAdd && (
                <ButtonElement
                  icon={<Plus size={24} />}
                  type="button"
                  text="Add New Journal"
                  onClick={() => setAddModal(true)}
                  className="!text-md !font-bold"
                />
              )}
            </div>
          </div>

          {openFilter && (
            <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
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
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className=" text-sm sm:text-base">
                  <th className="p-2 border border-gray-300">S.N</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {"Date"}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {"R.f"}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {"Particular"}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {"Debit Amount"}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2">
                    {"Credit Amount"}
                  </th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 hide-on-print">
                    {"Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedJournals?.map((item: IJournal, index: number) => (
                  <React.Fragment key={item.id}>
                    {item.journalEntries?.length ?? 0 > 0 ? (
                      item.journalEntries?.map(
                        (
                          detail: AddJournalEntryDetail,
                          detailIndex: number
                        ) => (
                          <tr
                            key={`${item.id}-detail-${detailIndex}`}
                            className="text-center dark:text-white  dark:bg-[#27272a] text-sm"
                          >
                            {detailIndex === 0 && (
                              <td
                                className="border px-4 py-2"
                                rowSpan={item.journalEntries!.length}
                              >
                                <td className="p-2 sm:p-3 ">
                                  {(paginationParams.pageIndex - 1) *
                                    paginationParams.pageSize +
                                    index +
                                    1}
                                </td>
                              </td>
                            )}

                            {detailIndex === 0 ? (
                              <>
                                <td className="border px-4 py-2">
                                  {`${item.transactionDate}`}
                                </td>
                                <td className="border px-4 py-2">
                                  {item.referenceNumber}
                                </td>
                              </>
                            ) : (
                              <>
                                <td></td>
                                <td className="border"></td>
                              </>
                            )}

                            <td
                              className={`px-4 py-2 ${
                                (detailIndex + 1) % 2 === 0
                                  ? "border-b border-gray-300"
                                  : ""
                              }`}
                            >
                              <div>
                                {detail.creditAmount ? (
                                  <>
                                    To{" "}
                                    <span className=" ">
                                      {
                                        allLedger?.Items?.find(
                                          (i) => i.id === detail.ledgerId
                                        )?.name
                                      }
                                    </span>
                                    &nbsp;A/C
                                  </>
                                ) : (
                                  <>
                                    <span className=" ">
                                      {
                                        allLedger?.Items?.find(
                                          (i) => i.id === detail.ledgerId
                                        )?.name
                                      }
                                    </span>
                                    &nbsp;A/C
                                  </>
                                )}
                              </div>

                              {(item.journalEntries!.length === 1 ||
                                detailIndex ===
                                  item.journalEntries!.length - 1) &&
                                item.description && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    ({item.description})
                                  </div>
                                )}
                            </td>

                            <td className="border px-4 py-2">
                              {detail.debitAmount}
                            </td>
                            <td className="border px-4 py-2">
                              {detail.creditAmount}
                            </td>

                            {detailIndex === 0 && (
                              <td
                                className="border px-4 py-2"
                                rowSpan={item.journalEntries!.length}
                              >
                                <div className="flex space-x-2">
                                  {canDelete && (
                                    <DeleteButton
                                      onConfirm={() =>
                                        handleDelete(item.id as string)
                                      }
                                      headerText={<Trash />}
                                      content="Are you sure you want to delete this Journal?"
                                    />
                                  )}
                                  {canEdit && (
                                    <EditButton
                                      button={buttonElement(item.id ?? "")}
                                    />
                                  )}
                                  {selectedId && selectedId !== "" && (
                                    <EditJournal
                                      visible={showJournal}
                                      onClose={() => setShowJournal(false)}
                                      journalId={selectedId}
                                    />
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        )
                      )
                    ) : (
                      <tr key={item.id} className="text-center text-sm">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                          {item.transactionDate}
                        </td>
                        <td className="border px-4 py-2">
                          <div className="flex space-x-2">
                            {canDelete && (
                              <DeleteButton
                                onConfirm={() =>
                                  handleDelete(item.id as string)
                                }
                                headerText={<Trash />}
                                content="Are you sure you want to delete this Journal?"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>

              <tfoot>
                <tr className=" font-semibold text-sm">
                  <td className="border px-4 py-2 text-right" colSpan={1}>
                    {"Total Balance"}:
                  </td>

                  <td className="border px-4 py-2 text-right" colSpan={5}>
                    {allJournal?.Items.flatMap(
                      (journal) => journal.journalEntries ?? []
                    ).reduce(
                      (sum, detail) => sum + (detail?.debitAmount ?? 0),
                      0
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <AddJournal visible={addModal} onClose={() => setAddModal(false)} />
          {filteredJournal?.Items && filteredJournal?.Items.length > 0 && (
            <div className="my-2">
              <Pagination
                form={handleSubmit}
                pagination={{
                  currentPage: filteredJournal?.PageIndex ?? 1,
                  firstPage: filteredJournal?.FirstPage ?? 1,
                  lastPage: filteredJournal?.LastPage ?? 1,
                  nextPage: filteredJournal?.NextPage ?? 1,
                  previousPage: filteredJournal?.PreviousPage ?? 1,
                }}
                handleSearch={handleSearch}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllJournalForm;
