import { useGetLedgerBalance } from "../hooks";
type PropsLedger = {
  ledgerId: string;
};
export const LedgerBalance = ({ ledgerId }: PropsLedger) => {
  const { data: ledger } = useGetLedgerBalance(ledgerId);

  if (!ledgerId) return <span className="text-gray-400">No Ledger</span>;
  if (!ledger) return <span className="text-gray-400">No ledger</span>;

  return (
    <div>
      <span
        className={
          ledger.balanceType === "Cr" ? "text-red-500" : "text-green-600"
        }
      >
        {ledger.balance} {ledger.balanceType}
      </span>
    </div>
  );
};
