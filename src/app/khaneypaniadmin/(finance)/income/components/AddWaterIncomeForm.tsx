'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddWaterIncomePayload, WaterIncomeResponse } from '../types/IWaterIncome'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddWaterIncome, useGetAllWaterIncomeSource, useUpdateWaterIncome } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";

type Props = {
    form: UseFormReturn<AddWaterIncomePayload>;
    onClose: () => void;
    waterIncome?: WaterIncomeResponse | null;
};
const AddWaterIncomeForm = ({ form, onClose, waterIncome }: Props) => {
    const addWaterIncome = useAddWaterIncome();
    const updateWaterIncome = useUpdateWaterIncome();
    const { handleError, clearError } = useErrorHandler();

    const { data: allIncomeSource } = useGetAllWaterIncomeSource();
    const [sellectedIncomeSourceId, setSelectedIncomeSourceId] = useState<
        string | null
    >(waterIncome?.waterincomeSourceId ?? '')



    const [paymentMethodsType, setPaymentMethodsType] = useState<number | null>(
        waterIncome?.paymentMethods ?? null
    );


    const handleClose = () => {
        form.reset({
            incomeDate: "",
            waterincomeSourceId: "",
            amount: 0,
            paymentMethods: 0,
            description: ""
        });
        onClose?.();
    };




    const onSubmit: SubmitHandler<AddWaterIncomePayload> = async (data) => {
        clearError();

        try {
            const payload = {
                incomeDate: data.incomeDate,
                waterincomeSourceId: data.waterincomeSourceId,
                amount: data.amount,
                paymentMethods: data.paymentMethods,
                description: data.description
            };

            if (waterIncome) {
                await updateWaterIncome.mutateAsync({
                    id: waterIncome.id,
                    payload: { id: waterIncome.id, ...payload },
                });
            } else {
                await addWaterIncome.mutateAsync(payload);
            }

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
                            {waterIncome ? "Edit WaterIncome" : "Add WaterIncome"}
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
                            <InputElement
                                label="Date"
                                form={form}
                                name="incomeDate"
                                placeholder="Enter Income Date"
                                inputType="date"
                            />



                            <AppCombobox
                                value={sellectedIncomeSourceId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Income Source"
                                name="waterincomeSourceId"
                                form={form}
                                required
                                options={allIncomeSource || []}
                                selected={
                                    allIncomeSource?.find((g) => g.id === sellectedIncomeSourceId) ||
                                    null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? ''

                                        setSelectedIncomeSourceId(id || null)

                                        form.setValue('waterincomeSourceId', id, {
                                            shouldValidate: true,
                                        })
                                    } else {
                                        setSelectedIncomeSourceId(null)

                                        form.setValue('waterincomeSourceId', '', {
                                            shouldValidate: true,
                                        })
                                    }
                                }}
                                getLabel={(g) => g?.name ?? ''}
                                getValue={(g) => g?.id ?? ''}
                            />

                            <InputElement
                                label="Amount"
                                form={form}
                                name="amount"
                                placeholder="Enter Amount"
                                type="number"
                                step="0.01"
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



                            <InputElement
                                label="Description"
                                form={form}
                                name="description"
                                placeholder="Enter Description"
                            />



                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={waterIncome ? "Update" : "Submit"}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div >
    );
};

export default AddWaterIncomeForm;
