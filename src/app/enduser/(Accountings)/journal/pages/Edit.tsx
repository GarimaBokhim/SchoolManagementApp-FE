import { useForm } from "react-hook-form";
import { IJournal } from "../types/IJournal";
import EditJournalForm from "../components/EditJournal";
import { useGetJournalById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  journalId: string;
  inset?: boolean;
}

const EditJournal = ({ visible, onClose, journalId, inset }: Props) => {
  const { data: journal } = useGetJournalById(journalId);

  const form = useForm<IJournal>({
    defaultValues: {
      id: journal?.id ?? "",
      referenceNumber: journal?.referenceNumber ?? "",
      transactionDate: journal?.transactionDate ?? "",
      description: journal?.description ?? "",
      journalEntries:
        journal?.journalEntries?.map((entry) => ({
          id: entry.id,
          ledgerId: entry.ledgerId,
          debitAmount: entry.debitAmount,
          creditAmount: entry.creditAmount,
        })) ?? [],
    },
  });

  if (!visible) return null;

  return (
    <div>
      <div
        className={`fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center z-50
    bg-black bg-opacity-20
    ${
      inset
        ? "bg-black dark:bg-[#303135] bg-opacity-20 sm:left-[5%] md:left-[24%] lg:left-[12.3%]"
        : "bg-black dark:bg-[#303135] bg-opacity-20 sm:left-[5%] md:left-[24%] lg:left-[12.3%]"
    }`}
      >
        <div
          className={`transition-all duration-300 ease-in-out
    w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] 
    h-[80vh] md:h-[85vh] lg:h-[90vh]
    flex flex-col`}
        >
          <EditJournalForm
            form={form}
            onClose={onClose}
            journalId={journalId}
          />
        </div>
      </div>
    </div>
  );
};

export default EditJournal;
