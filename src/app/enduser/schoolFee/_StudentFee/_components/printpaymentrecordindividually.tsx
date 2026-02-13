import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import { IPaymentRecord } from "../types/IStudentFee";
import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";

type Props = {
  data: IPaymentRecord;
};

const PaymentReceiptPrint = ({ data }: Props) => {
  const { data: allschool } = useGetAllSchool();
  const { data: allStudent } = useGetAllStudents();
  const { data: allClass } = useGetAllClass();

  // UUID-safe lookup for student and class
  const studentName =
    allStudent?.Items?.find(item => item.id === data.studentid)?.firstName ?? "-";

  const className =
    allClass?.Items?.find(item => item.id === data.classid)?.name ?? "-";

  // Map numeric payment method to readable string
  const paymentMethods: Record<number, string> = {
    0: "Cash",
    1: "Credit Card",
    2: "Debit Card",
    3: "Bank Transfer",
    4: "Mobile Payment",
    5: "Cheque",
  };

  const paymentMethodLabel = paymentMethods[data.paymentMethod] ?? "-";

  const Receipt = ({ label, showSeparator }: { label: string; showSeparator?: boolean }) => (
    <div
      style={{
        borderBottom: showSeparator ? "2px dashed #000" : "none",
        paddingBottom: "15px",
        marginBottom: "15px",
        pageBreakInside: "avoid",
      }}
    >
      <div
        style={{
          textAlign: "center",
          borderBottom: "1px solid #000",
          paddingBottom: "6px",
          marginBottom: "8px",
        }}
      >
        <h3 style={{ margin: 0 }}>{allschool?.Items?.[0]?.name ?? ""}</h3>
        <div>STUDENT PAYMENT RECEIPT ({label})</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span>Date: <b>{data.paymentDate}</b></span>
        <span>Method: <b>{paymentMethodLabel}</b></span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span>Student: <b>{studentName}</b></span>
        <span>Class: <b>{className}</b></span>
      </div>

      <div style={{ marginBottom: "6px" }}>
        Reference: <b>{data.reference || "-"}</b>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #000", padding: "4px" }}>Amount Paid</td>
            <td style={{ border: "1px solid #000", padding: "4px" }}>
              <b>{data.amountPaid}</b>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
        <span>Cashier Signature</span>
        <span>Authorized By</span>
      </div>
    </div>
  );

  return (
    <div
      id={`print-receipt-${data.studentid}-${data.classid}`}
      style={{
        width: "700px",
        border: "1px solid #000",
        padding: "10px",
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Receipt label="ORIGINAL" showSeparator />
      <Receipt label="COPY" />
    </div>
  );
};

export default PaymentReceiptPrint;
