import { IPaymentRecord } from "../types/IStudentFee";

type Props = {
  data: IPaymentRecord;
};

const containerStyle = {
  width: "700px",
  border: "1px solid #000",
  padding: "10px",
  fontSize: "12px",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  textAlign: "center" as const,
  borderBottom: "1px solid #000",
  paddingBottom: "6px",
  marginBottom: "8px",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "4px",
};

const cell = {
  border: "1px solid #000",
  padding: "4px",
};

const PaymentReceiptPrint = ({ data }: Props) => {
  return (
    <div className="print-only" style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <h3 style={{ margin: 0 }}>Lumbini Academy Pvt. Ltd</h3>
        <div>STUDENT PAYMENT RECEIPT</div>
      </div>

      {/* INFO */}
      <div style={rowStyle}>
        <span>Date: <b>{data.paymentDate}</b></span>
        <span>Method: <b>{data.paymentMethod}</b></span>
      </div>

      <div style={rowStyle}>
        <span>Student ID: <b>{data.studentid}</b></span>
        <span>Class ID: <b>{data.classid}</b></span>
      </div>

      <div style={{ marginBottom: "6px" }}>
        Reference: <b>{data.reference || "-"}</b>
      </div>

      {/* TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={cell}>Amount Paid</td>
            <td style={cell}><b>{data.amountPaid}</b></td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Cashier Signature</span>
        <span>Authorized By</span>
      </div>
    </div>
  );
};

export default PaymentReceiptPrint;
