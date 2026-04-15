"use client";
import { useForm } from "react-hook-form";
import { INotice } from "../types/INotice";
import AddNoticeForm from "../_components/AddNotice";

interface Props {
  visible: boolean;
  onClose?: () => void;
  noticeToEdit?: INotice | null;
}

const AddNotice = ({ visible, onClose, noticeToEdit }: Props) => {
  const form = useForm<INotice>({
    defaultValues: {
      title: "",
      contentHtml: "",
      shortDescription: "",
    },
  });

  const handleOnClose = () => {
    form.reset();
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0">
      <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw] max-h-[95vh] md:max-h-[92vh] h-full rounded-lg overflow-auto p-6 md:p-8 shadow-lg">
        <AddNoticeForm form={form} onClose={handleOnClose} noticeToEdit={noticeToEdit} />
      </div>
    </div>
  );
};

export default AddNotice;