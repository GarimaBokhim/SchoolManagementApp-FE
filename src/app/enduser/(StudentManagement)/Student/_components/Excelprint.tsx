/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useFilterStudentByDate } from "../hooks";

interface Props {
    startDate: string;
    endDate: string;
}

const ExcelStudentTable = ({ startDate, endDate }: Props) => {
    const [params, setParams] = useState("");

    useEffect(() => {
        setParams(
            startDate && endDate
                ? `?startDate=${startDate}&endDate=${endDate}&IsPagination=false`
                : "?IsPagination=false"
        );
    }, [startDate, endDate]);

    const { data } = useFilterStudentByDate(params);

    if (!data?.Items?.length) return null;

    return (
        <table>
            <thead>
                <tr>
                    <th >S.N</th>
                    <th >Name</th>
                    <th >Reg. No</th>
                    <th>Gender</th>
                    <th >Class</th>
                    <th >Phone</th>
                    <th>DOB</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
                {data.Items.map((p, i) => (
                    <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>
                            {[p.firstName, p.middleName, p.lastName]
                                .filter(Boolean)
                                .join(" ")}
                        </td>
                        <td>{p.registrationNumber}</td>
                        <td>{p.genderStatus}</td>
                        <td>{p.className}</td>
                        <td>{p.phoneNumber}</td>
                        <td>{p.dateOfBirth}</td>
                        <td>{p.address}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ExcelStudentTable;
