// "use client";
// import React from "react";
// import { X } from "lucide-react";

// interface Props {
//   // examSeatId: string;
//   onClose: () => void;
// }

// // ✅ Default testing data (correct place — outside the component)
// export const defaultSeatPlanData = {
//   students: [
//     { id: "1", symbolNo: "2401", name: "Ram Bahadur" },
//     { id: "2", symbolNo: "2402", name: "Sita Kumari" },
//     { id: "3", symbolNo: "2403", name: "Hari Prasad" },
//     { id: "4", symbolNo: "2404", name: "Gita Sharma" },
//     { id: "5", symbolNo: "2405", name: "Raju Thapa" },
//     { id: "6", symbolNo: "2406", name: "Mina Gurung" },
//     { id: "7", symbolNo: "2407", name: "Kamal Lama" },
//     { id: "8", symbolNo: "2408", name: "Bimala Rai" },
//     { id: "9", symbolNo: "2409", name: "Suresh Karki" },
//     { id: "10", symbolNo: "2410", name: "Laxmi Shrestha" },
//   ],

//   // NEW CONFIG
//   studentsPerDesk: 2,
//   desksPerRow: 4, // <- customize here
//   desksPerColumn: 3, // <- customize here
// };

// const SchoolMarkSheet: React.FC<Props> = ({ onClose }) => {
//   // ❌ const { data } = useGenerateExamSeatPlan(examSeatId);
//   // ✅ Use default testing data for now
//   const data = defaultSeatPlanData;
//   const { desksPerRow, desksPerColumn } = data;

//   // total desks on page
//   const totalDesks = desksPerRow * desksPerColumn;
//   const groupStudents = (students: any[], studentsPerDesk: number) => {
//     const groups: any[] = [];

//     for (let i = 0; i < students.length; i += studentsPerDesk) {
//       groups.push(students.slice(i, i + studentsPerDesk));
//     }

//     return groups;
//   };
//   const desks = groupStudents(data.students, data.studentsPerDesk);

//   const handlePrint = () => {
//     const content = document.getElementById("seatplan")?.outerHTML;
//     if (!content) return;

//     const printWindow = window.open("", "", "width=900,height=1000");
//     printWindow?.document.write(`
//       <html>
//         <head>
//           <title>Exam Seat Plan</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @media print {
//               @page { size: A4 portrait; margin: 5mm; }
//               body * { visibility: hidden; }
//               #seatplan, #seatplan * { visibility: visible; }
//               #seatplan { position: absolute; inset: 0; }
//               * { -webkit-print-color-adjust: exact !important; }
//             }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `);
//     printWindow?.document.close();
//     printWindow?.focus();
//     printWindow?.print();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
//       <div className="bg-white w-[90%] max-w-4xl p-4 rounded shadow">
//         <div className="flex justify-between mb-4">
//           <h2 className="text-xl font-bold">Exam Seat Plan</h2>
//           <button onClick={onClose} className="text-red-500">
//             <X />
//           </button>
//         </div>

//         <div id="seatplan" className="border border-gray-400 p-5 bg-white">
//           <h1 className="text-2xl font-bold text-center mb-5 uppercase">
//             Exam Seat Plan
//           </h1>

//           <div
//             className={`grid gap-6`}
//             style={{
//               gridTemplateColumns: `repeat(${desksPerRow}, minmax(0, 1fr))`,
//             }}
//           >
//             {desks.map((desk, index) => (
//               <div
//                 key={index}
//                 className="border border-sky-600 p-3 rounded shadow text-center"
//               >
//                 <h2 className="font-bold mb-2">Desk {index + 1}</h2>

//                 <div className="space-y-2">
//                   {desk.map((student: any, i: number) => (
//                     <div
//                       key={i}
//                       className="border border-sky-400 py-1 rounded font-semibold text-sky-700"
//                     >
//                       Symbol No: {student.symbolNo}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handlePrint}
//             className="px-4 py-2 bg-blue-700 text-white rounded"
//           >
//             Print Seat Plan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchoolMarkSheet;
