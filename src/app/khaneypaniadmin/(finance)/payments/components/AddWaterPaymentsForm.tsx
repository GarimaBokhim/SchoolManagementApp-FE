'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddWaterPaymentsPayload } from '../types/IWaterPayments'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddWaterPayments, useGetAllHouseHolds } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";

type Props = {
    form: UseFormReturn<AddWaterPaymentsPayload>;
    onClose: () => void;
};
const AddWaterPaymentsForm = ({ form, onClose }: Props) => {
    const addWaterPayments = useAddWaterPayments();
    const { handleError, clearError } = useErrorHandler();


    const { data: allHouseHolds } = useGetAllHouseHolds();
    const [selectedHouseHoldId, setSelectedHouseHoldId] = useState<
        string | null
    >('')

    const [paymentMethodsType, setPaymentMethodsType] = useState<number | null>(null);

    const handleClose = () => {
        form.reset({
            houseHoldId: "",
            paymentDate: "",
            paidAmount: 0,
            paymentMethods: 0
        });
        onClose?.();
    };




    const onSubmit: SubmitHandler<AddWaterPaymentsPayload> = async (data) => {
        clearError();

        try {
            await addWaterPayments.mutateAsync({
                houseHoldId: data.houseHoldId,
                paymentDate: data.paymentDate,
                paidAmount: data.paidAmount,
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
                            Add WaterPayments
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
                                value={selectedHouseHoldId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="House Hold"
                                name="houseHoldId"
                                form={form}
                                required
                                options={allHouseHolds || []}
                                selected={
                                    allHouseHolds?.find((g) => g.id === selectedHouseHoldId) ||
                                    null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? ''

                                        setSelectedHouseHoldId(id || null)

                                        form.setValue('houseHoldId', id, {
                                            shouldValidate: true,
                                        })
                                    } else {
                                        setSelectedHouseHoldId(null)

                                        form.setValue('houseHoldId', '', {
                                            shouldValidate: true,
                                        })
                                    }
                                }}
                                getLabel={(g) => g?.consumerName ?? ''}
                                getValue={(g) => g?.id ?? ''}
                            />


                            <InputElement
                                label="PaymentDate"
                                form={form}
                                name="paymentDate"
                                inputType="date"
                                placeholder="Enter PaymentDate"
                            />

                            <InputElement
                                label="PaidAmount"
                                form={form}
                                name="paidAmount"
                                type="number"
                                placeholder="Enter PaidAmount"
                            />

                            <AppCombobox
                                label="Payments Methods"
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

export default AddWaterPaymentsForm;
