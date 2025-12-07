import { useForm } from "react-hook-form";
import type { ILedgers } from "../types/ILedgers";
import EditLedgerForm from "../components/Editledger";
import { useGetLedgerById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  ledgerId: string;
}

const EditLedger = ({ visible, onClose, ledgerId }: Props) => {
  const { data: ledger } = useGetLedgerById(ledgerId);
  const form = useForm<ILedgers>({
    defaultValues: {
      id: ledger?.id ?? "",
      name: ledger?.name ?? "",
      address: ledger?.address ?? "",
      panNo: ledger?.panNo ?? "",
      phoneNumber: ledger?.phoneNumber ?? "",
      maxCreditPeriod: ledger?.maxCreditPeriod ?? "",
      maxDuePeriod: ledger?.maxDuePeriod ?? "",
      subledgerGroupId: ledger?.subledgerGroupId ?? "",
      openingBalance: ledger?.openingBalance ?? 0,
    },
  });

  if (!visible) return null;

  return (
    <div>
      <div
        className={`fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center z-50 bg-opacity-10
        bg-black dark:bg-[#303135] bg-opacity-10 sm:left-[5%] md:left-[24%] lg:left-[12.3%]
    `}
      >
        <div
          className={`bg-[#FBFBFB] border rounded-xl   dark:bg-[#27272a]
        transition-all duration-300 ease-in-out
        w-[55%] h-[54%] overflow-y-auto 
        flex flex-col`}
        >
          <EditLedgerForm
            form={form}
            onClose={() => onClose()}
            ledgerId={ledgerId}
          />
        </div>
      </div>
    </div>
  );
};

export default EditLedger;
