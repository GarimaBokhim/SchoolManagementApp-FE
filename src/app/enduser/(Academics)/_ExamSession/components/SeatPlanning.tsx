import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  IHallResponses,
  ISeatPlanning,
  IStudentSeatResponses,
} from "../types/IExamSession";
import { useGetAllClass } from "../../Class/hooks";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";
import { useGenerateSeatPlanning, useGetClassByExamSessionId } from "../hooks";
import toast from "react-hot-toast";

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
  const [halls, setHalls] = useState<IHallResponses[]>();
  const [data, setData] = useState<ISeatPlanning>();
  useEffect(() => {
    if (!assignedData?.Items || assignedData.Items.length === 0) return;
    const run = async () => {
      try {
        const result = await toast.promise(
          generateSeatPlanning.mutateAsync({
            examSessionId,
            classIds: assignedData.Items[0].classIds,
          }),
          {
            loading: "Generating Seat Planning...",
            success: "Successfully Generated Seat Planning",
          }
        );
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [assignedData]);
  useEffect(() => {
    if (data?.hallSeatResponses) {
      setHalls(data?.hallSeatResponses ?? []);
    }
  });

  const handlePrint = () => {
    const content = document.getElementById("seatplan-content")?.outerHTML;
    if (!content) return;

    const printWindow = window.open("", "", "width=900,height=1000");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Seat Plan</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white w-[95%] max-w-5xl p-4 rounded shadow relative">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Generated Seat Plan</h2>
          <button onClick={onClose} className="text-red-500">
            <X />
          </button>
        </div>
        <div className=" flex items-center justify-center ">
          <div>
            <h1 className="text-2xl font-bold">{SchoolData?.name}</h1>
            <p className="text-sm">{SchoolData?.address}</p>
          </div>
        </div>
        <div id="seatplan-content" className="space-y-6">
          <h1 className="text-2xl font-bold text-center uppercase">
            Exam Seat Plan
          </h1>
          {halls && halls.length > 0 ? (
            halls.map((hall: IHallResponses, index: number) => (
              <div key={index} className="border border-gray-400 p-4 rounded">
                <h2 className="text-lg font-bold mb-3">
                  Hall: {hall.hallName} (Capacity: {hall.capaCity}) <br />
                  Total Students: {data?.totalStudents}
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  {hall.studentSeatResponses.map(
                    (st: IStudentSeatResponses, i: number) => (
                      <div
                        key={i}
                        className="border border-sky-600 p-3 rounded shadow"
                      >
                        <div className="font-semibold text-sky-700">
                          {st.studentName}
                        </div>
                        <div>Symbol No: {st.symbolNumber}</div>
                        <div>
                          Class:{" "}
                          {
                            allClass?.Items?.find((i) => i.id === st.classId)
                              ?.name
                          }
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>No seat planning found</div>
          )}
        </div>

        <div className="text-right mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-700 text-white rounded"
          >
            Print Seat Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatPlanning;
