import { useForm } from "react-hook-form";
import { IJournal } from "../types/IJournal";
import { yupResolver } from "@hookform/resolvers/yup";
import { JournalValidator } from "../validators";
import AddJournalForm from "../components/AddJournal";

interface Props {
  visible: boolean;
  inset?: boolean;
  onClose?: () => void;
}
const Add = ({ visible, onClose, inset }: Props) => {
  const handleFormClose = () => {
    form.reset();
    if (onClose) onClose();
  };
  const form = useForm<IJournal>({
    defaultValues: {
      referenceNumber: "",
      transactionDate: "",
      description: "",

      journalEntries: [
        { ledgerId: "", debitAmount: 0, creditAmount: 0 },
        { ledgerId: "", debitAmount: 0, creditAmount: 0 },
      ],
    },

    resolver: yupResolver(JournalValidator),
  });

  if (!visible) return null;

  return (
    <div>
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
          className={`transition-all duration-300 ease-in-out
    w-[60.4%] h-[80%]
    flex flex-col`}
        >
          <AddJournalForm form={form} onClose={() => handleFormClose()} />;
        </div>
      </div>
    </div>
  );
};
export default Add;
