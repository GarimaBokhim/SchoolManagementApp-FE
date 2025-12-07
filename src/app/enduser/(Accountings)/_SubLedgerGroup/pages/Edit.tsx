import { useForm } from "react-hook-form";
import { ISubLedgerGroup } from "../types/ISubLedgerGroup";
import { useGetSubLedgerGroupById } from "../hooks";
import EditSubLedgerGroupForm from "../components/EditSubLedgerGroup";

interface Props {
  visible: boolean;
  onClose: () => void;
  SubLedgerGroupId: string;
}

const EditSubLedgerGroup = ({ visible, onClose, SubLedgerGroupId }: Props) => {
  const { data: SubLedgerGroup } = useGetSubLedgerGroupById(SubLedgerGroupId);
  const form = useForm<ISubLedgerGroup>({
    defaultValues: {
      id: SubLedgerGroup?.id ?? "",
      name: SubLedgerGroup?.name ?? "",
      ledgerGroupId: SubLedgerGroup?.ledgerGroupId ?? "",
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
          <EditSubLedgerGroupForm
            form={form}
            onClose={() => onClose()}
            SubLedgerGroupId={SubLedgerGroupId}
          />
        </div>
      </div>
    </div>
  );
};

export default EditSubLedgerGroup;
