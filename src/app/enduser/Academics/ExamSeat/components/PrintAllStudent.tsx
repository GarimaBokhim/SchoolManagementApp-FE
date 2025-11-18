// import { useGetCompanyById } from "@/modules/admin/Company/hooks";
// import { useEffect, useState } from "react";
// import { useFilterStudentByDate } from "../hooks";
// import DateConverter from "@/components/DatePicker/DateConverter";
// type Props = {
//   startDate: string | null;
//   endDate: string | null;
// };
// const letterHeadStyle = {
//   textAlign: "center" as const,
//   borderBottom: "2px solid #000",
//   paddingBottom: "12px",
//   marginBottom: "32px",
// };

// const companyNameStyle = {
//   fontSize: "28px",
//   fontWeight: "bold",
//   color: "#1e3a8a",
//   marginBottom: "4px",
// };

// const addressStyle = {
//   fontSize: "14px",
//   color: "#444",
//   marginBottom: "4px",
// };
// const PrintAllStudent = ({ startDate, endDate }: Props) => {
//   const dateStyle = {
//     position: "absolute" as const,
//     top: "0",
//     right: "0",
//     fontSize: "14px",
//     color: "#555",
//   };
//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
//   const companyId = localStorage.getItem("companyId");
//   const { data: company } = useGetCompanyById(companyId);
//   const [params, setParams] = useState("");
//   const { data: Student } = useFilterStudentByDate(params || "");
//   useEffect(() => {
//     if (startDate && endDate) {
//       setParams(
//         `?startDate=${encodeURIComponent(
//           startDate
//         )}&endDate=${encodeURIComponent(endDate)}&IsPagination=false`
//       );
//     } else {
//       setParams("?IsPagination=false");
//     }
//   }, [startDate, endDate]);
//   return (
//     <div>
//       <div style={letterHeadStyle}>
//         <div style={dateStyle}>Printed on: {formattedDate}</div>
//         <div style={companyNameStyle}>{company?.name || "Company Name"}</div>
//         <div style={addressStyle}>{company?.address || "Company Address"}</div>
//         <div style={addressStyle}>
//           Email: {company?.email || "Company Email"} | Phone:
//           {company?.contactNumber || "Contact Number"}
//         </div>
//         <div style={addressStyle}>
//           PAN No:{company?.pan || "Company Pan No"}
//         </div>
//       </div>
//       {Student?.Items ? (
//         <div>
//           <table>
//             <thead>
//               <tr>
//                 <th>S.N.</th>
//                 <th>Transaction Date</th>
//                 <th>Total Amount</th>
//                 <th>Narration</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Student.Items.map((item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <DateConverter date={item.transactionDate || ""} />
//                   </td>
//                   <td>{item.totalAmount}</td>
//                   <td>{item.narration}</td>
//                 </tr>
//               ))}
//               <tr></tr>
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         "Loading Data"
//       )}
//     </div>
//   );
// };
// export default PrintAllStudent;
