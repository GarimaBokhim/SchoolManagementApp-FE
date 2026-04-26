# School Management App - API Documentation (Part 2)

> Covers: Staff, Accountings, School Fee, Certificate, Miscellaneous, Notice, Reports, and Teacher modules.

---

## 5. Enduser - Staff Module

### 5.1 Academic Staff

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllAcademicTeams` | `GET` | `/api/StaffControllers/all-AcademicTeam` | Staff list table |
| `useGetAcademicTeamById` | `GET` | `/api/StaffControllers/GetAcademicTeamsBy/{id}` | Edit form prefill |
| `useAddAcademicTeam` | `POST` | `/api/StaffControllers/AddAcademicTeam` | Add staff form (multipart) |
| `useEditAcademicTeam` | `PATCH` | `/api/StaffControllers/UpdateAcademicTeams/{id}` | Edit staff form |
| `useRemoveAcademicTeam` | `DELETE` | `/api/StaffControllers/DeleteAcademicTeams/{Id}` | Delete button |
| `useFilterAcademicTeamByDate` | `GET` | `/api/StaffControllers/FilterAcademicTeam` | Date filter |
| `useAssignClass` | `POST` | `/api/StaffControllers/AssignClass` | Assign class to teacher |
| `useUnassignClass` | `POST` | `/api/StaffControllers/UnAssignClass` | Unassign class |
| `useGetAssignClassDetails` | `GET` | `/api/StaffControllers/AssignClassDetails` | View assigned classes |

**Interface (`IAcademicTeam`):**
```ts
{
  id?: string; email: string; username: string; password: string;
  fullName: string; teacherImg: File; address: string;
  provinceId: number; districtId: number; vdcid: number;
  municipalityId: number; wardNumber: number; gender: number; rolesId: string[];
}
```

**Interface (`IAssignClass`):**
```ts
{ academicTeamId: string; subjectIds: string[]; ClassIds: string[]; }
```

---

## 6. Enduser - Accountings Module

### 6.1 Chart of Account

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetChartOfAccount` | `GET` | `/api/AccountControllers/ChartOfAccounts` | Chart of accounts tree view |

**Interface (`IChart`):**
```ts
{
  id: string; name: string; balance: number; balanceType: string;
  ledgerGroupResponses: ILedgerGroupResponse[];
}
// ILedgerGroupResponse → ISubLedgerGroupResponse → ILedgerResponse (nested tree)
```

---

### 6.2 Master

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllMaster` | `GET` | `/api/AccountControllers/all-master` | Master list/dropdown |
| `useGetMasterByMaster` | `GET` | `/api/AccountControllers/Master/{Id}` | Master detail |

**Interface (`IMaster`):**
```ts
{ id: string; Name: string; }
```

---

### 6.3 Ledger Group

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllLedgerGroups` | `GET` | `/api/AccountControllers/all-ledgerGroup` | Ledger group list |
| `useGetLedgerGroupById` | `GET` | `/api/AccountControllers/LedgerGroup/{id}` | Edit prefill |
| `useAddLedgerGroup` | `POST` | `/api/AccountControllers/AddLedgerGroup` | Add form |
| `useEditLedgerGroup` | `PATCH` | `/api/AccountControllers/UpdateLedgerGroup/{id}` | Edit form |
| `useRemoveLedgerGroup` | `DELETE` | `/api/AccountControllers/DeleteLedgerGroup/{Id}` | Delete |
| `useFilterLedgerGroupByDate` | `GET` | `/api/AccountControllers/GetFilterLedgerGroup` | Date filter |

**Interface (`ILedgerGroup`):**
```ts
{ id?: string; name: string; isCustom?: boolean; isSeeded?: boolean; masterId: string; isPrimary?: boolean; }
```

---

