// "use client";
// import {
//     SubmitHandler,
//     useFieldArray,
//     UseFormReturn,
// } from "react-hook-form";

// import { Plus, Trash2, X } from "lucide-react";
// import toast from "react-hot-toast";

// import { InputElement } from "@/components/Input/InputElement";
// import { ButtonElement } from "@/components/Buttons/ButtonElement";
// import { Toast } from "@/components/Toast/toast";

// import useErrorHandler from "@/components/helpers/ErrorHandling";

// import { UpdateIntakePayload } from "../types/IIntake";
// import { useUpdateIntake, useGetAllCountry } from "../hooks";
// import { AppCombobox } from "@/components/Input/ComboBox";
// import { useState } from "react";



// type Props = {
//     form: UseFormReturn<UpdateIntakePayload>
//     onClose: () => void;
//     IntakeId: string;
// };

// const EditIntakeForm = ({ form, onClose, IntakeId, }: Props) => {
//     const editIntake = useUpdateIntake();
//     const { handleError, clearError } = useErrorHandler();

//     const [IntakeStatus, setIntakeStatus] = useState<number | null>(null);

//     const { data: country } = useGetAllCountry();


//     const [isOpen, setIsOpen] = useState(true);
//     const { handleSubmit } = form;


//     const handleClose = () => {
//         onClose();
//     };

//     const monthType = [
//         { id: 1, name: 'January' },
//         { id: 2, name: 'February' },
//         { id: 3, name: 'March' },
//         { id: 4, name: 'April' },
//         { id: 5, name: 'May' },
//         { id: 6, name: 'June' },
//         { id: 7, name: 'July' },
//         { id: 8, name: 'August' },
//         { id: 9, name: 'September' },
//         { id: 10, name: 'October' },
//         { id: 11, name: 'November' },
//         { id: 12, name: 'December' }
//     ];


//     const onSubmit: SubmitHandler<UpdateIntakePayload> =
//         async (data) => {
//             clearError();
//             try {
//                 const promise = editIntake.mutateAsync({
//                     id: IntakeId,
//                     payload: data,
//                 });

//                 await toast.promise(
//                     promise,
//                     {
//                         loading: "Updating...",
//                         success: (res: any) => res?.message,
//                         error: (err: any) => err?.response?.data?.message,
//                     }
//                 );

//                 handleClose();
//             } catch (error) {
//                 const errorMsg = handleError(error);
//                 Toast.error(errorMsg);
//             }
//         };


//     const countryId = form.watch("countryId");
//     const universityId = form.watch("universityId");
//     const courseId = form.watch("courseId");
//     const month = form.watch("month") ?? 0;
//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ml-[16%]">
//             <div className="bg-white dark:bg-[#27272a] w-full max-w-5xl p-5 rounded-lg overflow-auto max-h-[90vh]">

//                 {/* HEADER */}
//                 <div className="flex justify-between mb-6">
//                     <h1 className="text-xl font-semibold">Update Intake</h1>
//                     <button onClick={handleClose}>
//                         <X />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)}>

//                     {/* BASIC INFO */}
//                     <div className="grid grid-cols-3 gap-4">
//                         <AppCombobox
//                             label="Month"
//                             name="month"
//                             form={form}
//                             value={month}
//                             options={monthType}
//                             selected={
//                                 monthType.find((g) => g.id === month) ?? null
//                             }
//                             onSelect={(option) => {
//                                 const id = option?.id ?? 0;
//                                 form.setValue("month", id);
//                             }}
//                             getLabel={(o) => o?.name ?? ""}
//                             getValue={(o) => o?.id ?? ""}
//                         />

//                         <InputElement
//                             label="Deadline"
//                             form={form}
//                             name="deadline"
//                             inputType="date"
//                             required
//                         />

//                         <button
//                             type="button"
//                             onClick={() => setIsOpen(!isOpen)}
//                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isOpen ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
//                                 }`}
//                         >
//                             <span
//                                 className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${isOpen ? "translate-x-6" : "translate-x-1"
//                                     }`}
//                             />
//                         </button>

//                         <AppCombobox
//                             value={countryId}
//                             dropDownWidth="w-full"
//                             dropdownPositionClass="absolute z-20"
//                             label="Country"
//                             name="countryId"
//                             form={form}
//                             required
//                             options={country || []}
//                             selected={
//                                 country?.find(
//                                     (g) => g.id === countryId
//                                 ) || null
//                             }
//                             onSelect={(group) => {
//                                 const id = group?.id ?? "";

//                                 form.setValue("countryId", id, {
//                                     shouldValidate: true,
//                                     shouldDirty: true,
//                                 });
//                             }}
//                             getLabel={(g) => g?.name ?? ""}
//                             getValue={(g) => g?.id ?? ""}
//                         />


//                         <AppCombobox
//                             value={universityId}
//                             dropDownWidth="w-full"
//                             dropdownPositionClass="absolute z-20"
//                             label="University"
//                             name="universityId"
//                             form={form}
//                             required
//                             options={university || []}
//                             selected={
//                                 university?.find(
//                                     (g) => g.id === universityId
//                                 ) || null
//                             }
//                             onSelect={(group) => {
//                                 const id = group?.id ?? "";

//                                 form.setValue("universityId", id, {
//                                     shouldValidate: true,
//                                     shouldDirty: true,
//                                 });
//                             }}
//                             getLabel={(g) => g?.name ?? ""}
//                             getValue={(g) => g?.id ?? ""}
//                         />


//                         <AppCombobox
//                             value={courseId}
//                             dropDownWidth="w-full"
//                             dropdownPositionClass="absolute z-20"
//                             label="Course"
//                             name="courseId"
//                             form={form}
//                             required
//                             options={course || []}
//                             selected={
//                                 course?.find(
//                                     (g) => g.id === courseId
//                                 ) || null
//                             }
//                             onSelect={(group) => {
//                                 const id = group?.id ?? "";

//                                 form.setValue("courseId", id, {
//                                     shouldValidate: true,
//                                     shouldDirty: true,
//                                 });
//                             }}
//                             getLabel={(g) => g?.title ?? ""}
//                             getValue={(g) => g?.id ?? ""}
//                         />





//                     </div>

//                     {/* SUBMIT */}
//                     <div className="flex justify-center mt-6">
//                         <ButtonElement type="submit" text="Update Intake" />
//                     </div>

//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditIntakeForm;