"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import {
  IHallResponses,
  ISeatPlanning,
  IStudentSeatResponses,
} from "../types/IExamSession";
import { useGetAllClass } from "../../Class/hooks";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";
import {
  useGenerateSeatPlanning,
  useGetClassByExamSessionId,
} from "../hooks";

interface Props {
  examSessionId: string;
  onClose: () => void;
  schoolId: string;
}

const SeatPlanning: React.FC<Props> = ({
  examSessionId,
  onClose,
  schoolId,
}) => {
  const { data: allClass } = useGetAllClass();
  const { data: SchoolData } = useGetSchoolById(schoolId);
  const { data: assignedData } = useGetClassByExamSessionId(examSessionId);
  const generateSeatPlanning = useGenerateSeatPlanning();
  const [data, setData] = useState<ISeatPlanning>();
  const [halls, setHalls] = useState<IHallResponses[]>([]);
  const [rows, setRows] = useState<number>(5);
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    if (!assignedData?.Items?.length) return;

    const run = async () => {
      try {
        const result = await toast.promise(
          generateSeatPlanning.mutateAsync({
            examSessionId,
            classIds: assignedData.Items[0].classIds,
          }),
          {
            loading: "Generating Seat Planning...",
            success: "Seat Planning Generated",
          }
        );

        setData(result);
        setHalls(result?.hallSeatResponses ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [assignedData]);

const handlePrint = () => {
  const content = document.getElementById("seatplan-content");
  if (!content) return;

  // Clone the content so we don't mutate the live DOM
  const clonedContent = content.cloneNode(true) as HTMLElement;

  // Create print window
  const printWindow = window.open("", "", "width=1200,height=800");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Seat Plan</title>
        <link href="https://cdn.tailwindcss.com" rel="stylesheet">
        <style>
          /* Force print to show full width */
          body { margin: 0; padding: 1rem; }
          .grid { display: grid !important; }
          .gap-3 { gap: 0.75rem !important; }
          /* You can add more overrides if needed */
        </style>
      </head>
      <body>
        ${clonedContent.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for styles to load before printing
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
};

return (
  <div
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
    onClick={onClose} 
  >
    <div
      className="relative w-[100%] h-screen bg-white dark:bg-[#353535] overflow-auto rounded-none p-6"
     
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-xl font-bold">Generated Seat Plan</h2>
        <button
          onClick={onClose}
          className="text-red-500 rounded-full p-2 hover:bg-gray-100"
        >
          <X size={24} />
        </button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{SchoolData?.name}</h1>
        <p className="text-sm text-gray-500">{SchoolData?.address}</p>
      </div>
      <div className="flex justify-center gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-600">
            Rows
          </label>
          <input
            type="number"
            min={1}
            value={rows || ""}
            onChange={(e) => setRows(Number(e.target.value))}
            className="border rounded-md px-3 py-2 w-24 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600">
            Columns
          </label>
          <input
            type="number"
            min={1}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="border rounded-md px-3 py-2 w-24 text-sm"
          />
        </div>
      </div>

      <div id="seatplan-content" className="space-y-6">
        {halls.map((hall, index) => (
          <div key={index} className="border border-gray-300 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">
              Hall: {hall.hallName} (Capacity: {hall.capaCity})
            </h3>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {hall.studentSeatResponses
                .slice(0, rows * columns)
                .map((st, i) => (
                  <div
                    key={i}
                    className="border border-sky-500 p-2 rounded shadow-sm text-sm"
                  >
                    <div className="font-semibold text-sky-700">
                      {st.studentName}
                    </div>
                    <div>Symbol: {st.symbolNumber}</div>
                    <div>
                      Class:{" "}
                      {allClass?.Items?.find((c) => c.id === st.classId)?.name}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-4 border-t pt-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Print
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);


};

export default SeatPlanning;
