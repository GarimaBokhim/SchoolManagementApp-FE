"use client";

import { useEffect } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {useApiHandler} from "@/hooks/useApiHandler"
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";

import { IEvents } from "../types/IEvents";
import { useEditEvents } from "../hooks";

type Props = {
  form: UseFormReturn<IEvents>;
  visible: boolean;
  onClose: () => void;
  selectedEvent: IEvents | null;
};

const EditEventForm = ({
  form,
  visible,
  onClose,
  selectedEvent,
}: Props) => {
  const updateEvent = useEditEvents();
  const { handleError, clearError } = useErrorHandler();

  useEffect(() => {
    if (visible && selectedEvent) { 
      form.reset({
        ...selectedEvent,
        eventsDate: selectedEvent.eventsDate?.split("T")[0], 
      });
    }
  }, [visible, selectedEvent, form]);

  if (!visible || !selectedEvent) return null;

  const handleClose = () => {
    form.reset();
    onClose();
  };

    const { execute } = useApiHandler();

  const onSubmit: SubmitHandler<IEvents> = async (data) => {
    clearError();
    try {
    await execute(
      (payload) => updateEvent.mutateAsync(payload), 
      {
        Id: selectedEvent.id as string,
        data: data,
      },
      {
        loadingMessage: "Updating event...",
        onSuccess: () => {
          handleClose();
        },
      }
    );
  } catch (error) {
    Toast.error(handleError(error));
  }
  };

  return (
    <div className="fixed inset-0 z-50 ml-12 md:ml-64 sm:ml-16 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl rounded-xl shadow-lg p-6 overflow-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Edit Event</h1>
          <button
            type="button"
            onClick={handleClose}
            className="text-red-500 text-2xl"
          >
            <X strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputElement label="Title" form={form} name="title"   />
            <InputElement label="Event Type" form={form} name="eventsType"   />
            <InputElement
              label="Event Date"
              form={form}
              name="eventsDate"
              inputType="date"
               
            />
          </div>

          {/* Time & Venue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputElement label="Event Time" form={form} name="eventTime"   />
            <InputElement label="Venue" form={form} name="venue"   />
            <InputElement label="Participants" form={form} name="participants"   />
          </div>

          {/* People */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputElement label="Chief Guest" form={form} name="chiefGuest" />
            <InputElement label="Organizer" form={form} name="organizer" />
            <InputElement label="Mentor" form={form} name="mentor" />
          </div>

          {/* Description */}
          <InputElement
            label="Description"
            form={form}
            name="descriptions"
            type="textarea"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <ButtonElement
              type="button"
              text="Cancel"
              className="!bg-gray-500"
              onClick={handleClose}
            />
            <ButtonElement type="submit" text="Update Event" />
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEventForm;