### 6.4 Sub Ledger Group

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllSubLedgerGroups` | `GET` | `/api/AccountControllers/all-subLedgerGroup` | SubLedger group list |
| `useGetSubLedgerGroupById` | `GET` | `/api/AccountControllers/SubLedgerGroup/{id}` | Edit prefill |
| `useAddSubLedgerGroup` | `POST` | `/api/AccountControllers/AddSubledgerGroup` | Add form |
| `useEditSubLedgerGroup` | `PATCH` | `/api/AccountControllers/UpdateSubLedgerGroup/{id}` | Edit form |
| `useRemoveSubLedgerGroup` | `DELETE` | `/api/AccountControllers/DeleteSubLedgerGroup/{Id}` | Delete |
| `useFilterSubLedgerGroupByDate` | `GET` | `/api/AccountControllers/FilterSubLedgerGroup` | Date filter |

**Interface (`ISubLedgerGroup`):**
```ts
{ id?: string; name: string; isSeeded?: boolean; ledgerGroupId: string; }
```

---

### 6.5 Ledger

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllLedgers` | `GET` | `/api/AccountControllers/all-ledger` | Ledger list |
| `useGetLedgerById` | `GET` | `/api/AccountControllers/Ledger/{id}` | Edit prefill |
| `useGetLedgerBalance` | `GET` | `/api/AccountControllers/LedgerBalance/{id}` | Balance display |
| `useGetLedgerByLedgerGroupId` | `GET` | `/api/AccountControllers/LedgerByLedgerGroupId/{Id}` | Ledgers under group |
| `useGetLedgerGroupByLedgerGroupId` | `GET` | `/api/AccountControllers/LedgerGroup/{Id}` | Group detail |
| `useGetAllFilteredLedgerGroup` | `GET` | `/api/AccountControllers/FilterLedgerBySelectedLedgerGroup` | Filtered ledger dropdown |
| `useAddLedger` | `POST` | `/api/AccountControllers/AddLedger` | Add form |
| `useEditLedger` | `PATCH` | `/api/AccountControllers/UpdateLedger/{id}` | Edit form |
| `useRemoveLedger` | `DELETE` | `/api/AccountControllers/DeleteLedger/{Id}` | Delete |
| `useUploadLedgers` | `POST` | `/api/AccountControllers/upload-ledger` | Excel upload |
| `useFilterLedgersByDate` | `GET` | `/api/AccountControllers/GetFilterLedger` | Date filter |

**Interface (`ILedgers`):**
```ts
{
  id?: string; name: string; address?: string; panNo?: string;
  balance?: number; balanceType?: string; phoneNumber?: string;
  maxCreditPeriod?: string; maxDuePeriod?: string; isSeeded?: boolean;
  subledgerGroupId: string; openingBalance?: number | null;
}
```

**Interface (`ILedgerBalance`):**
```ts
{ ledgerId: string; balance: number; balanceType: string; }
```

---

### 6.6 Journal

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllJournals` | `GET` | `/api/AccountControllers/all-journal-entry` | Journal list |
| `useGetJournalById` | `GET` | `/api/AccountControllers/Journal/{id}` | Edit prefill |
| `useAddJournal` | `POST` | `/api/AccountControllers/AddJournal` | Add journal form |
| `useEditJournal` | `PATCH` | `/api/AccountControllers/UpdateJournalEntry/{id}` | Edit journal |
| `useRemoveJournal` | `DELETE` | `/api/AccountControllers/DeleteJournalEntry/{Id}` | Delete |
| `useFilterJournalByDate` | `GET` | `/api/AccountControllers/FilterJournalByDate` | Date filter |
| `useGetJournalRefByCompany` | `GET` | `/api/Settings/GetJournalRefByCompany/{CompanyId}` | Reference number setting |
| `useUpdateJournalRefByCompany` | `PATCH` | `/api/Settings/UpdateJournalRefByCompany/{id}` | Update ref number setting |

**Interface (`IJournal`):**
```ts
{
  id?: string; referenceNumber?: string; transactionDate: string;
  description: string; journalEntries?: AddJournalEntryDetail[];
}
```

**Interface (`AddJournalEntryDetail`):**
```ts
{ type: string; id?: string; ledgerId: string; debitAmount: number; creditAmount: number; }
```

---

## 7. Enduser - School Fee Module

### 7.1 Fee Category

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllFeeCategories` | `GET` | `/api/Finance/FeeCategory` | Fee category list |
| `useAddFeeCategory` | `POST` | `/api/Finance/AddFeeCategory` | Add form |
| `useEditFeeCategory` | `PATCH` | `/api/Finance/UpdateFeeCategory/{id}` | Edit form |
| `useRemoveFeeCategory` | `DELETE` | `/api/Finance/DeleteFeeCategory/{Id}` | Delete |
| `useFilterFeeCategoryByDate` | `GET` | `/api/Finance/FilterFeeCategory` | Date filter |

