"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { IStudent } from "../types/IStudents";
import { useAddStudent } from "../hooks";
import toast from "react-hot-toast";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import {
  useGetAllProvince,
  useGetDistrictByProvince,
  useGetMunicipalityByDistrict,
  useGetVDCByDistrict,
} from "@/components/common/hooks";
import { useGetAllParents } from "../../Parent/hooks";
import { useGetAllClass } from "@/app/enduser/Academics/Class/hooks";
type Props = {
  form: UseFormReturn<IStudent>;
  onClose: () => void;
};
const AddStudentForm = ({ form, onClose }: Props) => {
  const addStudent = useAddStudent();
  const { handleError, clearError } = useErrorHandler();
  const { data: allProvince } = useGetAllProvince();
  const { data: allClass } = useGetAllClass();
  const [selectedClassId, setSelectedClassId] = useState<string | null>("");
  const [studentStatus, setStudentStatus] = useState<number | null>(null);
  const [genderStatus, setGenderStatus] = useState<number | null>(null);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    null
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
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
  const onSubmit: SubmitHandler<IStudent> = async (data) => {
    clearError();
    try {
      await toast.promise(addStudent.mutateAsync(data), {
        loading: "Adding Student...",
        success: "Successfully added Student",
      });
      handleClose();
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [studentImgPath, setStudentImgPath] = useState<string>("");

  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setStudentImgPath(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const [selectedParenId, setSelectedParenId] = useState<string | null>(null);
  const { data: allParents } = useGetAllParents();
  return (
    <div className=" inset-0 flex items-center justify-center  w-full h-full">
      <div className="w-full  h-[100%] bg-[#ffffff] dark:bg-[#27272a] p-4 overflow-auto relative dark:text-white ">
        <fieldset className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
              Add Student
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 border-b pb-2">
                Personal Details
              </h2>
              <div className="flex">
                <div className="flex flex-col items-center w-[20%]">
                  <div
                    onClick={handleImageClick}
                    className="w-28 h-28 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-teal-500 transition-all"
                  >
                    {studentImgPath ? (
                      <img
                        src={studentImgPath}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Click to add
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[80%]">
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
                    label="Date of Birth"
                    form={form}
                    name="dateOfBirth"
                    inputType="date"
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
                    value={selectedParenId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Parent Name"
                    name="parentId"
                    form={form}
                    required
                    options={allParents?.Items}
                    selected={
                      allParents?.Items?.find(
                        (g) => g.id === selectedParenId
                      ) || null
                    }
                    onSelect={(group) => setSelectedParenId(group?.id ?? null)}
                    getLabel={(g) => g?.fullName ?? ""}
                    getValue={(g) => g?.id ?? ""}
                  />
                </div>
              </div>
            </section>

            {/* Address Details */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 border-b pb-2">
                Address Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputElement
                  label="Address"
                  form={form}
                  name="address"
                  placeholder="Enter Address"
                />
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
                  onSelect={(group) => setSelectedProvinceId(group?.Id ?? null)}
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
                    filteredDistrict?.find(
                      (g) => g.Id === selectedDistrictId
                    ) || null
                  }
                  onSelect={(group) => setSelectedDistrictId(group?.Id ?? null)}
                  getLabel={(g) => g?.districtNameInEnglish ?? ""}
                  getValue={(g) => g?.Id ?? ""}
                />
                <AppCombobox
                  value={selectedMunicipalityId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  disabled={selectedVdcId !== 0 && selectedVdcId !== null}
                  label="Municipality"
                  name="municipalityId"
                  form={form}
                  options={filteredMunicipality}
                  selected={
                    filteredMunicipality?.find(
                      (g) => g.Id === selectedMunicipalityId
                    ) || null
                  }
                  onSelect={(group) =>
                    setSelectedMunicipalityId(group?.Id ?? null)
                  }
                  getLabel={(g) => g?.MunicipalityNameinEnglish ?? ""}
                  getValue={(g) => g?.Id ?? ""}
                />
                <AppCombobox
                  value={selectedVdcId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="VDC"
                  disabled={
                    selectedMunicipalityId !== 0 &&
                    selectedMunicipalityId !== null
                  }
                  name="vdcid"
                  form={form}
                  options={filteredVdc}
                  selected={
                    filteredVdc?.find((g) => g.Id === selectedVdcId) || null
                  }
                  onSelect={(group) => setSelectedVdcId(group?.Id ?? null)}
                  getLabel={(g) => g?.VdcNameInNepali ?? ""}
                  getValue={(g) => g?.Id ?? ""}
                />
                <InputElement
                  label="Ward Number"
                  form={form}
                  name="wardNumber"
                  inputType="number"
                  placeholder="Enter Ward Number"
                />
              </div>
            </section>

            {/* Educational Details */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 border-b pb-2">
                Educational Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  label="Enrollment Date"
                  form={form}
                  name="enrollmentDate"
                  inputType="date"
                />
                <AppCombobox
                  value={selectedClassId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Class"
                  name="classId"
                  form={form}
                  required
                  options={allClass?.Items}
                  selected={
                    allClass?.Items?.find((g) => g.id === selectedClassId) ||
                    null
                  }
                  onSelect={(group) => setSelectedClassId(group?.id ?? null)}
                  getLabel={(g) => g?.name ?? ""}
                  getValue={(g) => g?.id ?? ""}
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
            </section>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <ButtonElement
                type="submit"
                text="Submit"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
              />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default AddStudentForm;
