import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";
import { useAddPaymentRecord } from "../hooks";
import { IPaymentRecord } from "../types/IStudentFee";
import useErrorHandler from "@/components/helpers/ErrorHandling";

interface PaymentRecordFormProps {
  studentfeeId: string;        
  onClose?: () => void;           
}

const PaymentRecordForm: React.FC<PaymentRecordFormProps> = ({
  studentfeeId,
  onClose,
}) => {
  const { handleError, clearError } = useErrorHandler();
  const { mutate: addPayment, isPending } = useAddPaymentRecord();

  const form = useForm<IPaymentRecord>({
    defaultValues: {
      studentfeeId: studentfeeId,
      amountPaid: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: 1,
      reference: "",
    },
  });

  const onSubmit: SubmitHandler<IPaymentRecord> = (data) => {
    clearError();

    if (data.amountPaid <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    addPayment(data, {
      onSuccess: () => {
        toast.success("Payment recorded successfully!");
        form.reset({
          studentfeeId,
          amountPaid: 0,
          paymentDate: new Date().toISOString().split("T")[0],
          paymentMethod: 1,
          reference: "",
        });
        if (onClose) onClose();
      },
      onError: (error) => {
        toast.error(handleError(error) || "Failed to record payment");
      },
    });
  };

  const onClear = () => {
    form.reset({
      studentfeeId,
      amountPaid: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: 1,
      reference: "",
    });
  };

  return (
  <>
    <Toaster position="top-right" />

   <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div className="w-full max-w-md bg-white rounded-2xl border shadow-lg">

    <div className="px-6 py-4 border-b">
      <h2 className="text-lg font-semibold text-gray-800">
        Add Payment Record
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Enter payment details for the selected student fee.
      </p>
    </div>

    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="px-6 py-6 flex flex-col items-center gap-4"
    >
      <div className="w-full max-w-sm">
        <InputElement
          label="Payment Date *"
          inputType="date"
          name="paymentDate"
          form={form}
          className="h-[42px]"
          required
        />
      </div>

      <div className="w-full max-w-sm">
        <InputElement
          label="Amount *"
          inputType="number"
          name="amountPaid"
          form={form}
          min={1}
          step={0.01}
          className="h-[42px]"
          required
        />
      </div>

      <div className="w-full max-w-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method *
        </label>
        <select
          {...form.register("paymentMethod", { valueAsNumber: true })}
          className="w-full h-[42px] px-3 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value={1}>Cash</option>
          <option value={2}>Credit Card</option>
          <option value={3}>Debit Card</option>
          <option value={4}>Bank Transfer</option>
          <option value={5}>Mobile Payment</option>
          <option value={6}>Cheque</option>
        </select>
      </div>

      <div className="w-full max-w-sm">
        <InputElement
          label="Reference (Optional)"
          inputType="text"
          name="reference"
          form={form}
          placeholder="Payment reference..."
          className="h-[42px]"
        />
      </div>

      <div className="w-full max-w-sm flex justify-end gap-3 pt-4">
        <ButtonElement
          type="button"
          text="Clear"
          onClick={onClear}
          disabled={isPending}
          className="h-[42px] px-6 !bg-gray-600 hover:!bg-gray-700"
        />
        <ButtonElement
          type="submit"
          text={isPending ? "Adding..." : "Add Payment"}
          disabled={isPending}
          className="h-[42px] px-6 !bg-teal-500 hover:!bg-teal-600 disabled:opacity-70"
        />
      </div>
    </form>
  </div>
</div>

  </>
);

};

export default PaymentRecordForm;