**Interface (`IFeeCategory`):**
```ts
{
  id?: string; name: string; description: string; fyId: string;
  isActive: boolean; schoolId?: string;
}
```

---

### 7.2 Fee Type

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllFeeTypes` | `GET` | `/api/Finance/Feetype` | Fee type list |
| `useGetFeeTypeById` | `GET` | `/api/Finance/Feetype/{id}` | Edit prefill |
| `useAddFeeType` | `POST` | `/api/Finance/AddFeetype` | Add form |
| `useEditFeeType` | `PATCH` | `/api/Finance/UpdateFeeType/{id}` | Edit form |
| `useRemoveFeeType` | `DELETE` | `/api/Finance/DeleteFeeType/{Id}` | Delete |
| `useFilterFeeTypeByDate` | `GET` | `/api/Finance/FilterFeetype` | Date filter |

**Interface (`IFeeType`):**
```ts
{ id?: string; name: string; description: string; nameOfMonths: number; }
```

---

### 7.3 Fee Structure

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllFeeStructure` | `GET` | `/api/Finance/FeeStructure` | Fee structure list |
| `useGetFeeStructureById` | `GET` | `/api/Finance/FeeStructure/{id}` | Edit prefill |
| `useGetFeeStructureByClassId` | `GET` | `/api/Finance/FeeStructureByClass?classId=` | Structures by class |
| `useAddFeeStructure` | `POST` | `/api/Finance/AddFeeStructure` | Add form |
| `useEditFeeStructure` | `PATCH` | `/api/Finance/UpdateFeeStructure/{id}` | Edit form |
| `useRemoveFeeStructure` | `DELETE` | `/api/Finance/DeleteFeeStructure/{Id}` | Delete |
| `useFilterFeeStructureByDate` | `GET` | `/api/Finance/FilterFeeStructure` | Date filter |

**Interface (`IFeeStructure`):**
```ts
{
  id?: string; classId: string; feeCategoryId: string; feeCategoryName?: string;
  feeStructureDTOs: IFeeStructureDTO[]; totalAmount?: number;
  discountAmount?: number; isActive?: boolean;
}
```

**Interface (`IFeeStructureDTO`):**
```ts
{
  id?: string; feeTypeId: string; amount: number; discountAmount: number;
  times: number; totalAmount: number; feePaidType: number;
  discountPercentage?: number; feeTypeName?: string;
}
```

**Enums:**
```ts
enum FeePaidType { OneTime = 1, Monthly = 2, Quarterly = 3, Yearly = 4, Semester = 5 }
enum NameOfMonthsEnum {
  Baisakh = 1, Jestha, Ashadh, Shrawan, Bhadra, Ashwin,
  Kartik, Mangsir, Poush, Magh, Falgun, Chaitra,
}
```

---

