"use client"
import { useForm } from "react-hook-form";
import type { ISubLedgerGroup } from "../types/ISubLedgerGroup";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import AddSubLedgerGroupForm from "../components/AddSubLedgerGroup";
import { SubLedgerGroupValidator } from "../validators";

interface Props {
  visible: boolean;
  onClose?: () => void;
}

const AddSubLedger = ({ visible, onClose }: Props) => {
  const form = useForm<ISubLedgerGroup>({
    resolver: yupResolver(SubLedgerGroupValidator),
    defaultValues: {
      id: "",
      name: "",
      ledgerGroupId: "",
    },
  });

  useEffect(() => {
    if (visible) {
      form.reset({
        id: "",
        name: "",
        ledgerGroupId: "",
      });
    }
  }, [visible, form]);

  const handleFormClose = () => {
    form.reset();
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center z-50
    bg-black bg-opacity-50bg-black dark:bg-[#303135] bg-opacity-50 sm:left-[5%] md:left-[24%] lg:left-[12.3%]
    `}
    >
      <div
        className={`bg-[#FBFBFB] border rounded-xl   dark:bg-[#27272a]
        transition-all duration-300 ease-in-out
        w-[55%] h-[54%] overflow-y-auto 
        flex flex-col`}
      >
        <AddSubLedgerGroupForm form={form} onClose={handleFormClose} />
      </div>
    </div>
  );
};

export default AddSubLedger;
