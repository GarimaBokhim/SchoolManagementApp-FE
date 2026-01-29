"use client";

import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";

import { IEvents } from "../types/IEvents";
import { useAddEvents } from "../hooks";

type Props = {
  form: UseFormReturn<IEvents>;
  visible: boolean;
  onClose: () => void;
};

const AddEventForm = ({ form, visible, onClose }: Props) => {
  const addEvent = useAddEvents();
  const { handleError, clearError } = useErrorHandler();

  if (!visible) return null;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit: SubmitHandler<IEvents> = async (data) => {
    clearError();
    try {
      await toast.promise(addEvent.mutateAsync(data), {
        loading: "Adding event...",
        success: "Event added successfully!",
      });
      handleClose();
    } catch (error) {
      Toast.error(handleError(error));
    }
  };

  return (
    <div className="fixed inset-0 z-50 ml-12 md:ml-64 sm:ml-16 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl rounded-xl shadow-lg p-6 overflow-auto max-h-[90vh]">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Add Event</h1>
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
            <InputElement
              label="Title"
              form={form}
              name="title"
              placeholder="Event title"
              required
            />

            <InputElement
              label="Event Type"
              form={form}
              name="eventsType"
              placeholder="Sports / Seminar / Program"
              required
            />

            <InputElement
              label="Event Date"
              form={form}
              name="eventsDate"
              inputType="date"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputElement
              label="Event Time"
              form={form}
              name="eventTime"
              placeholder="10:00 AM - 2:00 PM"
              required
            />

            <InputElement
              label="Venue"
              form={form}
              name="venue"
              placeholder="School Ground / Hall"
              required
            />
    
            <InputElement
              label="Participants"
              form={form}
              name="participants"
              placeholder="Students / Teachers"
             
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputElement
              label="Chief Guest"
              form={form}
              name="chiefGuest"
              placeholder="Chief Guest Name"
            />

            <InputElement
              label="Organizer"
              form={form}
              name="organizer"
              placeholder="Organizer Name"
            />

            <InputElement
              label="Mentor"
              form={form}
              name="mentor"
              placeholder="Mentor Name"
            />
          </div>

          {/* Description */}
          <div className="grid grid-cols-1">
            <InputElement
              label="Description"
              form={form}
              name="descriptions"
              placeholder="Event description"
              type="textarea"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <ButtonElement
              type="button"
              text="Cancel"
              className="!bg-gray-500"
              onClick={handleClose}
            />
            <ButtonElement type="submit" text="Save Event" />
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