### 7.4 Student Fee

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllStudentFees` | `GET` | `/api/Finance/StudentFee` | Student fee list |
| `useAddStudentFee` | `POST` | `/api/Finance/AddStudentFee` | Add student fee form |
| `useEditStudentFee` | `PATCH` | `/api/Finance/UpdateStudentFee/{id}` | Edit student fee |
| `useRemoveStudentFee` | `DELETE` | `/api/Finance/DeleteStudentFees/{Id}` | Delete |
| `useFilterStudentFeeByDate` | `GET` | `/api/Finance/FilterStudentFee` | Date filter |
| `useGetFeeStructureByClassId` | `GET` | `/api/Finance/FeeStructureByClass?classId=` | Fee structure dropdown |
| `useAddPaymentRecord` | `POST` | `/api/Finance/AddPaymentsRecords` | Record payment |
| `useGetStudentFeesummary` | `GET` | `/api/Finance/StudentFeeSummary` | Fee summary view |

**Interface (`IStudentFee`):**
```ts
{
  id?: string; Id?: string; studentId: string; feeStructureId: string | string[];
  classId: string; discountPercentage: number;
  studentFeeDetailsDTOs: IStudentFeeDetails[];
}
```

**Interface (`IStudentFeeDetails`):**
```ts
{
  id?: string; feeTypeId: string; discountAmount: number;
  amount: number; times: number; totalAmount: number; feePaidType: number;
}
```

**Interface (`IPaymentRecord`):**
```ts
{
  id?: string; studentid: string; classid: string; amountPaid: number;
  paymentDate: string; paymentMethod: number; reference: string;
  receiptNumber?: string; dueAmount?: number;
}
```

**Interface (`Istudentfeesummary`):**
```ts
{
  studentId: string; paymentDate: string; classId: string;
  totalAmount: number; paidAmount: number; dueAmount: number;
  reference: string; paymentMethod: number;
}
```

---

## 8. Enduser - Certificate Module

### 8.1 Certificate Template

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllTemplate` | `GET` | `/api/Certificate/all-certificateTemplate` | Template list |
| `useGetTemplateById` | `GET` | `/api/Certificate/CertificateTemplate/{id}` | Edit prefill |
| `useAddTemplate` | `POST` | `/api/Certificate/AddCertificateTemplate` | Add template |
| `useEditTemplate` | `PATCH` | `/api/Certificate/UpdateCertificateTemplate/{id}` | Edit template |
| `useRemoveTemplate` | `DELETE` | `/api/Certificate/Delete/{Id}` | Delete |
| `useFilterTemplateByDate` | `GET` | `/api/Certificate/FilterCertificateTemplate` | Date filter |

**Interface (`ITemplate`):**
```ts
{
  id?: string; templateName: string; templateType: string;
  templateSubject: string; htmlTemplate: string; templateVersion: string;
}
```

---

### 8.2 Issued Certificate

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllIssuedCertificate` | `GET` | `/api/Certificate/all-issuedCertificate` | Issued cert list |
| `useGetIssuedCertificateById` | `GET` | `/api/Certificate/IssuedCertificateById/{id}` | Edit prefill |
| `useAddIssuedCertificate` | `POST` | `/api/Certificate/AddIssuedCertificate` | Issue certificate |
| `useEditIssuedCertificate` | `PATCH` | `/api/Certificate/UpdateIssuedCertificate/{id}` | Edit issued cert |
| `useRemoveIssuedCertificate` | `DELETE` | `/api/Certificate/DeleteIssuedCertificate/{Id}` | Delete |
| `useFilterIssuedCertificateByDate` | `GET` | `/api/Certificate/FilterIssuedCertificate` | Date filter |
| `useGenerateCertificateByStudent` | `GET` | `/api/Certificate/GenerateCertificateByStudent?studentId=&examId=` | Generate certificate |

**Interface (`IIssuedCertificate`):**
```ts
{
  id?: string; templateId: string; studentId: string; certificateNumber: string;
  issuedDate: Date; issuedBy: string; pdfPath: string; remarks: string;
  status: number; yearOfCompletion: Date; program: string;
  examId?: string; symbolNumber: string;
}
```

**Interface (`ICertificate` - generated):**
```ts
{
  fullName: string; parentsName: string; provinceId: string; districtId: string;
  wardNumber: number; certificateProgram: string; yearOfCompletion: Date;
  percentage: string; division: string; dateOfBirth: Date; symbolNumber: string;
  registrationNumber: string; dateOfIssue: Date; StudentImage: string;
}
```

---

### 8.3 School Award

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useFilterSchoolAwardByDate` | `GET` | `/api/Certificate/FilterSchoolAwards` | Award list |
| `useGetSchoolAwardById` | `GET` | `/api/Certificate/SchoolAwards/{id}` | Award detail |
| `useAddSchoolAward` | `POST` | `/api/Certificate/AddSchoolsAwards` | Add award |
| `useRemoveSchoolAward` | `DELETE` | `/api/Certificate/DeleteSchoolAwards/{Id}` | Delete |

