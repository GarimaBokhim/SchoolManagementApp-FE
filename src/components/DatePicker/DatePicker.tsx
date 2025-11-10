// import { useState } from "react";
// import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
// import { useDate } from "@/context/PrimaryDateContext";
// import { useGetFiscalYearStartedDate } from "@/modules/admin/Settings/hooks";
// import { useType } from "@/context/auth/ReportContext";
// import EnglishDatePicker from "./EnglishDatePicker";
// import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";
// type Props = {
//   isDatePrimary: boolean;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   form?: any;
//   label: string;
//   name: string;
//   dateType?: "date" | "string";
//   onChangeSelectedDate?: (date: string) => void;
//   isReport: boolean;
//   required?: boolean;
//   isExpiryDate: boolean;
// };
// export default function DatePicker({
//   isDatePrimary,
//   label,
//   name,
//   required,
//   onChangeSelectedDate,
//   form,
//   dateType = "string",
//   isExpiryDate,
//   isReport,
// }: Props) {
//   const { isPrimaryBS } = useDate();
//   const { data } = useGetFiscalYearStartedDate();
//   const { isRunning } = useType();
//   const role = localStorage.getItem("role");
//   const effectiveIsRunning = role === "enduser" ? isRunning : true;
//   const padWithZero = (num: number) =>
//     num.toString().length < 2 ? `0${num}` : `${num}`;
//   const today = new Date();
//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);
//   const year = tomorrow.getFullYear();
//   const month = padWithZero(tomorrow.getMonth() + 1);
//   const tomorrowDate = padWithZero(tomorrow.getDate());
//   const todayDate = `${year}-${month}-${today.getDate()}`;
//   const fullDate = `${year}-${month}-${tomorrowDate}`;
//   const bs = String(adToBs(fullDate));
//   const openingYear = data?.openingCompanyFiscalYearStartDate;
//   const runningYear = data?.runningFiscalYearStartDate;
//   const safeADStartDate = runningYear || fullDate;
//   const safeAdOpeningYear = openingYear || fullDate;
//   const defaultOpeningDateBs = adToBs(safeAdOpeningYear);
//   const defaultMinDateBS = adToBs(safeADStartDate);
//   const [date, setDate] = useState(isPrimaryBS ? adToBs(todayDate) : todayDate);
//   const toISOStringWithCurrentTimeUTC = (dateString: string) => {
//     try {
//       const now = new Date();
//       const adDate = new Date(
//         `${dateString}T${padWithZero(now.getHours())}:${padWithZero(
//           now.getMinutes()
//         )}:${padWithZero(now.getSeconds())}.${now.getMilliseconds()}`
//       );
//       return adDate.toISOString();
//     } catch {
//       return dateString;
//     }
//   };

//   const handleDate = (adDate: string) => {
//     setDate(adDate);
//     const isoValue =
//       dateType === "date" ? toISOStringWithCurrentTimeUTC(adDate) : adDate;
//     form.setValue(name, isoValue);
//     onChangeSelectedDate?.(isoValue);
//   };

//   const handleNepaliDate = ({ bsDate }: { bsDate: string }) => {
//     setDate(bsDate);
//     const adEquivalent = bsToAd(bsDate);
//     const isoValue =
//       dateType === "date"
//         ? toISOStringWithCurrentTimeUTC(adEquivalent)
//         : adEquivalent;
//     form.setValue(name, isoValue);
//     onChangeSelectedDate?.(isoValue);
//   };

//   return (
//     <div>
//       {isDatePrimary ? (
//         <div>
//           <Calendar
//             onChange={handleNepaliDate}
//             placeholder="Enter a date"
//             language="en"
//             option
//             label={`${label}`}
//             name={name}
//             theme="green"
//             {...(!isExpiryDate && {
//               minDate: isReport ? defaultOpeningDateBs : defaultMinDateBS,
//               maxDate: !effectiveIsRunning
//                 ? isReport
//                   ? bs
//                   : defaultMinDateBS
//                 : bs,
//             })}
//             hideDefaultValue={true}
//             inputClassName={`w-full p-2 py-3 border ${
//               form.formState.errors[name] ? "border-red-500" : "border-gray-400"
//             } rounded-md outline-none dark:text-white  dark:bg-[#27272a] peer placeholder:opacity-0 bg-[#FBFBFB] focus:border-[#14b8a6]`}
//             containerClassName={"fixed w-full "}
//             labelClassName={`absolute left-1 flex pt-1 bg-[#FBFBFB] items-center dark:peer-focus:bg-[#27272a] dark:peer-focus:text-[#14b8a6] scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[0.8rem] px-2 origin-left dark:text-white peer-placeholder-shown:top-2 dark:bg-[#27272a] peer-focus:-top-[0.8rem] peer-focus:text-[#14b8a6] peer-focus:bg-[#FBFBFB] text-gray-500 transition-all pointer-events-none`}
//           />
//           <p className="pl-2 text-teal-500">
//             {" "}
//             {(() => {
//               try {
//                 return date ? bsToAd(date) : date;
//               } catch {
//                 return date;
//               }
//             })()}{" "}
//             (AD){" "}
//           </p>
//         </div>
//       ) : (
//         <div>
//           <div className="relative w-full">
//             <EnglishDatePicker
//               onChange={handleDate}
//               label={`${label}`}
//               name={name}
//               defaultDate={todayDate}
//               isExpiryDate={isExpiryDate}
//               {...(!isExpiryDate && {
//                 minDate: isReport ? safeAdOpeningYear : safeADStartDate,
//                 maxDate: !effectiveIsRunning
//                   ? isReport
//                     ? todayDate
//                     : safeADStartDate
//                   : todayDate,
//               })}
//             />
//             <label
//               htmlFor={name}
//               className={`absolute left-1 ${
//                 form.watch(name)
//                   ? "bg-[#FBFBFB] dark:bg-[#27272a]"
//                   : "bg-[#FBFBFB]"
//               } scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[0.8rem] px-2 origin-left peer-placeholder-shown:top-2 peer-focus:-top-[0.8rem] peer-focus:text-teal-500 dark:peer-focus:text-gray-200 peer-focus:bg-[#FBFBFB] dark:peer-focus:bg-[#27272a] text-gray-500 transition-all pointer-events-none`}
//             >
//               <div className="flex items-center">
//                 {required && (
//                   <span className="text-red-500 text-xl mr-1">*</span>
//                 )}
//                 {label ? `${`${label}`}` : ""}
//               </div>
//             </label>

//             <p className="pl-2 text-teal-500 mt-1">
//               {(() => {
//                 try {
//                   return date ? adToBs(date) : date;
//                 } catch {
//                   return date;
//                 }
//               })()}
//               (BS)
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
