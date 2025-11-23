// "use client";

// import React, { useRef } from "react";

// export interface StudentData {
//   studentName: string;
//   fatherName: string;
//   province: string;
//   district: string;
//   municipality: string;
//   ward: string;
//   program: string;
//   year: string;
//   percentage: string;
//   division: string;
//   dobBS: string;
//   dobAD: string;
//   symbolNo: string;
//   regNo: string;
//   issueDate: string;
//   photo: string;
// }

// interface Props {
//   student: StudentData;
// }

// const Certificate: React.FC<Props> = ({ student }) => {
//   const certificateRef = useRef<HTMLDivElement>(null);

//   return (
//     <div className="bg-gray-100 p-10 min-h-screen font-[Times_New_Roman]">
//       <div
//         ref={certificateRef}
//         className="relative bg-white mx-auto w-[210mm] h-[297mm] shadow-xl print:shadow-none overflow-hidden"
//       >
//         <img
//           src="/border.png"
//           alt="border"
//           className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none p-8"
//         />

//         <div className="relative z-10 px-20 pt-16 pb-12">
//           <header className="flex items-start justify-between border-b-4 border-blue-800 pb-4 mb-6">
//             <div className="w-28">
//               <img
//                 src="/default-logo.png"
//                 alt="College Logo"
//                 className="w-full h-auto"
//               />
//             </div>
//             <div className="flex-1 text-center text-blue-900">
//               <p className="text-sm">TU Regd. No.: 735</p>
//               <p className="text-xs">An ISO 9001:2015 Certified</p>
//               <h2 className="text-3xl font-bold mt-1 mb-1">
//                 AASTHA COLLEGE OF MANAGEMENT
//               </h2>
//               <p className="text-sm">Damak-04, Jhapa, Koshi Province, Nepal</p>
//               <p className="text-xs mt-1">
//                 ☎ 023-573549, 023-577127 ✉ aasthacollege23@gmail.com
//               </p>
//             </div>
//             <div className="w-28" /> {/* for balance */}
//           </header>

//           {/* Certificate Title + Photo */}
//           <div className="flex justify-center items-center mb-6 gap-10">
//             <h1 className="bg-red-700 px-10 text-white text-center text-2xl font-bold py-2 rounded-3xl">
//               CHARACTER CERTIFICATE
//             </h1>
//             <div className="w-[110px] h-[140px] border-2 border-black flex items-center justify-center">
//               <img
//                 src={student.photo}
//                 alt="Student Photo"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="text-[16px] leading-relaxed text-justify text-black">
//             <p>
//               <strong>S. No.:</strong> 1567
//             </p>
//             <p className="mt-4">
//               This is to certify that Ms. <strong>{student.studentName}</strong>
//               , daughter of Mr. <strong>{student.fatherName}</strong>,
//               inhabitant of <strong>{student.province}</strong> Province,{" "}
//               <strong>{student.district}</strong> district,{" "}
//               <strong>{student.municipality}</strong> Rural Municipality, ward
//               no <strong>{student.ward}</strong>, was a bonafide student of this
//               college. She passed <strong>{student.program}</strong>{" "}
//               Examinations in the year <strong>{student.year}</strong> and
//               secured <strong>{student.percentage}%</strong> with{" "}
//               <strong>{student.division}</strong> division. Her conduct while at
//               college was commendable. As per our record, her date of birth is{" "}
//               <strong>{student.dobBS}</strong> B.S. (
//               <strong>{student.dobAD}</strong> A.D.).
//             </p>
//             <p className="italic text-center mt-6">
//               We extend our best wishes for her future endeavors and success in
//               life.
//             </p>
//           </div>

//           {/* Footer */}
//           <footer className="mt-12 text-[14px]">
//             <div className="mb-10">
//               <p>
//                 <strong>Final Symbol No.:</strong> {student.symbolNo}
//               </p>
//               <p>
//                 <strong>Registration No.:</strong> {student.regNo}
//               </p>
//               <p>
//                 <strong>Date of Issue:</strong> {student.issueDate}
//               </p>
//             </div>

//             <div className="flex justify-between text-center mt-20">
//               <div className="w-1/3 border-t border-black pt-1 font-semibold">
//                 Issuing Staff
//               </div>
//               <div className="w-1/3 border-t border-black pt-1 font-semibold">
//                 College Seal
//               </div>
//               <div className="w-1/3 border-t border-black pt-1 font-semibold">
//                 Campus Chief
//               </div>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Certificate;
