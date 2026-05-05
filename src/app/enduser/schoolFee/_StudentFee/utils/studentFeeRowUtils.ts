import { IStudentFeeDetails } from "../types/IStudentFee";


export interface ExistingRowResult {
  row: IStudentFeeDetails;
  index: number;
  isAutoRow: boolean;
}

export const findExistingFeeTypeRow = (
  feeTypeId: string,
  autoRows: IStudentFeeDetails[],
  manualRows: IStudentFeeDetails[]
): ExistingRowResult | null => {
  // Check in auto rows (read-only rows)
  const autoIndex = autoRows.findIndex(row => row.feeTypeId === feeTypeId);
  if (autoIndex !== -1) {
    return { row: autoRows[autoIndex], index: autoIndex, isAutoRow: true };
  }
  
  // Check in manual rows
  const manualIndex = manualRows.findIndex(row => row.feeTypeId === feeTypeId);
  if (manualIndex !== -1) {
    return { row: manualRows[manualIndex], index: manualIndex, isAutoRow: false };
  }
  
  return null;
};

export const mergeFeeTypeIntoExistingRow = (
  existingRow: IStudentFeeDetails,
  newData: Partial<IStudentFeeDetails>,
  discountPercentage: number
): IStudentFeeDetails => {
  // Merge the amounts and times
  const mergedAmount = (existingRow.amount || 0) + (newData.amount || 0);
  const mergedTimes = (existingRow.times || 1) + (newData.times || 1);
  
  // Calculate new totals with discount
  const subtotal = mergedAmount * mergedTimes;
  const discountAmount = subtotal * (discountPercentage / 100);
  const totalAmount = subtotal - discountAmount;
  
  return {
    ...existingRow,
    amount: mergedAmount,
    times: mergedTimes,
    discountAmount,
    totalAmount,
  };
};

export const validateDuplicateFeeType = (
  feeTypeId: string,
  currentRowIndex: number,
  autoRows: IStudentFeeDetails[],
  manualRows: IStudentFeeDetails[]
): { isValid: boolean; errorMessage?: string; existingRow?: ExistingRowResult } => {
  if (!feeTypeId) {
    return { isValid: true };
  }
  
  const existingRow = findExistingFeeTypeRow(feeTypeId, autoRows, manualRows);
  
  if (existingRow && existingRow.index !== currentRowIndex) {
    if (existingRow.isAutoRow) {
      return {
        isValid: false,
        errorMessage: "This fee type is already mapped in the auto-populated fee structure and cannot be modified.",
        existingRow,
      };
    }
    return {
      isValid: false,
      errorMessage: "This fee type already exists. The amounts will be merged with the existing row.",
      existingRow,
    };
  }
  
  return { isValid: true };
};