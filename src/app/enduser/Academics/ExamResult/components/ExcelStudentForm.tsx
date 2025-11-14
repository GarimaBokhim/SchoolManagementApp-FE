// import DateConverter from "@/components/DatePicker/DateConverter";
// import { useGetAllStudents } from "../hooks";
// const ExcelStudentForm = () => {
//   const { data: Student } = useGetAllStudents();
//   console.log(Student);
//   return (
//     <div>
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
// export default ExcelStudentForm;
