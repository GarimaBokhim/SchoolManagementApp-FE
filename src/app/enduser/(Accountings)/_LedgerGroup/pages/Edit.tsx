import { useForm } from "react-hook-form";
import { ILedgerGroup } from "../types/ILedgerGroup";
import EditLedgerGroupForm from "../components/EditLedgerGroup";
import { useGetLedgerGroupById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  LedgerGroupId: string;
}

const EditLedgerGroup = ({ visible, onClose, LedgerGroupId }: Props) => {
  const { data: LedgerGroup } = useGetLedgerGroupById(LedgerGroupId);
  const form = useForm<ILedgerGroup>({
    defaultValues: {
      id: LedgerGroup?.id ?? "",
      name: LedgerGroup?.name ?? "",
      masterId: LedgerGroup?.masterId ?? "",
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
          <EditLedgerGroupForm
            form={form}
            onClose={() => onClose()}
            LedgerGroupId={LedgerGroupId}
          />
        </div>
      </div>
    </div>
  );
};

export default EditLedgerGroup;