**Interface (`ISchoolAward`):**
```ts
{
  Id: string; awardedAt: string; awardedBy: string; awardDescriptions: string;
  schoolId: string; createdBy: string; createdAt: string;
  modifiedBy: string; modifiedAt: string; isActive: boolean;
}
```

---

### 8.4 Student Award

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useFilterStudentAwardByDate` | `GET` | `/api/Certificate/FilterStudentsAwards` | Award list |
| `useGetStudentAwardById` | `GET` | `/api/Certificate/StudentsAwards/{id}` | Award detail |
| `useAddStudentAward` | `POST` | `/api/Certificate/AddStudentsAwards` | Add award |
| `useRemoveStudentAward` | `DELETE` | `/api/Certificate/DeleteAwards/{Id}` | Delete |

**Interface (`Istudentaward`):**
```ts
{
  Id: string; studentId: string; awardedAt: string; awardedBy: string;
  awardTitle: string; awardDescriptions: string; certificateTemplateId: string;
  eventsId: string; contentHtml: string; schoolId: string; isActive: boolean;
}
```

---

## 9. Enduser - Miscellaneous Module

### 9.1 Events

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllEvents` | `GET` | `/api/Academics/GetAllEvents` | Events list |
| `useGetEventsById` | `GET` | `/api/Academics/Events/{id}` | Edit prefill |
| `useAddEvents` | `POST` | `/api/Academics/AddEvents` | Add event form |
| `useEditEvents` | `PATCH` | `/api/Academics/UpdateEvents/{Id}` | Edit event |
| `useRemoveEvent` | `DELETE` | `/api/Academics/DeleteEvents/{id}` | Delete |
| `useFilterEventsByDate` | `GET` | `/api/Academics/FilterEvents` | Date filter |

**Interface (`IEvents`):**
```ts
{
  id?: string; title: string; descriptions: string; eventsType: number;
  eventsDate: string; participants: string; eventTime: string; venue: string;
  chiefGuest: string; organizer: string; mentor: string; schoolId?: string;
}
```

---

