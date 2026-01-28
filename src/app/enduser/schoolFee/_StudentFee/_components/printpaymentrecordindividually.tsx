import { useEffect } from "react";
import { IPaymentRecord } from "../types/IStudentFee";

type Props = {
  data: IPaymentRecord;
};

const PaymentReceiptPrint = ({ data }: Props) => {
  return (
    <div
      id={`print-receipt-${data.studentid}-${data.classid}`}
      className="print-only"
      style={{
        width: "700px",
        border: "1px solid #000",
        padding: "10px",
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", borderBottom: "1px solid #000", paddingBottom: "6px", marginBottom: "8px" }}>
        <h3 style={{ margin: 0 }}>Lumbini Academy Pvt. Ltd</h3>
        <div>STUDENT PAYMENT RECEIPT</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span>Date: <b>{data.paymentDate}</b></span>
        <span>Method: <b>{data.paymentMethod}</b></span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span>Student ID: <b>{data.studentid}</b></span>
        <span>Class ID: <b>{data.classid}</b></span>
      </div>

      <div style={{ marginBottom: "6px" }}>Reference: <b>{data.reference || "-"}</b></div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #000", padding: "4px" }}>Amount Paid</td>
            <td style={{ border: "1px solid #000", padding: "4px" }}><b>{data.amountPaid}</b></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
        <span>Cashier Signature</span>
        <span>Authorized By</span>
      </div>
    </div>
  );
};


export default PaymentReceiptPrint;
