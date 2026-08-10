'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { AddWaterExpensesPayload } from '../types/IWaterExpenses'
import { Controller, SubmitHandler, UseFormReturn, useFieldArray } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { useAddWaterExpenses, useGetAllExpensesCategory } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { AppCombobox } from "@/components/Input/ComboBox";
import TextEditor from '@/components/Input/TextEditor';
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";
import { useGetAllVisaStatus } from '@/app/crmadmin/(academicprogram)/visarequirements/hooks';

type Props = {
    form: UseFormReturn<AddWaterExpensesPayload>;
    onClose: () => void;
};
const AddWaterExpensesForm = ({ form, onClose }: Props) => {
    const addWaterExpenses = useAddWaterExpenses();
    const { handleError, clearError } = useErrorHandler();

    const { data: allExpensesCategory } = useGetAllExpensesCategory()
    const [sellectedExpensesCategoryId, setSelectedExpensesCategoryId] = useState<
        string | null
    >('')

    const [paymentMethodsType, setPaymentMethodsType] = useState<number | null>(null);


    const handleClose = () => {
        form.reset({
            expensesDate: "",
            expenseCategoryId: "",
            amount: 0,
            paymentMethods: 0,
            venderName: "",
            descriptions: ""
        });
        onClose?.();
    };




    const onSubmit: SubmitHandler<AddWaterExpensesPayload> = async (data) => {
        clearError();

        try {
            await addWaterExpenses.mutateAsync({
                expensesDate: data.expensesDate,
                expenseCategoryId: data.expenseCategoryId,
                amount: data.amount,
                paymentMethods: data.paymentMethods,
                venderName: data.venderName,
                descriptions: data.descriptions
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
                            Add WaterExpenses
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
                                name="expensesDate"
                                placeholder="Enter Expenses Date"
                                inputType="date"
                            />



                            <AppCombobox
                                value={sellectedExpensesCategoryId}
                                dropDownWidth="w-full"
                                dropdownPositionClass="absolute z-20"
                                label="Expense Category"
                                name="expenseCategoryId"
                                form={form}
                                required
                                options={allExpensesCategory || []}
                                selected={
                                    allExpensesCategory?.find((g) => g.id === sellectedExpensesCategoryId) ||
                                    null
                                }
                                onSelect={(group) => {
                                    if (group) {
                                        const id = group.id ?? ''

                                        setSelectedExpensesCategoryId(id || null)

                                        form.setValue('expenseCategoryId', id, {
                                            shouldValidate: true,
                                        })
                                    } else {
                                        setSelectedExpensesCategoryId(null)

                                        form.setValue('expenseCategoryId', '', {
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


                            <InputElement
                                label="Vender Name"
                                form={form}
                                name="venderName"
                                placeholder="Enter Vender Name"
                            />


                            <InputElement
                                label="Descriptions"
                                form={form}
                                name="descriptions"
                                placeholder="Enter Descriptions"
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

export default AddWaterExpensesForm;
