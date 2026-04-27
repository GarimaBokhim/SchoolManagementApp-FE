# Dashboard & School Fee Modules API Documentation

> Comprehensive API reference for the Dashboard views and School Fee module, detailing endpoints, hooks, request schemas, and TypeScript interfaces.

---

## Table of Contents

1. [Dashboard](#1-dashboard)
2. [School Fee Module](#2-school-fee-module)
   - [2.1 Fee Category](#21-fee-category)
   - [2.2 Fee Type](#22-fee-type)
   - [2.3 Fee Structure](#23-fee-structure)
   - [2.4 Student Fee](#24-student-fee)
3. [Appendix: Common Shared Types](#appendix-common-shared-types)

---

## 1. Dashboard

The Enduser Dashboard primarily aggregates and displays high-level statistics and data from other modules. It does not possess unique `Dashboard` controllers, but rather consumes existing module endpoints to present a unified view.

| Hook | Reused API Endpoint | UI Usage on Dashboard |
|------|---------------------|----------|
| `useGetAllNotices` | `/api/Communication/DisplayNotice` | Displays the "LATEST NOTICES" feed |
| `useGetAllStudents` | `/api/Student/StudentFromRegistration` | Displays the "Total Students" statistic |
| `useGetAllAcademicTeams` | `/api/StaffControllers/all-AcademicTeam` | Displays the "Total Staffs" statistic |
| `useGetAllSchool` | `/api/SetupControllers/all-school` | Displays the "Total Schools" statistic |

*(See respective modules in Part 1 and Part 2 documentation for detailed interfaces regarding these endpoints.)*

---

## 2. School Fee Module

### 2.1 Fee Category

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllFeeCategories` | `GET` | `/api/Finance/FeeCategory` | Fee category list table |
| `useAddFeeCategory` | `POST` | `/api/Finance/AddFeeCategory` | Add fee category form |
| `useEditFeeCategory` | `PATCH` | `/api/Finance/UpdateFeeCategory/{id}` | Edit fee category form |
| `useRemoveFeeCategory` | `DELETE` | `/api/Finance/DeleteFeeCategory/{Id}` | Delete fee category button |
| `useFilterFeeCategoryByDate` | `GET` | `/api/Finance/FilterFeeCategory` | Date filter |

**Interface (`IFeeCategory`):**
```ts
{
  id?: string;
  name: string;
  description: string;
  fyId: string;
  isActive: boolean;
  schoolId?: string;
}
```

---

### 2.2 Fee Type

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllFeeTypes` | `GET` | `/api/Finance/Feetype` | Fee type list table |
| `useGetFeeTypeById` | `GET` | `/api/Finance/Feetype/{id}` | Edit form prefill |
| `useAddFeeType` | `POST` | `/api/Finance/AddFeetype` | Add fee type form |
| `useEditFeeType` | `PATCH` | `/api/Finance/UpdateFeeType/{id}` | Edit fee type form |
| `useRemoveFeeType` | `DELETE` | `/api/Finance/DeleteFeeType/{Id}` | Delete fee type button |
| `useFilterFeeTypeByDate` | `GET` | `/api/Finance/FilterFeetype` | Date filter |

**Interface (`IFeeType`):**
```ts
{
  id?: string;
  name: string;
  description: string;
  nameOfMonths: number;
}
```

---

### 2.3 Fee Structure

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllFeeStructure` | `GET` | `/api/Finance/FeeStructure` | Fee structure list table |
| `useGetFeeStructureById` | `GET` | `/api/Finance/FeeStructure/{id}` | Edit form prefill |
| `useGetFeeStructureByClassId` | `GET` | `/api/Finance/FeeStructureByClass?classId=` | Fee structures dropdown by class |
| `useAddFeeStructure` | `POST` | `/api/Finance/AddFeeStructure` | Add fee structure form |
| `useEditFeeStructure` | `PATCH` | `/api/Finance/UpdateFeeStructure/{id}` | Edit fee structure form |
| `useRemoveFeeStructure` | `DELETE` | `/api/Finance/DeleteFeeStructure/{Id}` | Delete fee structure button |
| `useFilterFeeStructureByDate` | `GET` | `/api/Finance/FilterFeeStructure` | Date filter |

**Interface (`IFeeStructure`):**
```ts
{
  id?: string;
  classId: string;
  feeCategoryId: string;
  feeCategoryName?: string;
  feeStructureDTOs: IFeeStructureDTO[];
  totalAmount?: number;
  discountAmount?: number;
  isActive?: boolean;
}
```

**Interface (`IFeeStructureDTO`):**
```ts
{
  id?: string;
  feeTypeId: string;
  amount: number;
  discountAmount: number;
  times: number;
  totalAmount: number;
  feePaidType: number;
  discountPercentage?: number;
  feeTypeName?: string;
}
```

**Enums:**
```ts
enum FeePaidType {
  OneTime = 1,
  Monthly = 2,
  Quarterly = 3,
  Yearly = 4,
  Semester = 5
}

enum NameOfMonthsEnum {
  Baisakh = 1, Jestha, Ashadh, Shrawan, Bhadra, Ashwin,
  Kartik, Mangsir, Poush, Magh, Falgun, Chaitra,
}
```

---

### 2.4 Student Fee

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllStudentFees` | `GET` | `/api/Finance/StudentFee` | Student fee list table |
| `useAddStudentFee` | `POST` | `/api/Finance/AddStudentFee` | Add/Assign student fee form |
| `useEditStudentFee` | `PATCH` | `/api/Finance/UpdateStudentFee/{id}` | Edit student fee |
| `useRemoveStudentFee` | `DELETE` | `/api/Finance/DeleteStudentFees/{Id}` | Delete student fee |
| `useFilterStudentFeeByDate` | `GET` | `/api/Finance/FilterStudentFee` | Date filter |
| `useGetFeeStructureByClassId` | `GET` | `/api/Finance/FeeStructureByClass?classId=` | Fee structure dropdown for assignment |
| `useAddPaymentRecord` | `POST` | `/api/Finance/AddPaymentsRecords` | Record a new payment |
| `useGetStudentFeesummary` | `GET` | `/api/Finance/StudentFeeSummary` | Display fee summary and due balances |

**Interface (`IStudentFee`):**
```ts
{
  id?: string;
  Id?: string;
  studentId: string;
  feeStructureId: string | string[];
  classId: string;
  discountPercentage: number;
  studentFeeDetailsDTOs: IStudentFeeDetails[];
}
```

**Interface (`IStudentFeeDetails`):**
```ts
{
  id?: string;
  feeTypeId: string;
  discountAmount: number;
  amount: number;
  times: number;
  totalAmount: number;
  feePaidType: number;
}
```

**Interface (`IPaymentRecord`):**
```ts
{
  id?: string;
  studentid: string;
  classid: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: number;
  reference: string;
  receiptNumber?: string;
  dueAmount?: number;
}
```

**Interface (`Istudentfeesummary`):**
```ts
{
  studentId: string;
  paymentDate: string;
  classId: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  reference: string;
  paymentMethod: number;
}
```

---

## Appendix: Common Shared Types

### Pagination Response (`IPaginationResponse<T>`)

All paginated `GET` endpoints return this wrapper:

```ts
interface IPaginationResponse<T> {
  Items: T[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}
```
