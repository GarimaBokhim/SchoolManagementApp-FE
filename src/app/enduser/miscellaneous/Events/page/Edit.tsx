"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useParams } from "next/navigation";

import { IEvents } from "../types/IEvents";
import { useGetEventsById } from "../hooks";
import EditEventForm from "../components/EditEvents";

interface Props {
  onClose?: () => void;
}

const Edit = ({ onClose }: Props) => {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useGetEventsById(id);

  const form = useForm<IEvents>({
    defaultValues: {
      id: "",
      title: "",
      descriptions: "",
      eventsType: 0,
      fromDate: "",
      toDate: "",
      participants: "",
      eventTime: "",
      venue: "",
      chiefGuest: "",
      organizer: "",
      mentor: "",
      schoolId: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        fromDate: data.fromDate?.split("T")[0],
        toDate: data.toDate?.split("T")[0],
      });
    }
  }, [data, form]);

  const handleOnClose = () => {
    if (onClose) onClose();
  };

  if (isLoading) {
    return <div className="p-6">Loading event...</div>;
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Edit Event</h1>

        <div className="p-6 rounded-xl shadow-md">
          <EditEventForm
            form={form}
            visible={true}
            selectedEvent={data || null}
            onClose={handleOnClose}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
