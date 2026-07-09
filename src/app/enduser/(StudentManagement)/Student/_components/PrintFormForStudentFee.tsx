/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useFilterStudentByDate } from "../hooks";



type Props = {
  startDate: string;
  endDate: string;
};

const letterHeadStyle = {
  textAlign: "center" as const,
  borderBottom: "1px solid #000",
  paddingBottom: "6px",
  marginBottom: "6px",
};

const thTd = {
  border: "1px solid #000",
  padding: "4px",
  fontSize: "12px",
};

const AllPrintFormForStudents = ({ startDate, endDate }: Props) => {
  const [params, setParams] = useState("");

  useEffect(() => {
    setParams(
      startDate && endDate
        ? `?startDate=${startDate}&endDate=${endDate}&IsPagination=false`
        : "?IsPagination=false"
    );
  }, [startDate, endDate]);

  const { data: students } = useFilterStudentByDate(params);
  const { data: allClass } = useGetAllClass();

  return (
    <div>
      {/* HEADER */}
      <div style={letterHeadStyle}>
        <h2 style={{ margin: 0 }}>List of Students</h2>
      </div>

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thTd}>S.N</th>
            <th style={thTd}>Name</th>
            <th style={thTd}>Reg. No</th>
            <th style={thTd}>Gender</th>
            <th style={thTd}>Class</th>
            <th style={thTd}>Phone</th>
            <th style={thTd}>DOB</th>
            <th style={thTd}>Address</th>
          </tr>
        </thead>
        <tbody>
          {students?.Items?.map((s, i) => (
            <tr key={i}>
              <td style={thTd}>{i + 1}</td>
              <td style={thTd}>{s.firstName}</td>
              <td style={thTd}>{s.registrationNumber}</td>
              <td style={thTd}>{s.genderStatus === 0 ? "Male" : "Female"}</td>
              <td style={thTd}>
                {allClass?.Items?.find(c => c.id === s.classId)?.name}
              </td>
              <td style={thTd}>{s.phoneNumber}</td>
              <td style={thTd}>
                {s.dateOfBirth?.split("T")[0] ?? ""}
              </td>
              <td style={thTd}>{s.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default AllPrintFormForStudents;
