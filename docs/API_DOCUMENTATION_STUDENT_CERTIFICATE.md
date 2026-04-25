# Student Management & Certificate Modules API Documentation

> Comprehensive API reference for Student Management and Certificate modules, detailing endpoints, hooks, request schemas, and TypeScript interfaces.

---

## Table of Contents

1. [Student Management Module](#1-student-management-module)
   - [1.1 Student](#11-student)
   - [1.2 Parent](#12-parent)
   - [1.3 Registration](#13-registration)
   - [1.4 Student Attendance](#14-student-attendance)
   - [1.5 Co-curricular Activities](#15-co-curricular-activities)
2. [Certificate Module](#2-certificate-module)
   - [2.1 Certificate Template](#21-certificate-template)
   - [2.2 Issued Certificate](#22-issued-certificate)
   - [2.3 School Award](#23-school-award)
   - [2.4 Student Award](#24-student-award)
3. [Appendix: Common Shared Types](#appendix-common-shared-types)

---

## 1. Student Management Module

### 1.1 Student

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllStudents` | `GET` | `/api/Student/StudentFromRegistration` | Student list table |
| `useGetStudentById` | `GET` | `/api/Student/StudentsBy/{StudentId}` | Edit form prefill |
| `useGetStudentByClass` | `GET` | `/api/Student/GetStudentByClass/{ClassId}?classId=` | Students dropdown by class |
| `useAddStudent` | `POST` | `/api/Student/AddStudents` | Add student form (multipart/form-data) |
| `useEditStudent` | `PATCH` | `/api/Student/UpdateStudents/{id}` | Edit student form |
| `useRemoveStudent` | `DELETE` | `/api/Student/DeleteStudents/{Id}` | Delete student button |
| `useUploadStudents` | `POST` | `/api/Student/upload-students` | Bulk excel upload |
| `useFilterStudentByDate` | `GET` | `/api/Student/FilterStudents` | Date and text search filter |

**Interface (`IStudent`):**
```ts
{
  id?: string;
  firstName: string;
  feeCategoryId?: string;
  middleName?: string | null;
  lastName: string;
  registrationNumber: string;
  admissionNumber?: string;
  genderStatus: number;
  studentStatus: number;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  studentImg: File | string;
  address: string;
  enrollmentDate: Date;
  parentId: string;
  classSectionId?: string;
  classId: string;
  provinceId: number;
  districtId: number;
  enrollmentStatus?: number;
  municipalityId: number;
  vdcid: number;
  wardNumber?: number | null;
  imageUrl?: string;
}
```

---

### 1.2 Parent

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllParents` | `GET` | `/api/Student/all-Parents` | Parent list table |
| `useGetParentById` | `GET` | `/api/Student/GetParentsBy/{ParentId}` | Edit form prefill |
| `useAddParent` | `POST` | `/api/Student/AddParent` | Add parent form |
| `useEditParent` | `PATCH` | `/api/Student/UpdateParents/{id}` | Edit parent form |
| `useRemoveParent` | `DELETE` | `/api/Student/DeleteParents/{Id}` | Delete parent button |
| `useFilterParentByDate` | `GET` | `/api/Student/FilterParents` | Date and text search filter |

**Interface (`IParent`):**
```ts
{
  id?: string;
  fullName: string;
  parentType: 0; // Or other enum values representing parent type
  phoneNumber: string;
  email: string;
  address: string;
  occupation: string;
  imageUrl: string;
}
```

---

### 1.3 Registration

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllRegistration` | `GET` | `/api/Student/all-Registration` | Registration list table |
| `useGetRegistrationById` | `GET` | `/api/Student/GetRegistrationBy/{id}` | Edit form prefill |
| `useGetAllAcademicYear` | `GET` | `/api/Student/AllAcademicYear` | Academic year dropdown |
| `useAddRegistration` | `POST` | `/api/Student/StudentRegistration` | Add registration form |
| `useEditRegistration` | `PATCH` | `/api/Student/UpdateRegistration/{id}` | Edit registration form |
| `useRemoveRegistration` | `DELETE` | `/api/Student/DeleteRegistration/{Id}` | Delete registration button |
| `useFilterRegistrationByDate` | `GET` | `/api/Student/FilterRegisterStudents` | Date filter |

**Interfaces:**
```ts
interface IRegistration {
  id?: string;
  studentId: string;
  classId: string;
  academicYearId: string;
}

interface IAcademicYear {
  Id: string;
  Name: string;
}
```

---

### 1.4 Student Attendance

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllStudentAttendances` | `GET` | `/api/Student/all-StudentAttendances` | Attendance list view |
| `useAddStudentAttendance` | `POST` | `/api/Student/AddStudentAttendence` | Take attendance form |
| `useGetAttendanceReport` | `GET` | `/api/Student/AttendanceReport` | Attendance report view |
| `useGetAttendenceCount` | `GET` | `/api/Student/AttendanceCount?studentId=` | Attendance count stats display |
| `useFilterStudentAttendanceByDate` | `GET` | `/api/Student/FilterStudentsAttendance` | Date filter |

**Interfaces:**
```ts
interface IStudentAttendance {
  id?: string;
  academicTeamId: string;
  attendanceDate: Date;
  studentAttendances: IStudentList[];
}

interface IStudentList {
  studentId: string;
  status: number;
  remarks: string;
}

interface IAttendencecount {
  totalRunningDays: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  totalLateDays: number;
  totalExcusedDays: number;
}
```

---

### 1.5 Co-curricular Activities

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useFilterActivity` | `GET` | `/api/CocurricularActivities/FilterActivity` | Activity list |
| `useAddActivity` | `POST` | `/api/CocurricularActivities/AddActivity` | Add activity form |
| `useUpdateActivity` | `PATCH` | `/api/CocurricularActivities/UpdateActivity/{id}` | Edit activity |
| `useDeleteActivity` | `DELETE` | `/api/CocurricularActivities/DeleteActivity/{id}` | Delete activity |
| `useFilterParticipation` | `GET` | `/api/CocurricularActivities/FilterParticipation` | Participation list |
| `useAddParticipation` | `POST` | `/api/CocurricularActivities/AddParticipation` | Add participation |
| `useUpdateParticipation` | `PATCH` | `/api/CocurricularActivities/UpdateParticipation/{id}` | Edit participation |
| `useDeleteParticipation` | `DELETE` | `/api/CocurricularActivities/DeleteParticipation/{id}` | Delete participation |
| `useGetAllActivitiesDropdown` | `GET` | `/api/CocurricularActivities/Activity` | Activity dropdown |

**Interfaces:**
```ts
interface Activity {
  id: string;
  name: string;
  descriptions: string;
  activityCategory: number;
  eventId: string;
  classIds: string[];
  isActive: boolean;
  schoolId: string;
}

interface AddActivityPayload {
  name: string;
  descriptions: string;
  activityCategory: number;
  eventId: string;
  startTime: string;
  endTime: string;
  activityDate: string;
  classIds: string[];
}

interface Participation {
  id: string;
  studentId: string;
  activityId: string;
  awardPosition: number;
  isActive: boolean;
}

interface AddParticipationPayload {
  studentId: string;
  activityId: string;
  awardPosition: number;
}
```

---

## 2. Certificate Module

### 2.1 Certificate Template

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllTemplate` | `GET` | `/api/Certificate/all-certificateTemplate` | Template list |
| `useGetTemplateById` | `GET` | `/api/Certificate/CertificateTemplate/{id}` | Edit form prefill |
| `useAddTemplate` | `POST` | `/api/Certificate/AddCertificateTemplate` | Add template form |
| `useEditTemplate` | `PATCH` | `/api/Certificate/UpdateCertificateTemplate/{id}` | Edit template form |
| `useRemoveTemplate` | `DELETE` | `/api/Certificate/Delete/{Id}` | Delete template button |
| `useFilterTemplateByDate` | `GET` | `/api/Certificate/FilterCertificateTemplate` | Date filter |

**Interface (`ITemplate`):**
```ts
{
  id?: string;
  templateName: string;
  templateType: string;
  templateSubject: string;
  htmlTemplate: string;
  templateVersion: string;
}
```

---

### 2.2 Issued Certificate

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllIssuedCertificate` | `GET` | `/api/Certificate/all-issuedCertificate` | Issued certificate list |
| `useGetIssuedCertificateById` | `GET` | `/api/Certificate/IssuedCertificateById/{id}` | Edit form prefill |
| `useAddIssuedCertificate` | `POST` | `/api/Certificate/AddIssuedCertificate` | Issue new certificate form |
| `useEditIssuedCertificate` | `PATCH` | `/api/Certificate/UpdateIssuedCertificate/{id}` | Edit issued certificate |
| `useRemoveIssuedCertificate` | `DELETE` | `/api/Certificate/DeleteIssuedCertificate/{Id}` | Delete issued certificate |
| `useFilterIssuedCertificateByDate` | `GET` | `/api/Certificate/FilterIssuedCertificate` | Date filter |
| `useGenerateCertificateByStudent` | `GET` | `/api/Certificate/GenerateCertificateByStudent?studentId=&examId=` | Generate certificate action |

**Interface (`IIssuedCertificate`):**
```ts
{
  id?: string;
  templateId: string;
  studentId: string;
  certificateNumber: string;
  issuedDate: Date;
  issuedBy: string;
  pdfPath: string;
  remarks: string;
  status: number;
  yearOfCompletion: Date;
  program: string;
  examId?: string;
  symbolNumber: string;
}
```

**Interface (`ICertificate` - Response from Generator):**
```ts
{
  fullName: string;
  parentsName: string;
  provinceId: string;
  districtId: string;
  wardNumber: number;
  certificateProgram: string;
  yearOfCompletion: Date;
  percentage: string;
  division: string;
  dateOfBirth: Date;
  symbolNumber: string;
  registrationNumber: string;
  dateOfIssue: Date;
  StudentImage: string;
}
```

---

### 2.3 School Award

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useFilterSchoolAwardByDate` | `GET` | `/api/Certificate/FilterSchoolAwards` | School award list / filter |
| `useGetSchoolAwardById` | `GET` | `/api/Certificate/SchoolAwards/{id}` | Award detail view/prefill |
| `useAddSchoolAward` | `POST` | `/api/Certificate/AddSchoolsAwards` | Add school award form |
| `useRemoveSchoolAward` | `DELETE` | `/api/Certificate/DeleteSchoolAwards/{Id}` | Delete school award button |

**Interface (`ISchoolAward`):**
```ts
{
  Id: string;
  awardedAt: string;        
  awardedBy: string;
  awardDescriptions: string;
  schoolId: string;
  createdBy: string;
  createdAt: string;          
  modifiedBy: string;
  modifiedAt: string;  
  isActive: boolean;
}
```

---

### 2.4 Student Award

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useFilterStudentAwardByDate` | `GET` | `/api/Certificate/FilterStudentsAwards` | Student award list / filter |
| `useGetStudentAwardById` | `GET` | `/api/Certificate/StudentsAwards/{id}` | Award detail view/prefill |
| `useAddStudentAward` | `POST` | `/api/Certificate/AddStudentsAwards` | Add student award form |
| `useRemoveStudentAward` | `DELETE` | `/api/Certificate/DeleteAwards/{Id}` | Delete student award button |

**Interface (`Istudentaward`):**
```ts
{
  Id: string;
  studentId: string;
  awardedAt: string;
  awardedBy: string;
  awardTitle: string;
  createdAt: string;
  createdBy: string;
  modifiedBy: string;
  modifiedAt: string;
  awardDescriptions: string;
  certificateTemplateId: string;
  eventsId: string;
  contentHtml: string;
  schoolId: string;
  isActive: boolean;
}
```

---

## Appendix: Common Shared Types

### Pagination Response (`IPaginationResponse<T>`)

All paginated `GET` endpoints (e.g., lists and filters) return this standard wrapper format:

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
