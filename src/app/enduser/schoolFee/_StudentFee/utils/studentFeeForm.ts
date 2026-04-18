import { IStudentFee, IStudentFeeDetails } from "../types/IStudentFee";

export function feeStructureIdToString(
  v: string | string[] | undefined
): string {
  if (v == null) return "";
  return Array.isArray(v) ? v[0] ?? "" : v;
}

function normalizeDetail(d: unknown): IStudentFeeDetails {
  const x = d as Record<string, unknown>;
  const idVal = x.id ?? x.Id;
  const base: IStudentFeeDetails = {
    feeTypeId: String(x.feeTypeId ?? x.FeeTypeId ?? ""),
    discountAmount: Number(x.discountAmount ?? x.DiscountAmount ?? 0),
    amount: Number(x.amount ?? x.Amount ?? 0),
    times: Number(x.times ?? x.Times ?? 1),
    totalAmount: Number(x.totalAmount ?? x.TotalAmount ?? 0),
    feePaidType: Number(x.feePaidType ?? x.FeePaidType ?? 1),
  };
  if (idVal != null && String(idVal) !== "") {
    base.id = String(idVal);
  }
  return base;
}


export function normalizeStudentFeeRowForEdit(
  row: IStudentFee & { id?: string; Id?: string }
): IStudentFee & { id: string } {
  const r = row as unknown as Record<string, unknown>;
  const id = String(row.id ?? row.Id ?? r.Id ?? "");
  const studentId = String(row.studentId ?? r.StudentId ?? "");
  const classId = String(row.classId ?? r.ClassId ?? "");
  const fsRaw = row.feeStructureId ?? r.FeeStructureId;
  const discountPercentage = Number(
    row.discountPercentage ?? r.DiscountPercentage ?? 0
  );
  const rawDetails =
    row.studentFeeDetailsDTOs ??
    (r.StudentFeeDetailsDTOs as IStudentFeeDetails[] | undefined) ??
    [];
  const studentFeeDetailsDTOs = (Array.isArray(rawDetails) ? rawDetails : []).map(
    normalizeDetail
  );

  return {
    id,
    studentId,
    classId,
    feeStructureId:
      typeof fsRaw === "string" || Array.isArray(fsRaw)
        ? fsRaw
        : String(fsRaw ?? ""),
    discountPercentage,
    studentFeeDetailsDTOs,
  };
}
