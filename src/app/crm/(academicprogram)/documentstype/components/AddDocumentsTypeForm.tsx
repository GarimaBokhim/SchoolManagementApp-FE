'use client'
import { X } from 'lucide-react'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { InputElement } from '@/components/Input/InputElement'
import { ButtonElement } from '@/components/Buttons/ButtonElement'
import { Toast } from '@/components/Toast/toast'
import useErrorHandler from '@/components/helpers/ErrorHandling'
import {
    AddDocumentsTypePayload,
    UpdateDocumentsTypePayload,
} from '../types/IDocumentsType'
import { useAddDocumentsType, useUpdateDocumentsType } from '../hooks'

type Props = {
    form: UseFormReturn<UpdateDocumentsTypePayload>
    onClose: () => void
    documentsTypeId?: string
};
const AddDocumentsTypeForm = ({ form, onClose, documentsTypeId }: Props) => {
    const addDocumentsType = useAddDocumentsType();
    const updateDocumentsType = useUpdateDocumentsType()
    const { handleError, clearError } = useErrorHandler()
    const isEditing = Boolean(documentsTypeId)

    const handleClose = () => {
        form.reset({ id: '', name: '' })
        onClose()
    }

    const onSubmit: SubmitHandler<UpdateDocumentsTypePayload> = async (data) => {
        clearError()
        try {
            if (documentsTypeId) {
                await updateDocumentsType.mutateAsync({
                    id: documentsTypeId,
                    payload: {
                        id: documentsTypeId,
                        name: data.name,
                    },
                })
            } else {
                const payload: AddDocumentsTypePayload = { name: data.name }
                await addDocumentsType.mutateAsync(payload)
            }
            handleClose()
        } catch (error) {
            Toast.error(handleError(error))
        }
    }
    return (
        <div className="inset-0 flex items-center justify-center w-full h-full">
            <div className="w-full h-full bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white">
                <fieldset>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
                            {isEditing ? 'Update Document Type' : 'Add Document Type'}
                        </h1>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-red-400 text-2xl hover:text-red-500"
                            aria-label="Close"
                        >
                            <X strokeWidth={3} />
                        </button>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

                            <InputElement
                                label="Name"
                                form={form}
                                name="name"
                                required
                            />

                        </div>

                        <div className="flex justify-center mt-6">
                            <ButtonElement
                                type="submit"
                                text={isEditing ? 'Update Document Type' : 'Submit'}
                            />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default AddDocumentsTypeForm;
