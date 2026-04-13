"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Edit, Filter, Plus, RotateCcw, Trash } from "lucide-react";
import DateRangeFilter, {
  DateRangeFilterRef,
} from "@/components/DateFilter/FilterComponent";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useFilterEventsByDate, useRemoveEvent } from "../hooks";
import { IEvents, IfilterEvents } from "../types/IEvents";
import AddEventForm from "./AddEvents";
import EditEventForm from "./EditEvents";
import { AppCombobox } from "@/components/Input/ComboBox"; // ✅ added

const AllEventsForm = () => {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
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

  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const [params, setParams] = useState("");
  const fullQuery = query + (params || "");

  const { data, refetch, isLoading } = useFilterEventsByDate(fullQuery);

  // fetch all events without pagination for combobox options
  const { data: allEvents } = useFilterEventsByDate("?IsPagination=false");

  const [editModal, setEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvents | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(""); //title filter state

  const editForm = useForm<IEvents>();

  const { menuStatus } = usePermissions();
  const { canAdd, canDelete, canEdit } = useMenuPermissionData(menuStatus);
  const [addModal, setAddModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const deleteEvent = useRemoveEvent();

  const form = useForm<IfilterEvents>({
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const { handleError, clearError } = useErrorHandler();
  const formRef = useRef<DateRangeFilterRef>(null);
  const Eventsform = useForm<IEvents>();

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const onSubmit: SubmitHandler<IfilterEvents> = async (formData) => {
    clearError();
    try {
      const queryParams = [
        selectedTitle
          ? `title=${encodeURIComponent(selectedTitle)}`
          : null, //title param
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
    }
  };

  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
    setSelectedTitle(""); //reset title
    form.reset();
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="flex justify-between p-4 items-center">
            <h1 className="text-xl font-semibold">All Events</h1>
            <div className="flex gap-2">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={18} />}
                  type="button"
                  text="Add New"
                  onClick={() => setAddModal(true)}
                />
              )}
            </div>
          </div>

          {/*  Updated filter panel matching exam result style */}
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

                {/* Title combobox filter */}
                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    dropDownWidth="w-[25rem]"
                    label="Event Title"
                    name="title"
                    form={form}
                    dropdownPositionClass="fixed"
                    value={selectedTitle}
                    options={allEvents?.Items ?? []}
                    selected={
                      allEvents?.Items?.find(
                        (e) => e.title === selectedTitle
                      ) ?? null
                    }
                    onSelect={(event) =>
                      setSelectedTitle(event?.title ?? "")
                    }
                    getLabel={(e) => e?.title ?? ""}
                    getValue={(e) => e?.title ?? ""}
                  />
                </div>

                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-[#2f2f2f]">
                  <th className="px-4 py-3 text-center">S.N</th>
                  <th className="px-4 py-3 text-center">Title</th>
                  <th className="px-4 py-3 text-center">Description</th>
                  <th className="px-4 py-3 text-center">Events Type</th>
                  <th className="px-4 py-3 text-center">Events Date</th>
                  <th className="px-4 py-3 text-center">Participants</th>
                  <th className="px-4 py-3 text-center">Event Time</th>
                  <th className="px-4 py-3 text-center">Venue</th>
                  <th className="px-4 py-3 text-center">Chief Guest</th>
                  <th className="px-4 py-3 text-center">Organizer</th>
                  <th className="px-4 py-3 text-center">Mentor</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="p-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : data?.Items?.length ? (
                  data.Items.map((event, index) => (
                    <tr
                      key={event.id}
                      className="border-t hover:bg-gray-50 dark:hover:bg-[#444] transition"
                    >
                      <td className="px-4 py-2 text-center">{index + 1}</td>
                      <td className="px-4 py-2 text-center">{event.title}</td>
                      <td className="px-4 py-2 text-center">{event.descriptions}</td>
                      <td className="px-4 py-2 text-center">{event.eventsType}</td>
                      <td className="px-4 py-2 text-center">
                        {new Date(event.eventsDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-center">{event.participants}</td>
                      <td className="px-4 py-2 text-center">{event.eventTime}</td>
                      <td className="px-4 py-2 text-center">{event.venue}</td>
                      <td className="px-4 py-2 text-center">{event.chiefGuest}</td>
                      <td className="px-4 py-2 text-center">{event.organizer}</td>
                      <td className="px-4 py-2 text-center">{event.mentor}</td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex gap-2 items-center justify-center">
                          {canDelete && event.id && (
                            <DeleteButton
                              onConfirm={async () => {
                                await deleteEvent.mutateAsync(event.id);
                                toast.success("Event deleted successfully!");
                              }}
                              headerText={<Trash />}
                              content="Are you sure you want to delete this Event?"
                            />
                          )}
                          {canEdit && (
                            <ButtonElement
                              icon={<Edit size={14} />}
                              text=""
                              type="button"
                              onClick={() => {
                                setEditModal(true);
                                setSelectedEvent(event);
                              }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="p-4 text-center italic text-gray-500"
                    >
                      No Events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {data && data?.Items?.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={form}
              pagination={{
                currentPage: data.PageIndex,
                firstPage: data.FirstPage,
                lastPage: data.LastPage,
                nextPage: data.NextPage,
                previousPage: data.PreviousPage,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}

        <AddEventForm
          form={Eventsform}
          visible={addModal}
          onClose={() => setAddModal(false)}
        />
        <EditEventForm
          form={editForm}
          visible={editModal}
          selectedEvent={selectedEvent}
          onClose={() => setEditModal(false)}
        />
      </div>
    </>
  );
};

export default AllEventsForm;