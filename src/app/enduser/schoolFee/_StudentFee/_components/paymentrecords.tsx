// paymentrecords.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { InputElement } from "@/components/Input/InputElement";
import { DollarSign } from "lucide-react";
import { useAddPaymentRecord } from "../hooks";
import { IPaymentRecord } from "../types/IStudentFee";
import useErrorHandler from "@/components/helpers/ErrorHandling";

interface PaymentRecordFormProps {
  studentfeeId: string;          // <-- required
  onClose?: () => void;           // optional callback to close modal
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
        if (onClose) onClose(); // close modal
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
      <div className="p-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <InputElement
            label="Payment Date *"
            inputType="date"
            name="paymentDate"
            form={form}
            className="w-full h-[42px]"
            required
          />
          <InputElement
            label="Amount *"
            inputType="number"
            name="amountPaid"
            form={form}
            min={1}
            step={0.01}
            className="w-full h-[42px]"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              {...form.register("paymentMethod", { valueAsNumber: true })}
              className="w-full h-[42px] px-3 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value={1}>Cash</option>
              <option value={2}>Card</option>
              <option value={3}>Bank Transfer</option>
              <option value={4}>Online Payment</option>
              <option value={5}>Cheque</option>
            </select>
          </div>
          <InputElement
            label="Reference (Optional)"
            inputType="text"
            name="reference"
            form={form}
            placeholder="Payment reference..."
            className="w-full h-[42px] md:col-span-2"
          />
          <div className="flex gap-3 md:col-span-2">
            <ButtonElement
              type="submit"
              text={isPending ? "Adding..." : "Add Payment"}
              icon={<DollarSign size={16} />}
              disabled={isPending}
              className="h-[42px] px-8 !bg-emerald-600 hover:!bg-emerald-700 disabled:opacity-70"
            />
            <ButtonElement
              type="button"
              text="Clear"
              onClick={onClear}
              disabled={isPending}
              className="h-[42px] px-8 !bg-gray-600 hover:!bg-gray-700"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentRecordForm;
