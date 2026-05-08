"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { IEvents } from "../types/IEvents";
import AddEventForm from "../components/AddEvents";

interface props {
  onClose?: () => void;
}
const Add = ({ onClose }: props) => {
  const form = useForm<IEvents>({
    defaultValues: {
      id: "",
      title: "",
      descriptions: "",
      eventsType: 0,
      fromDate: new Date().toISOString().split("T")[0],  // ✅ was eventsDate
      toDate: new Date().toISOString().split("T")[0],    // ✅ add this
      participants: "",
      eventTime: "",
      venue: "",
      chiefGuest: "",
      organizer: "",
      mentor: "",
    },
  });
  const handleOnClose = () => {
    if (onClose) onClose();
  };


  return (
    <>
      <Toaster position="top-right" />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Add Events</h1>
        <div className="  p-6 rounded-xl shadow-md">
          <AddEventForm form={form} visible={true} onClose={handleOnClose} />
        </div>
      </div>
    </>
  );
};

export default Add;