### 9.2 School Item

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllSchoolItems` | `GET` | `/api/SchoolAssetsControllers/all-SchoolItems` | Item list |
| `useGetSchoolItemById` | `GET` | `/api/SchoolAssetsControllers/SchoolItemsBy/{id}` | Edit prefill |
| `useAddSchoolItem` | `POST` | `/api/SchoolAssetsControllers/AddSchoolItems` | Add item form |
| `useEditSchoolItem` | `PATCH` | `/api/SchoolAssetsControllers/UpdateSchoolItems/{id}` | Edit item |
| `useRemoveSchoolItem` | `DELETE` | `/api/SchoolAssetsControllers/DeleteSchoolItems/{Id}` | Delete |
| `useFilterSchoolItemByDate` | `GET` | `/api/SchoolAssetsControllers/FilterSchoolItems` | Date filter |

**Interface (`ISchoolItem`):**
```ts
{
  id?: string; name: string; contributorId: string; itemStatus: number;
  itemCondition: number; receivedDate: Date; estimatedValue: number;
  quantity: number; unitType: number; fiscalYearId: string;
}
```

**Filter Interface (`IFilterSchoolItem`):**
```ts
{ startDate: string; endDate: string; name: string; }
```

---

### 9.3 Contributor

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|---------|
| `useGetAllContributors` | `GET` | `/api/SchoolAssetsControllers/all-Contributors` | Contributor list |
| `useGetContributorById` | `GET` | `/api/SchoolAssetsControllers/ContributorsBy/{id}` | Edit prefill |
| `useAddContributor` | `POST` | `/api/SchoolAssetsControllers/AddContributors` | Add contributor form |
| `useEditContributor` | `PATCH` | `/api/SchoolAssetsControllers/UpdateContributors/{id}` | Edit contributor |
| `useRemoveContributor` | `DELETE` | `/api/SchoolAssetsControllers/DeleteContributors/{Id}` | Delete |
| `useFilterContributorByDate` | `GET` | `/api/SchoolAssetsControllers/FilterContributors` | Date filter |

**Interface (`IContributor`):**
```ts
{
  id?: string;
  name: string;
  organization: string;
  contactNumber: string;
  email: string;
}
```

---

### 9.4 School Item History

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|---------|
| `useGetAllHistory` | `GET` | `/api/SchoolAssetsControllers/all-History` | History list |
| `useGetHistoryById` | `GET` | `/api/SchoolAssetsControllers/HistoryBy/{id}` | Edit prefill |
| `useAddHistory` | `POST` | `/api/SchoolAssetsControllers/AddSchoolItemHistory` | Add history record |
| `useEditHistory` | `PATCH` | `/api/SchoolAssetsControllers/UpdateHistory/{id}` | Edit history |
| `useRemoveHistory` | `DELETE` | `/api/SchoolAssetsControllers/DeleteHistory/{Id}` | Delete |
| `useFilterHistoryByDate` | `GET` | `/api/SchoolAssetsControllers/FilterSchoolItemsHistory` | Date filter |

**Interface (`IHistory`):**
```ts
{
  id?: string;
  schoolItemId: string;
  previousStatus: number;
  currentStatus: number;
  remarks: string;
}
```

---

### 9.5 Assets Report

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|---------|
| `useGetAssetsReportByFyId` | `GET` | `/api/SchoolAssetsControllers/SchoolAssetsReport` | Assets report view |

**Response Interface (`IAssetsReportResponse`):**
```ts
{ Items: IAssetsReportItem[]; }
```

**Interface (`IAssetsReportItem`):**
```ts
{
  contributorName: string;
  fiscalYearName: string;
  totalEstimatedValue: number;
  totalItemsCount: number;
  itemsName: string;
}
```

---

## 10. Enduser - Notice Module

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllNotices` | `GET` | `/api/Communication/DisplayNotice` | Public notice board |
| `useGetNoticeById` | `GET` | `/api/Communication/NoticesBy/{id}` | Notice detail |
| `useAddNotice` | `POST` | `/api/Communication/AddNotice` | Add notice |
| `useUpdateNotice` | `PATCH` | `/api/Communication/UpdateNotice/{id}` | Edit notice |
| `useDeleteNotice` | `DELETE` | `/api/Communication/DeleteNotice/{id}` | Delete notice |
| `usePublishNotice` | `POST` | `/api/Communication/PublishNotice` | Publish button |
| `useUnPublishNotice` | `POST` | `/api/Communication/UnPublishNotice` | Unpublish button |
| `useFilterNoticeByDate` | `GET` | `/api/Communication/FilterNotice` | Date filter |

**Interfaces:**
```ts
interface INotice {
  id?: string; title: string; contentHtml: string;
  publishStatus: number; shortDescription: string;
}
interface IDisplayNotice extends INotice { createdAt: string; }
interface IPublish { noticeId: string; }
```

---

## 11. Enduser - Reports Module

### 11.1 Ledger Statement

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetPartiesDetails` | `GET` | `/api/Report/FilterPartyStatement` | Ledger statement report |

**Interface (`ILedgerStatementDetails`):**
```ts
{
  dateTime: string;
  billNumber: string;
  transactions: string;
  debitAmount: number;
  amount: number;
  creditAmount: number;
  affectedLedgerId: string;
  transactionId: string;
  paymentMethodId: string;
  referenceNumber: string;
}
```

**Filter Interface (`IFilterLedgerDetailsByDate`):**
```ts
{ endDate: string; startDate: string; partyId: string; }
```

---

### 11.2 Trial Balance

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetTrialBalance` | `GET` | `/api/Report/GetTrialBalance` | Trial balance report |

**Interface (`ITrialBalance`):**
```ts
{
  masterId: string;
  debitAmount: number;
  creditAmount: number;
  ledgerGroupLevels: ILedgerGroupLevels[];
}
```

