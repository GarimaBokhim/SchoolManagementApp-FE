/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useFilterParentByDate } from "../hooks";

interface Props {
  startDate: string;
  endDate: string;
}

const ExcelParentTable = ({ startDate, endDate }: Props) => {
  const [params, setParams] = useState("");

  useEffect(() => {
    setParams(
      startDate && endDate
        ? `?startDate=${startDate}&endDate=${endDate}&IsPagination=false`
        : "?IsPagination=false"
    );
  }, [startDate, endDate]);

  const { data } = useFilterParentByDate(params);

  if (!data?.Items?.length) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>S.N</th>
          <th>Parent Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Occupation</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {data.Items.map((p, i) => (
          <tr key={p.id}>
            <td>{i + 1}</td>
            <td>{p.fullName}</td>
            <td>{p.email}</td>
            <td>{p.phoneNumber}</td>
            <td>{p.occupation}</td>
            <td>{p.address}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExcelParentTable;
