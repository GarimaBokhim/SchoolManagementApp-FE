# School Management App - Frontend API Documentation

> Complete module-by-module API reference with endpoints, hooks, request schemas, and TypeScript interfaces.

---

## Table of Contents

1. [Auth Module](#1-auth-module)
2. [SuperAdmin Module](#2-superadmin-module)
3. [Enduser - Academics Module](#3-enduser---academics-module)
4. [Enduser - Student Management Module](#4-enduser---student-management-module)

---

## 1. Auth Module

### 1.1 Login

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useLogin` | `POST` | `/api/Authentication/login` | Login form submission |

**Request Schema (`LoginRequest`):**
```ts
{
  email: string | null;
  password: string | null;
}
```

**Response Interface (`ILoginType`):**
```ts
{
  email: string | null;
  password: string | null;
  token: string | null;
  refreshToken: string | null;
}
```

---

## 2. SuperAdmin Module

### 2.1 Navigation → Modules

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllModules` | `GET` | `/api/RoleModuleControllers/all-modules` | List all modules table |
| `useGetModulesById` | `GET` | `/api/RoleModuleControllers/Modules/{Id}` | Edit module form prefill |
| `useGetModuleByRoleId` | `GET` | `/api/RoleModuleControllers/GetModulesByRoleId/{id}` | Modules by role display |
| `useAddModule` | `POST` | `/api/RoleModuleControllers/AddModules` | Add module form |
| `useEditModule` | `PATCH` | `/api/RoleModuleControllers/UpdateModules/{id}` | Edit module form |
| `useRemoveModule` | `DELETE` | `/api/RoleModuleControllers/Delete/{Id}` | Delete module button |
| `useGetFilterModulesByDate` | `GET` | `/api/RoleModuleControllers/FilterModulesByDate?startDate=&endDate=&name=` | Date filter |
| `useGetAppNames` | `GET` | `/api/RoleModuleControllers/AppNames` | App name dropdown |

**Request Schema (`ModuleRequest`):**
```ts
{
  id?: string;
  name: string;
  description: string;
  targetUrl: string;
  isActive: boolean;
  iconUrl: string;
  rank: string;
  appId: string;
}
```

**Response Interface (`IModules`):**
```ts
{
  Modules: any;
  Id: string;
  Name?: string;
  Description?: string;
  TargetUrl?: string;
  IconUrl?: string;
  Rank?: string;
  AppId?: string;
  IsActive: boolean;
}
```

**Other Interfaces:**
```ts
interface IModulesByRoleId {
  AppName: string;
  Modules: IModuleItem[];
}
interface IModuleItem {
  Id: string;
  Name: string;
  TargetUrl?: string;
  IsActive: boolean;
}
interface IAppName { Id: string; Name: string; }
```

---

### 2.2 Navigation → SubModules

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllSubModules` | `GET` | `/api/RoleModuleControllers/all-submodules` | List all submodules |
| `useGetSubModulesById` | `GET` | `/api/RoleModuleControllers/SubModules/{Id}` | Edit form prefill |
| `useGetSubModulesByModuleId` | `GET` | `/api/RoleModuleControllers/GetSubModulesByModulesId/{id}` | SubModules under module |
| `useGetSubModuleByRoleId` | `GET` | `/api/RoleModuleControllers/GetSubModulesByRoleId/{id}` | SubModules by role |
| `useAddSubModule` | `POST` | `/api/RoleModuleControllers/AddSubModule` | Add submodule form |
| `useEditSubModule` | `PATCH` | `/api/RoleModuleControllers/UpdateSubModules/{id}` | Edit submodule form |
| `useRemoveSubModule` | `DELETE` | `/api/RoleModuleControllers/DeleteSubModules/{Id}` | Delete button |
| `useGetFilterSubModulesByDate` | `GET` | `/api/RoleModuleControllers/FilterSubModulesByDate?startDate=&endDate=&name=` | Date filter |

**Request Schema (`SubModuleRequest`):**
```ts
{
  id?: string;
  name: string;
  iconUrl: string;
  targetUrl: string;
  modulesId: string;
  rank: string;
  isActive?: boolean;
}
```

**Response Interface (`ISubModules`):**
```ts
{
  id: string;
  name: string;
  iconUrl: string;
  targetUrl: string;
  modulesId: string;
  rank: string;
  isActive: boolean;
}
```

---

### 2.3 Navigation → Menu

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllMenus` | `GET` | `/api/RoleModuleControllers/all-menu` | List all menus |
| `useGetMenuById` | `GET` | `/api/RoleModuleControllers/Menu/{id}` | Edit form prefill |
| `useGetAllMenuBySubModulesId` | `GET` | `/api/RoleModuleControllers/GetMenuBySubmodulesId/{id}` | Menus under submodule |
| `useGetMenuByRoleId` | `GET` | `/api/RoleModuleControllers/GetMenuByRoleId/{id}` | Menus by role |
| `useGetMenuStatus` | `GET` | `/api/RoleModuleControllers/GetMenuStatusBySubModulesAndRoles?subModulesId=&rolesId=` | Menu assignment status |
| `useAddMenu` | `POST` | `/api/RoleModuleControllers/AddMenu` | Add menu form |
| `useEditMenu` | `PATCH` | `/api/RoleModuleControllers/UpdateMenu/{id}` | Edit menu form |
| `useRemoveMenu` | `DELETE` | `/api/RoleModuleControllers/DeleteMenu/{id}` | Delete button |
| `useGetFilterMenusByDate` | `GET` | `/api/RoleModuleControllers/FilterMenusByDate?startDate=&endDate=&name=` | Date filter |

**Request Schema (`MenuRequest`):**
```ts
{
  id: string;
  name: string;
  targetUrl: string;
  iconUrl: string;
  subModulesId: string;
  rank: number;
  isActive: boolean;
}
```

**Response Interface (`IMenu`):**
```ts
{
  id: string;
  name: string;
  targetUrl: string;
  iconUrl: string;
  subModulesId: string;
  rank: number;
  isActive: boolean;
}
```

---

### 2.4 Access Control → Roles

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllRoles` | `GET` | `/api/Authentication/all-roles` | Roles list table |
| `useGetRolesByUserId` | `GET` | `/api/Authentication/GetRole/{Id}` | Roles for a user |
| `useGetRolesByRoleId` | `GET` | `/api/Authentication/Role/{Id}` | Single role detail |
| `useAddRole` | `POST` | `/api/Authentication/CreateRoles` | Add role form |
| `useEditRole` | `PATCH` | `/api/Authentication/UpdateRole/{Id}` | Edit role form |
| `useRemoveRole` | `DELETE` | `/api/Authentication/DeleteRole/{Id}` | Delete button |
| `useAssignRole` | `POST` | `/api/Authentication/AssignRoles` | Assign role to user |
| `useGetFilterRoleByDate` | `GET` | `/api/Authentication/FilterRoleByDate?startDate=&endDate=&name=` | Date filter |
| `useGetModuleByRoleId` | `GET` | `/api/RoleModuleControllers/GetModulesByRoleId/{id}` | Modules assigned to role |

**Request Schema (`RoleRequest`):**
```ts
{ Id: string; Name: string; }
```

**Response Interface (`IRoles`):**
```ts
{ Id: string; Name: string; }
```

---

### 2.5 Access Control → Assign Role (Module/SubModule/Menu)

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useAssignModule` | `POST` | `/api/RoleModuleControllers/AssignModules` | Assign modules to role |
| `useAssignSubModule` | `POST` | `/api/RoleModuleControllers/AssignSubModules` | Assign submodules to role |
| `useAssignMenu` | `POST` | `/api/RoleModuleControllers/AssignMenus` | Assign menus to role |
| `useUpdateAssignModules` | `PATCH` | `/api/RoleModuleControllers/UpdateAssignModulesByModules/{moduleId}` | Toggle module assignment |
| `useUpdateAssignSubModules` | `PATCH` | `/api/RoleModuleControllers/UpdateAssignSubModulesBySubModules/{subModuleId}` | Toggle submodule assignment |
| `useUpdateAssignMenu` | `PATCH` | `/api/RoleModuleControllers/UpdateAssignMenusByMenus/{menuId}` | Toggle menu assignment |

**Interfaces:**
```ts
interface IAssignModule { roleId: string; modulesId: string[]; isActive?: boolean; }
interface IAssignSubModule { roleId: string; subModulesId: string[]; isActive?: boolean; }
interface IAssignMenu { roleId: string; menusId: string[]; isActive?: boolean; }
```

---

### 2.6 Access Control → Role Permission

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllPermission` | `GET` | `/api/Authentication/all-permission` | Permission list |
| `useGetPermissionByPermission` | `GET` | `/api/Authentication/Permission/{Id}` | Permission detail |
| `useGetAssignableRolesByPermission` | `GET` | `/api/Authentication/AssignableRolesByPermissionId/{Id}` | Roles for permission |
| `useGetRolesForOtherRole` | `GET` | `/api/Authentication/AssignableRolesToUser` | Assignable roles |
| `useAddPermission` | `POST` | `/api/Authentication/AddPermission` | Add permission |
| `useAddPermissionToRoles` | `POST` | `/api/Authentication/AddPermissionToRoles` | Assign permission to roles |
| `useEditRolePermission` | `PATCH` | `/api/Authentication/UpdatePermission/{Id}` | Edit permission |
| `useRemoveRolePermission` | `DELETE` | `/api/Authentication/DeletePermission/{Id}` | Delete permission |

**Interfaces:**
```ts
interface IRolePermission { id: string; name: string; roleId: string; }
interface IPermissionToRole { permissionId: string; roleId: string; }
interface IAssignableRole { permissionId: string; roleId: string; }
```

---

### 2.7 Access Control → User Management

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllUsers` | `GET` | `/api/Authentication/all-users` | Users list table |
| `useGetUserById` | `GET` | `/api/Authentication/User/{Id}` | User detail/edit prefill |
| `useGetUserByRoleId` | `GET` | `/api/Authentication/GetUserByRole/{Id}` | Users by role |
| `useAddUser` | `POST` | `/api/Authentication/AddUser` | Add user form |
| `useEditUser` | `PATCH` | `/api/Authentication/UpdateUser/{Id}` | Edit user form |
| `useDeleteUser` | `DELETE` | `/api/Authentication/DeleteUser/{Id}` | Delete user |
| `useAssignRole` | `POST` | `/api/Authentication/AssignRoles` | Assign roles to user |
| `useGetFilterUserByDate` | `GET` | `/api/Authentication/FilterUserByDate` | Date filter |

**Interfaces:**
```ts
interface IUserResponse {
  id: string; userName: string; email: string; password: string;
  rolesId: string[]; institutionId: string; SchoolId?: string; schoolIds: string[];
}
interface IUserResponseForAll {
  Id: string; UserName: string; Email: string; Password: string;
  rolesId: string[]; institutionId: string; CompanyId: string; SchoolIds: string[];
}
interface IAssign { userId: string; rolesId: string[]; }
interface IAssignedUser { Id: string; UserName: string; Email: string; }
```

---

### 2.8 Institution Setup

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllInstitution` | `GET` | `/api/SetupControllers/all-institution` | Institution list |
| `useGetInstitutionById` | `GET` | `/api/SetupControllers/Institution/{Id}` | Edit form prefill |
| `useGetInstitutionByOrganizationId` | `GET` | `/api/SetupControllers/GetInstitution/{id}` | Institutions under org |
| `useGetAllOrganization` | `GET` | `/api/SetupControllers/all-organization` | Organization dropdown |
| `useAddInstitution` | `POST` | `/api/SetupControllers/AddInstitution` | Add institution form |
| `useEditInstitution` | `PATCH` | `/api/SetupControllers/UpdateInstitution/{id}` | Edit institution form |
| `useRemoveInstitution` | `DELETE` | `/api/SetupControllers/DeleteInstitution/{Id}` | Delete button |
| `useGetFilterInstitutionByDate` | `GET` | `/api/SetupControllers/FilterInstitutionByDate?startDate=&endDate=&name=` | Date filter |

**Interfaces:**
```ts
interface IInstitution {
  id: string; name: string; address: string; email: string; shortName: string;
  contactNumber: string; contactPerson: string; pan: string; imageUrl: string;
  isEnable: boolean; isDeleted: boolean; organizationId: string;
}
interface IOrganization {
  id: string; name: string; address: string; email: string;
  phoneNumber: string; mobileNumber: string; logo: string; province: number;
}
```

---

## 3. Enduser - Academics Module

### 3.1 Class

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllClass` | `GET` | `/api/Academics/all-SchoolClass` | Class list table |
| `useGetClassById` | `GET` | `/api/Academics/SchoolClass/{ClassId}` | Edit form prefill |
| `useAddClass` | `POST` | `/api/Academics/AddSchoolClass` | Add class form |
| `useEditClass` | `PATCH` | `/api/Academics/UpdateSchoolClass/{id}` | Edit class form |
| `useRemoveClass` | `DELETE` | `/api/Academics/DeleteClass/{Id}` | Delete button |
| `useFilterClassByDate` | `GET` | `/api/Academics/FilterSchoolClass` | Date filter |

**Interfaces:**
```ts
interface IClass {
  id?: string; name: string; classSymbol: number; subjects?: Iclasssubjects[];
}
interface Iclasssubjects {
  id?: string; name: string; code: string; creditHours: number;
  description: string; classId: string;
}
```

---

### 3.2 Subject

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllSubjects` | `GET` | `/api/Academics/all-subject` | Subject list |
| `useGetSubjectById` | `GET` | `/api/Academics/{SubjectId}` | Edit prefill |
| `useGetSubjectByClassId` | `GET` | `/api/Academics/SubjectByClass?classId=&examId=` | Subjects dropdown by class |
| `useAddSubject` | `POST` | `/api/Academics/AddSubject` | Add subject form |
| `useEditSubject` | `PATCH` | `/api/Academics/UpdateSubject/{id}` | Edit subject form |
| `useDeleteSubject` | `DELETE` | `/api/Academics/DeleteSubject/{Id}` | Delete button |
| `useFilterSubjectByDate` | `GET` | `/api/Academics/FilterSubject` | Date filter |

**Interfaces:**
```ts
interface ISubject {
  id?: string; Id?: string; name: string; code: string; creditHours: number;
  description: string; classId: string; examId: string; fullMarks: number; passMarks: number;
}
interface ISubjectByClass { id: string; subjectName: string; fullMarks: number; }
```

---

### 3.3 Exam

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllExams` | `GET` | `/api/Academics/all-exam` | Exam list |
| `useGetExamById` | `GET` | `/api/Academics/Exam/{ExamId}` | Edit prefill |
| `useAddExam` | `POST` | `/api/Academics/AddExam` | Add exam form |
| `useEditExam` | `PATCH` | `/api/Academics/UpdateExam/{id}` | Edit exam form |
| `useRemoveExam` | `DELETE` | `/api/Academics/Delete/{Id}` | Delete button |
| `useFilterExamByDate` | `GET` | `/api/Academics/FilterExam` | Date filter |

**Interfaces:**
```ts
interface IExam {
  id?: string; name: string; examDate: Date; isfinalExam: boolean;
  classId: string; schoolId: string; examSubjects?: IExamSubjects[];
  totalMarks?: number; passingMarks?: number;
}
interface IExamSubjects {
  examSubjectId?: string; subjectId: string; passMarks: number; fullMarks: number;
}
```

---

### 3.4 Exam Result

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllExamResults` | `GET` | `/api/Academics/all-examResult` | Result list |
| `useGetExamResultById` | `GET` | `/api/Academics/ExamResult/{id}` | Edit prefill |
| `useAddExamResult` | `POST` | `/api/Academics/AddExamResult` | Add result form |
| `useEditExamResult` | `PATCH` | `/api/Academics/UpdateExamResult/{id}` | Edit result |
| `useRemoveExamResult` | `DELETE` | `/api/Academics/DeleteExamResult/{Id}` | Delete |
| `useGenerateMarkSheet` | `GET` | `/api/Academics/MarkSheet?studentId=&examId=` | Marksheet generation |
| `useFilterExamResultByDate` | `GET` | `/api/Academics/FilterExamResult` | Date filter |

**Interfaces:**
```ts
interface IExamResult {
  id?: string; examId: string; studentId: string; remarks?: string;
  marksObtained: { subjectId: string; marksObtained: number; fullMarks: number; }[];
}
interface IMarkSheet {
  examId: string; studentId: string; remarks: string; schoolId: string;
  percentage: string; totalObtainedMarks: number; grade: string; GPA: string;
  division: string; createdAt: string; MarksWithGrades: ISubjectMark[];
}
```

---

### 3.5 Exam Seat

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllExamSeats` | `GET` | `/api/Academics/all-ExamSeat` | Seat list |
| `useGetExamSeatById` | `GET` | `/api/Academics/ExamSeat/{id}` | Edit prefill |
| `useAddExamSeat` | `POST` | `/api/Academics/AddExamSeat` | Add seat form |
| `useEditExamSeat` | `PATCH` | `/api/Academics/UpdateExamSeat/{id}` | Edit seat |
| `useRemoveExamSeat` | `DELETE` | `/api/Academics/Delete/{Id}` | Delete |
| `useFilterExamSeatByDate` | `GET` | `/api/Academics/FilterExamSeat` | Date filter |

**Interface (`IExamSeat`):**
```ts
{
  id?: string; examId: string; studentId: string; remarks?: string;
  marksObtained: { subjectId: string; marksObtained: number; }[];
}
```

---

### 3.6 Exam Session

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllExamSessions` | `GET` | `/api/Academics/all-ExamSessions` | Session list |
| `useAddExamSession` | `POST` | `/api/Academics/AddExamSession` | Add session form |
| `useGenerateSeatPlanning` | `POST` | `/api/Academics/GenerateSeatPlanning` | Generate seat plan |
| `useGetClassByExamSessionId` | `GET` | `/api/Academics/ClassByExamSession?ExamSessionId=` | Classes in session |
| `useFilterExamSessionByDate` | `GET` | `/api/Academics/FilterExamSession` | Date filter |

**Interfaces:**
```ts
interface IExamSession { id?: string; name: string; examDate: Date; examHallDTOs: IHall[]; }
interface IHall { hallId?: string; hallName: string; capacity: number; }
interface ISeatPlanning {
  examSessionId: string; totalStudents: string;
  hallSeatResponses: IHallResponses[];
}
```

---

## 4. Enduser - Student Management Module

### 4.1 Student

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllStudents` | `GET` | `/api/Student/StudentFromRegistration` | Student list |
| `useGetStudentById` | `GET` | `/api/Student/StudentsBy/{StudentId}` | Edit prefill |
| `useGetStudentByClass` | `GET` | `/api/Student/GetStudentByClass/{ClassId}?classId=` | Students by class |
| `useAddStudent` | `POST` | `/api/Student/AddStudents` | Add student form (multipart) |
| `useEditStudent` | `PATCH` | `/api/Student/UpdateStudents/{id}` | Edit student |
| `useRemoveStudent` | `DELETE` | `/api/Student/DeleteStudents/{Id}` | Delete |
| `useUploadStudents` | `POST` | `/api/Student/upload-students` | Excel upload |
| `useFilterStudentByDate` | `GET` | `/api/Student/FilterStudents` | Date filter |

**Interface (`IStudent`):**
```ts
{
  id?: string; firstName: string; feeCategoryId?: string; middleName?: string | null;
  lastName: string; registrationNumber: string; admissionNumber?: string;
  genderStatus: number; studentStatus: number; dateOfBirth: Date; email: string;
  phoneNumber: string; studentImg: File | string; address: string; enrollmentDate: Date;
  parentId: string; classSectionId?: string; classId: string; provinceId: number;
  districtId: number; enrollmentStatus?: number; municipalityId: number;
  vdcid: number; wardNumber?: number | null; imageUrl?: string;
}
```

---

### 4.2 Parent

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllParents` | `GET` | `/api/Student/all-Parents` | Parent list |
| `useGetParentById` | `GET` | `/api/Student/GetParentsBy/{ParentId}` | Edit prefill |
| `useAddParent` | `POST` | `/api/Student/AddParent` | Add parent form |
| `useEditParent` | `PATCH` | `/api/Student/UpdateParents/{id}` | Edit parent |
| `useRemoveParent` | `DELETE` | `/api/Student/DeleteParents/{Id}` | Delete |
| `useFilterParentByDate` | `GET` | `/api/Student/FilterParents` | Date filter |

**Interface (`IParent`):**
```ts
{
  id?: string; fullName: string; parentType: 0; phoneNumber: string;
  email: string; address: string; occupation: string; imageUrl: string;
}
```

---

### 4.3 Registration

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllRegistration` | `GET` | `/api/Student/all-Registration` | Registration list |
| `useGetRegistrationById` | `GET` | `/api/Student/GetRegistrationBy/{id}` | Edit prefill |
| `useGetAllAcademicYear` | `GET` | `/api/Student/AllAcademicYear` | Academic year dropdown |
| `useAddRegistration` | `POST` | `/api/Student/StudentRegistration` | Add registration form |
| `useEditRegistration` | `PATCH` | `/api/Student/UpdateRegistration/{id}` | Edit registration |
| `useRemoveRegistration` | `DELETE` | `/api/Student/DeleteRegistration/{Id}` | Delete |
| `useFilterRegistrationByDate` | `GET` | `/api/Student/FilterRegisterStudents` | Date filter |

**Interfaces:**
```ts
interface IRegistration { id?: string; studentId: string; classId: string; academicYearId: string; }
interface IAcademicYear { Id: string; Name: string; }
```

---

### 4.4 Student Attendance

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useGetAllStudentAttendances` | `GET` | `/api/Student/all-StudentAttendances` | Attendance list |
| `useAddStudentAttendance` | `POST` | `/api/Student/AddStudentAttendence` | Take attendance form |
| `useGetAttendanceReport` | `GET` | `/api/Student/AttendanceReport` | Attendance report view |
| `useGetAttendenceCount` | `GET` | `/api/Student/AttendanceCount?studentId=` | Attendance count display |
| `useFilterStudentAttendanceByDate` | `GET` | `/api/Student/FilterStudentsAttendance` | Date filter |

**Interfaces:**
```ts
interface IStudentAttendance {
  id?: string; academicTeamId: string; attendanceDate: Date;
  studentAttendances: IStudentList[];
}
interface IStudentList { studentId: string; status: number; remarks: string; }
interface IAttendencecount {
  totalRunningDays: number; totalPresentDays: number; totalAbsentDays: number;
  totalLateDays: number; totalExcusedDays: number;
}
```

---

### 4.5 Co-curricular Activities

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useFilterActivity` | `GET` | `/api/CocurricularActivities/FilterActivity` | Activity list |
| `useAddActivity` | `POST` | `/api/CocurricularActivities/AddActivity` | Add activity form |
| `useUpdateActivity` | `PATCH` | `/api/CocurricularActivities/UpdateActivity/{id}` | Edit activity |
| `useDeleteActivity` | `DELETE` | `/api/CocurricularActivities/DeleteActivity/{id}` | Delete activity |
| `useFilterParticipation` | `GET` | `/api/CocurricularActivities/FilterParticipation` | Participation list |
| `useAddParticipation` | `POST` | `/api/CocurricularActivities/AddParticipation` | Add participation |
| `useGetAllActivitiesDropdown` | `GET` | `/api/CocurricularActivities/Activity` | Activity dropdown |
| `useGetAllStudents` | `GET` | `/api/Student/all-Students` | Student dropdown |
| `useGetAllEvents` | `GET` | `/api/Academics/GetAllEvents` | Events dropdown |
| `useGetAllClasses` | `GET` | `/api/Academics/all-SchoolClass` | Class dropdown |

**Interfaces:**
```ts
interface Activity {
  id: string; name: string; descriptions: string; activityCategory: number;
  eventId: string; classIds: string[]; isActive: boolean; schoolId: string;
}
interface AddActivityPayload {
  name: string; descriptions: string; activityCategory: number; eventId: string;
  startTime: string; endTime: string; activityDate: string; classIds: string[];
}
interface Participation {
  id: string; studentId: string; activityId: string; awardPosition: number; isActive: boolean;
}
interface AddParticipationPayload { studentId: string; activityId: string; awardPosition: number; }
```

---

### 4.6 Participants (Update/Delete)

| Hook | Method | Endpoint | UI Usage |
|------|--------|----------|----------|
| `useUpdateParticipation` | `PATCH` | `/api/CocurricularActivities/UpdateParticipation/{id}` | Edit participation |
| `useDeleteParticipation` | `DELETE` | `/api/CocurricularActivities/DeleteParticipation/{id}` | Delete participation |

---

*Continued in [Part 2](./API_DOCUMENTATION_PART2.md)*