**Interface (`ILedgerGroupLevels`):**
```ts
{
  subLedgerGroupId: string;
  debitAmount: number;
  creditAmount: number;
  ledgersLevels: ILedgerLevels[];
}
```

**Interface (`ILedgerLevels`):**
```ts
{ ledgerId: string; creditAmount: number; debitAmount: number; }
```

---

### 11.3 Payment Statement

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetPaymentDetailReport` | `GET` | `/api/SchoolReportsControllers/PaymentDetailsReport` | Payment detail report |
| `useGetPaymentStatements` | `GET` | `/api/SchoolReportsControllers/PaymentStatements?studentId=` | Student payment statement |

**Interface (`IPaymentDetailReport`):**
```ts
{
  studentName: string;
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  dueAmount: number;
}
```

**Interface (`IPaymentStatement`):**
```ts
{
  schoolId: string;
  studentId: string;
  date: string;
  receiptNumber?: string;
  debitAmount: number;
  creditAmount: number;
  adjustment: number;
  balance: number;
  remarks: string;
}
```

---

### 11.4 Attendance Report

> Uses hooks from Student Attendance module (`useGetAttendanceReport`, `useGetAttendenceCount`).
> See [Part 1 → Section 4.4 Student Attendance](./API_DOCUMENTATION_PART1.md#44-student-attendance) for full details.

---

## 12. Teacher Module

The Teacher module reuses the same backend API endpoints as the Enduser module. Below is the mapping:

| Teacher SubModule | Reused API Controller | Same Endpoints As |
|---|---|---|
| Teacher → Exam | `/api/Academics/` | [Enduser → Academics → Exam (Part 1, §3.3)](./API_DOCUMENTATION_PART1.md#33-exam) |
| Teacher → Exam Result | `/api/Academics/` | [Enduser → Academics → Exam Result (Part 1, §3.4)](./API_DOCUMENTATION_PART1.md#34-exam-result) |
| Teacher → Student | `/api/Student/` | [Enduser → Student Management → Student (Part 1, §4.1)](./API_DOCUMENTATION_PART1.md#41-student) |
| Teacher → Parent | `/api/Student/` | [Enduser → Student Management → Parent (Part 1, §4.2)](./API_DOCUMENTATION_PART1.md#42-parent) |

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

### API Instance

All hooks use `api` from `@/utils/instance` (Axios instance with auth interceptors).

### Query Library

All hooks are built on **@tanstack/react-query**:
- `useQuery` → GET requests (data fetching)
- `useMutation` → POST/PATCH/DELETE requests (data mutation)

---

## API Controller Summary

| Controller | Base Path | Modules Covered |
|-----------|-----------|-----------------|
| `Authentication` | `/api/Authentication/` | Login, Users, Roles, Permissions |
| `RoleModuleControllers` | `/api/RoleModuleControllers/` | Modules, SubModules, Menu, Assign |
| `SetupControllers` | `/api/SetupControllers/` | Institution, Organization |
| `Academics` | `/api/Academics/` | Class, Subject, Exam, ExamResult, ExamSeat, ExamSession, Events |
| `Student` | `/api/Student/` | Student, Parent, Registration, Attendance |
| `StaffControllers` | `/api/StaffControllers/` | Academic Staff, Class Assignment |
| `AccountControllers` | `/api/AccountControllers/` | Ledger, LedgerGroup, SubLedgerGroup, Journal, ChartOfAccount, Master |
| `Finance` | `/api/Finance/` | FeeCategory, FeeType, FeeStructure, StudentFee, PaymentRecords |
| `Certificate` | `/api/Certificate/` | Template, IssuedCertificate, SchoolAward, StudentAward |
| `Communication` | `/api/Communication/` | Notice |
| `SchoolAssetsControllers` | `/api/SchoolAssetsControllers/` | SchoolItems |
| `CocurricularActivities` | `/api/CocurricularActivities/` | Activities, Participation |
| `Report` | `/api/Report/` | LedgerStatement, TrialBalance |
| `Settings` | `/api/Settings/` | JournalRef settings |

---

*← Back to [Part 1](./API_DOCUMENTATION_PART1.md)*
