"use client";

import { SubmitHandler, UseFormReturn, Controller } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { AppCombobox } from "@/components/Input/ComboBox";
import { Toast } from "@/components/Toast/toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";

import { IEvents } from "../types/IEvents";
import { useAddEvents } from "../hooks";

enum EventType {
  Academic    = 1,
  Sports      = 2,
  Culture     = 3,
  Seminar     = 4,
  Workshop    = 5,
  Competition = 6,
  Meeting     = 7,
  Celebration = 8,
  Holiday     = 9,
  Examination = 10,
  Other       = 99,
}

const EVENT_TYPES = [
  { value: EventType.Academic,    label: "Academic"    },
  { value: EventType.Sports,      label: "Sports"      },
  { value: EventType.Culture,     label: "Culture"     },
  { value: EventType.Seminar,     label: "Seminar"     },
  { value: EventType.Workshop,    label: "Workshop"    },
  { value: EventType.Competition, label: "Competition" },
  { value: EventType.Meeting,     label: "Meeting"     },
  { value: EventType.Celebration, label: "Celebration" },
  { value: EventType.Holiday,     label: "Holiday"     },
  { value: EventType.Examination, label: "Examination" },
  { value: EventType.Other,       label: "Other"       },
];

type EventTypeOption = (typeof EVENT_TYPES)[number];

// Reusable consistent field wrapper
const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Consistent input class
const inputClass =
  "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500";

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
      await toast.promise(
        addEvent.mutateAsync({
          ...data,
          eventsType: Number(data.eventsType),
          eventsDate: new Date(data.eventsDate).toISOString(),
          eventTime: data.eventTime.length === 5 ? data.eventTime + ":00" : data.eventTime,
        }),
        {
          loading: "Adding event...",
          success: "Event added successfully!",
        }
      );
      handleClose();
    } catch (error) {
      Toast.error(handleError(error));
    }
  };

  const selectedEventType =
    EVENT_TYPES.find((et) => et.value === Number(form.watch("eventsType"))) ?? null;

  const errors = form.formState.errors;

  return (
    <div className="fixed inset-0 z-50 ml-12 md:ml-64 sm:ml-16 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl rounded-xl shadow-lg p-6 overflow-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Add Event</h1>
          <button type="button" onClick={handleClose} className="text-red-500 text-2xl">
            <X strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Row 1 — Title | Event Type | Event Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Field label="Title" required error={errors.title?.message}>
              <input
                type="text"
                {...form.register("title", { required: "Title is required" })}
                placeholder="Event title"
                className={inputClass}
              />
            </Field>

            <Field label="Event Type" required error={errors.eventsType?.message}>
              <Controller
                name="eventsType"
                control={form.control}
                rules={{ required: "Event type is required" }}
                render={() => (
                  <AppCombobox<EventTypeOption>
                    label=""
                    name="eventsType"
                    form={form}
                    options={EVENT_TYPES}
                    selected={selectedEventType ?? undefined}
                    value={selectedEventType?.label ?? ""}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    onSelect={(option) => {
                      form.setValue("eventsType", option ? option.value : 0, {
                        shouldValidate: true,
                      });
                    }}
                    onFocus={() => {}}
                    getLabel={(opt) => opt.label}
                    getValue={(opt) => opt.value}
                    placeholder="Search event type..."
                  />
                )}
              />
            </Field>

            <Field label="Event Date" required error={errors.eventsDate?.message}>
              <input
                type="date"
                {...form.register("eventsDate", { required: "Event date is required" })}
                className={inputClass}
              />
            </Field>

          </div>

          {/* Row 2 — Event Time | Venue | Participants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Field label="Event Time" required error={errors.eventTime?.message}>
              <input
                type="time"
                {...form.register("eventTime", { required: "Event time is required" })}
                className={inputClass}
              />
            </Field>

            <Field label="Venue" required error={errors.venue?.message}>
              <input
                type="text"
                {...form.register("venue", { required: "Venue is required" })}
                placeholder="School Ground / Hall"
                className={inputClass}
              />
            </Field>

            <Field label="Participants" required error={errors.participants?.message}>
              <input
                type="text"
                {...form.register("participants", { required: "Participants is required" })}
                placeholder="Students / Teachers"
                className={inputClass}
              />
            </Field>

          </div>

          {/* Row 3 — Chief Guest | Organizer | Mentor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Field label="Chief Guest" error={errors.chiefGuest?.message}>
              <input
                type="text"
                {...form.register("chiefGuest")}
                placeholder="Chief Guest Name"
                className={inputClass}
              />
            </Field>

            <Field label="Organizer" error={errors.organizer?.message}>
              <input
                type="text"
                {...form.register("organizer")}
                placeholder="Organizer Name"
                className={inputClass}
              />
            </Field>

            <Field label="Mentor" error={errors.mentor?.message}>
              <input
                type="text"
                {...form.register("mentor")}
                placeholder="Mentor Name"
                className={inputClass}
              />
            </Field>

          </div>

          {/* Row 4 — Description */}
          <div className="grid grid-cols-1">
            <Field label="Description" error={errors.descriptions?.message}>
              <textarea
                {...form.register("descriptions")}
                placeholder="Event description"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>
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