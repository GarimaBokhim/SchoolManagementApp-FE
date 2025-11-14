"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IStudent } from "../types/IStudents";
import { useEditStudent, useGetStudentById } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import {
  useGetAllProvince,
  useGetDistrictByProvince,
  useGetMunicipalityByDistrict,
  useGetVDCByDistrict,
} from "@/components/common/hooks";
import { useGetAllParents } from "../../Parent/hooks";
type Props = {
  form: UseFormReturn<IStudent>;
  onClose: () => void;
  studentId: string;
};
const EditStudentForm = ({ form, onClose, studentId }: Props) => {
  const editStudent = useEditStudent();
  const { handleError, clearError } = useErrorHandler();
  const { data: allProvince } = useGetAllProvince();
  const { data: StudentData } = useGetStudentById(studentId);
  const [studentStatus, setStudentStatus] = useState<number | null>(null);
  const [genderStatus, setGenderStatus] = useState<number | null>(null);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    null
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
  const [selectedParenId, setSelectedParenId] = useState<string | null>(null);
  const { data: allParents } = useGetAllParents();
  const [selectedVdcId, setSelectedVdcId] = useState<number | null>(null);
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<
    number | null
  >(null);
  const { data: filteredDistrict } =
    useGetDistrictByProvince(selectedProvinceId);
  const { data: filteredVdc } = useGetVDCByDistrict(selectedDistrictId);
  const { data: filteredMunicipality } =
    useGetMunicipalityByDistrict(selectedDistrictId);

  const handleClose = () => {
    form.reset();
  };
  useEffect(() => {
    if (StudentData) {
      form.reset({
        firstName: StudentData?.firstName ?? "",
        middleName: StudentData?.middleName ?? "",
        lastName: StudentData?.lastName ?? "",
        registrationNumber: StudentData?.registrationNumber ?? "",
        genderStatus: StudentData?.genderStatus ?? 0,
        studentStatus: StudentData?.studentStatus ?? 0,
        dateOfBirth: StudentData?.dateOfBirth ?? new Date(),
        email: StudentData?.email ?? "",
        phoneNumber: StudentData?.phoneNumber ?? "",
        imageUrl: StudentData?.imageUrl ?? "",
        address: StudentData?.address ?? "",
        enrollmentDate: StudentData?.enrollmentDate ?? new Date(),
        parentId: StudentData?.parentId ?? "",
        classSectionId: null,
        provinceId: StudentData?.provinceId ?? 0,
        districtId: StudentData?.districtId ?? 0,
        wardNumber: StudentData?.wardNumber ?? 0,
      });
      setSelectedDistrictId(StudentData.districtId);
      setSelectedProvinceId(StudentData.provinceId);
      setSelectedParenId(StudentData.parentId);
      setSelectedVdcId(StudentData.vdcid);
      setSelectedMunicipalityId(StudentData.municipalityId);
    }
  }, [StudentData]);
  const onSubmit: SubmitHandler<IStudent> = async (data) => {
    clearError();

    try {
      clearError();
      await toast.promise(
        editStudent.mutateAsync({
          id: studentId,
          data: data,
        }),
        {
          loading: "Submitting Data",
          success: "Successfully Edited Income",
        }
      );
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
               max-h-[95vh] md:max-h-[92vh] h-full 
               rounded-lg overflow-auto p-6 md:p-8 shadow-lg"
      >
        <fieldset className="">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Update Student
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500 "
            >
              <X strokeWidth={3} />
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <InputElement
                label="First Name"
                form={form}
                name="firstName"
                placeholder="Enter First Name"
                required
              />
              <InputElement
                label="Middle Name"
                form={form}
                name="middleName"
                placeholder="Enter Middle Name"
              />
              <InputElement
                label="Last Name"
                form={form}
                name="lastName"
                placeholder="Enter Last Name"
              />
              <InputElement
                label="Registration Number"
                form={form}
                name="registrationNumber"
                placeholder="Enter Registration Number"
              />
              <InputElement
                label="Email"
                form={form}
                name="email"
                type="email"
                placeholder="Enter Email"
              />
              <InputElement
                label="Phone Number"
                form={form}
                name="phoneNumber"
                placeholder="Enter Phone Number"
              />
              <InputElement
                label="Address"
                form={form}
                name="address"
                placeholder="Enter Address"
              />
              <InputElement
                label="Date of Birth"
                form={form}
                name="dateOfBirth"
                inputType="date"
              />
              <InputElement
                label="Enrollment Date"
                form={form}
                name="enrollmentDate"
                inputType="date"
              />
              <AppCombobox
                value={selectedParenId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Parent Name"
                name="parentId"
                form={form}
                required
                options={allParents?.Items}
                selected={
                  allParents?.Items?.find((g) => g.id === selectedParenId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedParenId(group.id || null);
                  } else {
                    setSelectedParenId(null);
                  }
                }}
                getLabel={(g) => g?.fullName ?? ""}
                getValue={(g) => g?.id ?? ""}
              />
              {/* <InputElement
                label="Class Section ID"
                form={form}
                name="classSectionId"
                placeholder="Enter Class Section ID"
              /> */}
              <AppCombobox
                value={selectedProvinceId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Province"
                name="provinceId"
                form={form}
                required
                options={allProvince?.Items}
                selected={
                  allProvince?.Items?.find(
                    (g) => g.Id === selectedProvinceId
                  ) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedProvinceId(group.Id || null);
                  } else {
                    setSelectedProvinceId(null);
                  }
                }}
                getLabel={(g) => g?.provinceNameInEnglish ?? ""}
                getValue={(g) => g?.Id ?? ""}
              />
              <AppCombobox
                value={selectedDistrictId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="District"
                name="districtId"
                form={form}
                required
                options={filteredDistrict}
                selected={
                  filteredDistrict?.find((g) => g.Id === selectedDistrictId) ||
                  null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedDistrictId(group.Id || null);
                  } else {
                    setSelectedDistrictId(null);
                  }
                }}
                getLabel={(g) => g?.districtNameInEnglish ?? ""}
                getValue={(g) => g?.Id ?? ""}
              />
              <AppCombobox
                value={selectedVdcId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="VDC"
                name="vdcid"
                form={form}
                options={filteredVdc}
                selected={
                  filteredVdc?.find((g) => g.Id === selectedVdcId) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedVdcId(group.Id || null);
                  } else {
                    setSelectedVdcId(null);
                  }
                }}
                getLabel={(g) => g?.VdcNameInNepali ?? ""}
                getValue={(g) => g?.Id ?? ""}
              />
              <AppCombobox
                value={selectedMunicipalityId}
                dropDownWidth="w-full"
                dropdownPositionClass="absolute"
                label="Municipality"
                name="municipalityId"
                form={form}
                options={filteredMunicipality}
                selected={
                  filteredMunicipality?.find(
                    (g) => g.Id === selectedMunicipalityId
                  ) || null
                }
                onSelect={(group) => {
                  if (group) {
                    setSelectedMunicipalityId(group.Id || null);
                  } else {
                    setSelectedMunicipalityId(null);
                  }
                }}
                getLabel={(g) => g?.municipalityNameInEnglish ?? ""}
                getValue={(g) => g?.Id ?? ""}
              />
              <InputElement
                label="Ward Number"
                form={form}
                name="wardNumber"
                inputType="number"
                placeholder="Enter Ward Number"
              />
              <AppCombobox
                label="Gender"
                dropdownPositionClass="absolute"
                name="genderStatus"
                value={genderStatus}
                options={[
                  { id: 1, name: "Male" },
                  { id: 2, name: "Female" },
                  { id: 3, name: "Other" },
                ]}
                dropDownWidth="w-full"
                selected={
                  [
                    { id: 1, name: "Male" },
                    { id: 2, name: "Female" },
                    { id: 3, name: "Other" },
                  ].find((g) => g.id === genderStatus) || null
                }
                onSelect={(option) => setGenderStatus(option?.id ?? null)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />

              <AppCombobox
                label="Student Status"
                name="studentStatus"
                dropdownPositionClass="absolute"
                value={studentStatus}
                dropDownWidth="w-full"
                options={[
                  { id: 1, name: "Active" },
                  { id: 2, name: "Inactive" },
                ]}
                selected={
                  [
                    { id: 1, name: "Active" },
                    { id: 2, name: "Inactive" },
                  ].find((s) => s.id === studentStatus) || null
                }
                onSelect={(option) => setStudentStatus(option?.id ?? null)}
                getLabel={(o) => o?.name || ""}
                getValue={(o) => o?.id ?? ""}
              />
            </div>
            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={"Submit"} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditStudentForm;
