/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useFilterParentByDate } from "../hooks";

interface Props {
  startDate: string;
  endDate: string;
}

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

const AllPrintFormForParents = ({ startDate, endDate }: Props) => {
  const [params, setParams] = useState("");

  useEffect(() => {
    setParams(
      startDate && endDate
        ? `?startDate=${startDate}&endDate=${endDate}&IsPagination=false`
        : "?IsPagination=false"
    );
  }, [startDate, endDate]);

  const { data: parents } = useFilterParentByDate(params);

  return (
    <div>
      {/* HEADER */}
      <div style={letterHeadStyle}>
        <h2 style={{ margin: 0 }}>List of Parents</h2>
      </div>

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thTd}>S.N</th>
            <th style={thTd}>Parent Name</th>
            <th style={thTd}>Email</th>
            <th style={thTd}>Phone Number</th>
            <th style={thTd}>Occupation</th>
            <th style={thTd}>Address</th>
          </tr>
        </thead>
        <tbody>
          {parents?.Items?.map((p, i) => (
              <tr key={i}>
                <td style={thTd}>{i + 1}</td>
                <td style={thTd}>{p.fullName}</td>
                <td style={thTd}>{p.email}</td>
                <td style={thTd}>{p.phoneNumber}</td>
                <td style={thTd}>{p.occupation}</td>
                <td style={thTd}>{p.address}</td>
              </tr>

            ))}
         
        </tbody>
      </table>
    </div>
  );
};

export default AllPrintFormForParents;
