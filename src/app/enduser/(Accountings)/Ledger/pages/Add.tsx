import { useForm } from "react-hook-form";
import type { ILedgers } from "../types/ILedgers";
import { useEffect } from "react";
import AddLedgerForm from "../components/AddLedger";
import { yupResolver } from "@hookform/resolvers/yup";
import { LedgerValidator } from "../validators";

interface Props {
  visible: boolean;
  onClose?: () => void;
  inset?: boolean;
  selectedSubLedgerGroup?: string;
}

const AddL = ({ visible, onClose, selectedSubLedgerGroup, inset }: Props) => {
  const form = useForm<ILedgers>({
    resolver: yupResolver(LedgerValidator),
    defaultValues: {
      id: "",
      name: "",
      address: "",
      panNo: "",
      phoneNumber: "",
      maxCreditPeriod: "",
      maxDuePeriod: "",
      openingBalance: null,
      subledgerGroupId: "",
    },
  });

  useEffect(() => {
    if (visible) {
      form.reset({
        id: "",
        name: "",
        address: "",
        panNo: "",
        phoneNumber: "",
        maxCreditPeriod: "",
        openingBalance: null,
        maxDuePeriod: "",
        subledgerGroupId: "",
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
    bg-black bg-opacity-50
    ${
      inset
        ? "bg-black dark:bg-[#303135] bg-opacity-50 sm:left-[5%] md:left-[24%] lg:left-[12.3%]"
        : "bg-black dark:bg-[#303135] bg-opacity-50 sm:left-[5%] md:left-[24%] lg:left-[12.3%]"
    }`}
    >
      <div
        className={`bg-[#FBFBFB] border rounded-xl   dark:bg-[#27272a]
        transition-all duration-300 ease-in-out
        w-[55%] h-[54%] overflow-y-auto 
        flex flex-col`}
      >
        <AddLedgerForm
          form={form}
          selectedSubLedgerGroup={selectedSubLedgerGroup}
          onClose={handleFormClose}
        />
      </div>
    </div>
  );
};

export default AddL;
