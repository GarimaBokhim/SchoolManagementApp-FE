'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddWaterReceiptPayload } from '../types/IWaterReceipts'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddWaterReceipt, useGetAllWaterBilling } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";

type Props = {
    form: UseFormReturn<AddWaterReceiptPayload>;
    onClose: () => void;
};
const AddWaterReceiptForm = ({ form, onClose }: Props) => {
    const addWaterReceipt = useAddWaterReceipt();
    const { handleError, clearError } = useErrorHandler();

    const [paymentMethodsType, setPaymentMethodsType] = useState<number | null>(null);
    const { data: allWaterBilling } = useGetAllWaterBilling();
    const [selectedWaterBillingId, setSelectedWaterBillingId] = useState<
        string | null
    >('')



    const handleClose = () => {
        form.reset({
            waterBillingId: "",
            receiptDate: "",
            paymentMethods: 0
        });
        onClose?.();
    };




    const onSubmit: SubmitHandler<AddWaterReceiptPayload> = async (data) => {
        clearError();

        try {
            await addWaterReceipt.mutateAsync({
                waterBillingId: data.waterBillingId,
                receiptDate: data.receiptDate,
                paymentMethods: data.paymentMethods
            });

            handleClose();
            onClose();
        } catch (error) {
            Toast.error(handleError(error));
        }
    };
    return (
        <div className=" inset-0 flex items-center justify-center  w-full h-full">
            <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
                <fieldset className="">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            Add WaterReceipts
                        </h1>
                        <button
                            type="button"
                            onClick={() => {
                                handleClose();
                                onClose();
                            }}
                            className="text-red-400 text-2xl hover:text-red-500"
                        >
                            <X strokeWidth={3} />
                        </button>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">


                            <AppCombobox
                                value={selectedWaterBillingId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Water Billing"
                                name="waterBillingId"
                                form={form}
                                required
                                options={allWaterBilling || []}
                                selected={
                                    allWaterBilling?.find((g) => g.id === selectedWaterBillingId) ||
                                    null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? ''

                                        setSelectedWaterBillingId(id || null)

                                        form.setValue('waterBillingId', id, {
                                            shouldValidate: true,
                                        })
                                    } else {
                                        setSelectedWaterBillingId(null)

                                        form.setValue('waterBillingId', '', {
                                            shouldValidate: true,
                                        })
                                    }
                                }}
                                getLabel={(g) => g?.name ?? ''}
                                getValue={(g) => g?.id ?? ''}
                            />


                            <InputElement
                                label="ReceiptDate"
                                form={form}
                                name="receiptDate"
                                type="date"
                                placeholder="Enter ReceiptDate"
                            />

                            <AppCombobox
                                label="Payment Methods"
                                dropdownPositionClass="absolute"
                                name="paymentMethods"
                                form={form}
                                value={paymentMethodsType}
                                options={[
                                    { id: 1, name: 'Cash' },
                                    { id: 2, name: 'CreditCard' },
                                    { id: 3, name: 'DebitCard' },
                                    { id: 4, name: 'BankTransfer' },
                                    { id: 5, name: 'MobilePayment' },
                                    { id: 6, name: 'Check' }

                                ]}
                                dropDownWidth="w-full"
                                selected={
                                    [
                                        { id: 1, name: 'Cash' },
                                        { id: 2, name: 'CreditCard' },
                                        { id: 3, name: 'DebitCard' },
                                        { id: 4, name: 'BankTransfer' },
                                        { id: 5, name: 'MobilePayment' },
                                        { id: 6, name: 'Check' }

                                    ].find((g) => g.id === paymentMethodsType) || null
                                }
                                onSelect={(option) => {
                                    setPaymentMethodsType(option?.id ?? null);
                                    form.setValue('paymentMethods', option?.id ?? 0);
                                }}
                                getLabel={(o) => o?.name || ''}
                                getValue={(o) => o?.id ?? ''}
                            />



                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement type="submit" text={"Submit"} />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div >
    );
};

export default AddWaterReceiptForm;
