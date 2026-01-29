"use client";

import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Pagination from "@/components/Pagination";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { Edit, Filter, Plus,  RotateCcw, Trash } from "lucide-react";
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
const [editModal, setEditModal] = useState(false);
const [selectedEvent, setSelectedEvent] = useState<IEvents | null>(null);

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
const Eventsform = useForm<IEvents>()

  useEffect(() => {
    refetch();
  }, [paginationParams, refetch]);

  const onSubmit: SubmitHandler<IfilterEvents> = async (formData) => {
    clearError();
    try {
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



  const handleDelete = async (id: string) => {
    try {
      await deleteEvent.mutateAsync(id);
      toast.success("Event deleted successfully!");
      refetch();
    } catch {
      toast.error("Error deleting Events.");
    }
  };

  const onClearClick = () => {
    refetch();
    setParams("");
    formRef.current?.handleClear();
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

          {openFilter && (
            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-wrap gap-4"
              >
                <DateRangeFilter
                  ref={formRef}
                  form={form}
                  onSubmit={onSubmit}
                  setParams={setParams}
                />

               

                <div className="flex gap-2 ml-auto">
                  <ButtonElement type="submit" text="Filter" icon={<Filter size={14} />} />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-center">S.N</th>
                  <th className="px-4 py-3 text-center">Title</th>
                  <th className="px-4 py-3 text-center">Description</th>
                  <th className="px-4 py-3 text-center">eventsType</th>
                  <th className="px-4 py-3 text-center">eventsDate</th>
                  <th className="px-4 py-3 text-center">participants</th>
                  <th className="px-4 py-3 text-center">eventTime</th>
                  <th className="px-4 py-3 text-center">venue</th>
                  <th className="px-4 py-3 text-center">chiefGuest</th>
                  <th className="px-4 py-3 text-center">organizer</th>
                  <th className="px-4 py-3 text-center">mentor</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
              {isLoading ? (
                    <tr>
                        <td colSpan={5} className="p-4 text-center">
                        Loading...
                        </td>
                    </tr>
                    ) : data?.Items?.length ? (
                    data.Items.map((award, index) => (
                        <tr key={award.id} className="border-t">
                        <td className="px-4 py-2 text-center">{index + 1}</td>
                        <td className="px-4 py-2 text-center">{award.title}</td>
                        <td className="px-4 py-2 text-center">{award.descriptions}</td>
                        <td className="px-4 py-2 text-center">{award.eventsType}</td>
                        <td className="px-4 py-2 text-center">{new Date(award.eventsDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-center">{award.participants}</td>
                        <td className="px-4 py-2 text-center">{award.eventTime}</td>
                        <td className="px-4 py-2 text-center">{award.venue}</td>
                        <td className="px-4 py-2 text-center">{award.chiefGuest}</td>
                        <td className="px-4 py-2 text-center">{award.organizer}</td>
                        <td className="px-4 py-2 text-center">{award.mentor}</td>
                         <td className="px-4 py-2 text-center  flex gap-2 items-center"> 
                          {canDelete && award.id && (
                        <DeleteButton
                          onConfirm={async () => {
                            await deleteEvent.mutateAsync(award.id);
                            toast.success("Events deleted successfully!");
                          }}
                          headerText={<Trash />}
                          content="Are you sure you want to delete this Events?"
                        />
                      )}
                      {canEdit && (
                        <ButtonElement
                          icon={<Edit size={14} />}
                          text=""
                          type="button"
                          onClick={() => {
                            setEditModal(true);
                            setSelectedEvent(award);
                          }}
                        />
                      )}
                      </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={5} className="p-4 text-center italic">
                        No Student Awards found.
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
        
        <AddEventForm form={Eventsform} visible={addModal} onClose={() => setAddModal(false)} />
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
