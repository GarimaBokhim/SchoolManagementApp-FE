'use client';
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useEffect, useState, useRef } from "react";
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
import { useGetAllParents } from "../../_Parent/hooks";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";
import { useFilterFeeCategoryByDate } from "@/app/enduser/schoolFee/_FeeCategory/hooks";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

const GENDER_OPTIONS = [
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Other" },
]

const normalizeGenderStatus = (raw: unknown): number => {
  console.log('[EditStudentForm] normalizeGenderStatus input:', raw, typeof raw);
  if (typeof raw === "number") {
    if (raw >= 1 && raw <= 3) {
      console.log('[EditStudentForm] normalizeGenderStatus output (valid number):', raw);
      return raw;
    }
    if (raw >= 0 && raw <= 2) {
      const converted = raw + 1;
      console.log('[EditStudentForm] normalizeGenderStatus output (legacy conversion):', converted);
      return converted;
    }
  }
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (normalized === "male") {
      console.log('[EditStudentForm] normalizeGenderStatus output (male string):', 1);
      return 1;
    }
    if (normalized === "female") {
      console.log('[EditStudentForm] normalizeGenderStatus output (female string):', 2);
      return 2;
    }
    if (normalized === "other") {
      console.log('[EditStudentForm] normalizeGenderStatus output (other string):', 3);
      return 3;
    }
    const asNumber = Number(normalized);
    if (!Number.isNaN(asNumber)) {
      if (asNumber >= 1 && asNumber <= 3) {
        console.log('[EditStudentForm] normalizeGenderStatus output (number string):', asNumber);
        return asNumber;
      }
      if (asNumber >= 0 && asNumber <= 2) {
        const converted = asNumber + 1;
        console.log('[EditStudentForm] normalizeGenderStatus output (legacy number string):', converted);
        return converted;
      }
    }
  }
  console.log('[EditStudentForm] normalizeGenderStatus output (default):', 1);
  return 1;
};

const resolveStudentImageUrl = (student: IStudent): string => {
  const rawPath = (student.imageUrl || (typeof student.studentImg === "string" ? student.studentImg : "") || "").trim();
  console.log('[EditStudentForm] resolveStudentImageUrl rawPath:', rawPath);
  if (!rawPath) return "";
  if (/^https?:\/\//i.test(rawPath) || rawPath.startsWith("blob:")) {
    console.log('[EditStudentForm] resolveStudentImageUrl absolute URL:', rawPath);
    return rawPath;
  }
  const base = BASE_URL.replace(/\/+$/, "");
  const path = rawPath.replace(/^\/+/, "");
  const fullUrl = base ? `${base}/${path}` : `/${path}`;
  console.log('[EditStudentForm] resolveStudentImageUrl constructed URL:', fullUrl);
  return fullUrl;
};

type Props = {
  form: UseFormReturn<IStudent>;
  onClose: () => void;
  studentId: string;
};

const EditStudentForm = ({ form, onClose, studentId }: Props) => {
  console.log('[EditStudentForm] Component rendering with studentId:', studentId);
  
  const editStudent = useEditStudent();
  const { handleError, clearError } = useErrorHandler();
  const { data: allProvince } = useGetAllProvince();
  const { data: StudentData } = useGetStudentById(studentId);
  const { data: allClass } = useGetAllClass();

  const { data: allFeeCategories } = useFilterFeeCategoryByDate(
    '?startDate=2080-01-01&endDate=2090-01-01&IsPagination=false'
  );

  // FIX 1: Changed from number | undefined to number | null to match state types
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedFeeCategoryId, setSelectedFeeCategoryId] = useState<string | null>(null);

  // Fetch ALL parents (no pagination) so mapping works reliably
  const { data: allParents } = useGetAllParents('?IsPagination=false');

  // FIX 2: Changed from number | null to number | null (kept same but ensure no undefined)
  const [selectedVdcId, setSelectedVdcId] = useState<number | null>(null);
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<number | null>(null);

  const { data: filteredDistrict } = useGetDistrictByProvince(selectedProvinceId ?? undefined);
  const { data: filteredVdc } = useGetVDCByDistrict(selectedDistrictId ?? undefined);
  const { data: filteredMunicipality } = useGetMunicipalityByDistrict(selectedDistrictId ?? undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [studentImgPath, setStudentImgPath] = useState<string>('');
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  const selectedGenderStatus = normalizeGenderStatus(form.watch("genderStatus"));

  // Debug: Log state updates
  useEffect(() => {
    console.log('[EditStudentForm] State updated:', {
      selectedProvinceId,
      selectedDistrictId,
      selectedParentId,
      selectedClassId,
      selectedVdcId,
      selectedMunicipalityId,
      selectedFeeCategoryId
    });
  }, [selectedProvinceId, selectedDistrictId, selectedParentId, selectedClassId, selectedVdcId, selectedMunicipalityId, selectedFeeCategoryId]);

  // Debug: Log API data
  useEffect(() => {
    if (allProvince) {
      console.log('[EditStudentForm] allProvince loaded:', {
        items: allProvince.Items,
        count: allProvince.Items?.length
      });
    }
  }, [allProvince]);

  useEffect(() => {
    if (StudentData) {
      console.log('[EditStudentForm] StudentData loaded:', {
        id: StudentData.id,
        provinceId: StudentData.provinceId,
        districtId: StudentData.districtId,
        municipalityId: StudentData.municipalityId,
        vdcid: StudentData.vdcid,
        wardNumber: StudentData.wardNumber,
        parentId: StudentData.parentId,
        classId: StudentData.classId
      });
    }
  }, [StudentData]);

  useEffect(() => {
    if (allClass) {
      console.log('[EditStudentForm] allClass loaded:', {
        items: allClass.Items,
        count: allClass.Items?.length
      });
    }
  }, [allClass]);

  useEffect(() => {
    if (allParents) {
      console.log('[EditStudentForm] allParents loaded:', {
        items: allParents.Items,
        count: allParents.Items?.length
      });
    }
  }, [allParents]);

  useEffect(() => {
    if (filteredDistrict) {
      console.log('[EditStudentForm] filteredDistrict loaded:', {
        provinceId: selectedProvinceId,
        districts: filteredDistrict,
        count: filteredDistrict?.length
      });
    }
  }, [filteredDistrict, selectedProvinceId]);

  useEffect(() => {
    if (filteredMunicipality) {
      console.log('[EditStudentForm] filteredMunicipality loaded:', {
        districtId: selectedDistrictId,
        municipalities: filteredMunicipality,
        count: filteredMunicipality?.length
      });
    }
  }, [filteredMunicipality, selectedDistrictId]);

  useEffect(() => {
    if (filteredVdc) {
      console.log('[EditStudentForm] filteredVdc loaded:', {
        districtId: selectedDistrictId,
        vdcs: filteredVdc,
        count: filteredVdc?.length
      });
    }
  }, [filteredVdc, selectedDistrictId]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('[EditStudentForm] New image selected:', file.name);
      setStudentImgPath(URL.createObjectURL(file));
      form.setValue('studentImg', file);
    }
  };

  const handleClose = () => {
    console.log('[EditStudentForm] Form closed');
    form.reset();
  };

  // ✅ FIX 1: Sync selectedParentId whenever StudentData loads
  useEffect(() => {
    if (StudentData) {
      console.log('[EditStudentForm] Syncing StudentData to form...');
      
      const normalizedGenderStatus = normalizeGenderStatus(StudentData?.genderStatus);
      console.log('[EditStudentForm] Normalized gender status:', normalizedGenderStatus);
      
      const formValues = {
        firstName: StudentData?.firstName ?? "",
        middleName: StudentData?.middleName ?? "",
        lastName: StudentData?.lastName ?? "",
        registrationNumber: StudentData?.registrationNumber ?? "",
        genderStatus: normalizedGenderStatus,
        studentStatus: StudentData?.studentStatus ?? 0,
        dateOfBirth: StudentData?.dateOfBirth ?? new Date(),
        email: StudentData?.email ?? "",
        phoneNumber: StudentData?.phoneNumber ?? "",
        studentImg: StudentData?.studentImg ?? "",
        address: StudentData?.address ?? "",
        enrollmentDate: StudentData?.enrollmentDate ?? new Date(),
        parentId: StudentData?.parentId ?? "",
        classSectionId: StudentData?.classSectionId ?? undefined,
        classId: StudentData?.classId ?? "",
        feeCategoryId: StudentData?.feeCategoryId ?? "",
        provinceId: StudentData?.provinceId ?? 0,
        districtId: StudentData?.districtId ?? 0,
        municipalityId: StudentData?.municipalityId ?? 0,
        vdcid: StudentData?.vdcid ?? 0,
        wardNumber: StudentData?.wardNumber ?? 0,
      };
      
      console.log('[EditStudentForm] Setting form values:', formValues);
      form.reset(formValues);

      console.log('[EditStudentForm] Setting state values:', {
        districtId: StudentData.districtId,
        provinceId: StudentData.provinceId,
        parentId: StudentData.parentId,
        vdcid: StudentData.vdcid,
        classId: StudentData.classId,
        municipalityId: StudentData.municipalityId,
        feeCategoryId: StudentData.feeCategoryId
      });

      // FIX: Convert undefined to null when setting state
      setSelectedDistrictId(StudentData.districtId ?? null);
      setSelectedProvinceId(StudentData.provinceId ?? null);
      setSelectedParentId(StudentData.parentId ?? null);
      setSelectedVdcId(StudentData.vdcid ?? null);
      setSelectedClassId(StudentData.classId ?? null);
      setSelectedMunicipalityId(StudentData.municipalityId ?? null);
      setSelectedFeeCategoryId(StudentData.feeCategoryId ?? null);

      const fullUrl = resolveStudentImageUrl(StudentData);
      if (fullUrl) {
        console.log('[EditStudentForm] Setting image URL:', fullUrl);
        setStudentImgPath(fullUrl)
        setExistingImageUrl(fullUrl)
      }
    }
  }, [StudentData, form]);

  // ✅ FIX 2: Re-sync selected parent when allParents data arrives AFTER StudentData
  useEffect(() => {
    if (allParents?.Items && StudentData?.parentId) {
      console.log('[EditStudentForm] Checking parent exists in allParents...');
      const parentExists = allParents.Items.find(
        (p) => p.id === StudentData.parentId
      );
      if (parentExists) {
        console.log('[EditStudentForm] Parent found, setting selectedParentId:', StudentData.parentId);
        setSelectedParentId(StudentData.parentId);
        form.setValue('parentId', StudentData.parentId);
      } else {
        console.log('[EditStudentForm] Parent not found in list');
      }
    }
  }, [allParents, StudentData?.parentId, form]);

  const onSubmit: SubmitHandler<IStudent> = async (data) => {
    console.log('[EditStudentForm] Submitting form with data:', data);
    clearError();
    try {
      const formData = new FormData();
      
      // FIX 3: Add null checks with fallbacks for all formData.append calls
      formData.append('firstName', data.firstName ?? '');
      formData.append('feeCategoryId', data.feeCategoryId ?? '');
      formData.append('middleName', data.middleName ?? '');
      formData.append('lastName', data.lastName ?? '');
      formData.append('registrationNumber', data.registrationNumber ?? '');
      formData.append('genderStatus', String(data.genderStatus ?? 1));
      formData.append('studentStatus', String(data.studentStatus ?? 0));
      formData.append('dateOfBirth', data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : '');
      formData.append('email', data.email ?? '');
      formData.append('phoneNumber', data.phoneNumber ?? '');
      formData.append('address', data.address ?? '');
      formData.append('enrollmentDate', data.enrollmentDate ? new Date(data.enrollmentDate).toISOString() : '');
      formData.append('parentId', data.parentId ?? '');
      formData.append('classId', data.classId ?? '');
      formData.append('classSectionId', data.classSectionId ?? '');
      formData.append('provinceId', String(data.provinceId ?? 0));
      formData.append('districtId', String(data.districtId ?? 0));
      formData.append('municipalityId', String(data.municipalityId ?? 0));
      formData.append('vdcId', String(data.vdcid ?? 0));
      formData.append('wardNumber', String(data.wardNumber ?? 0));

      console.log('[EditStudentForm] FormData entries:');
      for (let pair of formData.entries()) {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }

      if (data.studentImg instanceof File) {
        console.log('[EditStudentForm] Adding new image file:', data.studentImg.name);
        formData.append('studentImg', data.studentImg);
      } else if (existingImageUrl) {
        console.log('[EditStudentForm] Using existing image URL:', existingImageUrl);
        formData.append('studentImgUrl', existingImageUrl);
      }

      await toast.promise(
        editStudent.mutateAsync({ id: studentId, data: formData as any }),
        {
          loading: "Updating Student...",
          success: "Successfully Updated Student",
        }
      );
      console.log('[EditStudentForm] Update successful');
      handleClose();
      onClose();
    } catch (error) {
      console.error('[EditStudentForm] Error submitting form:', error);
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
        <fieldset className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Update Student
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="text-red-400 text-2xl hover:text-red-500"
            >
              <X strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* ===== Personal Details ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                Personal Details
              </h2>

              <div className="flex justify-center mb-6">
                <div className="flex flex-col items-center">
                  <div
                    onClick={handleImageClick}
                    className="w-28 h-28 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-teal-500 transition-all"
                  >
                    {studentImgPath ? (
                      <img
                        src={studentImgPath}
                        alt="Profile"
                        className="object-cover w-full h-full"
                        onError={() => {
                          console.log('[EditStudentForm] Image failed to load:', studentImgPath);
                          setStudentImgPath('');
                        }}
                        onLoad={() => console.log('[EditStudentForm] Image loaded successfully:', studentImgPath)}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm text-center px-2">
                        Click to add image
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    name="imageUrl"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {existingImageUrl && !(form.getValues('studentImg') instanceof File) && (
                    <p className="text-xs text-gray-500 mt-2">Current image shown</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <InputElement label="First Name" form={form} name="firstName" placeholder="Enter First Name" required />
                <InputElement label="Middle Name" form={form} name="middleName" placeholder="Enter Middle Name" />
                <InputElement label="Last Name" form={form} name="lastName" placeholder="Enter Last Name" />
                <InputElement label="Date of Birth" form={form} name="dateOfBirth" inputType="date" />

                <AppCombobox
                  label="Gender"
                  dropdownPositionClass="absolute"
                  name="genderStatus"
                  form={form}
                  value={selectedGenderStatus}
                  options={GENDER_OPTIONS}
                  dropDownWidth="w-full"
                  selected={
                    GENDER_OPTIONS.find((g) => g.id === selectedGenderStatus) ||
                    null
                  }
                  onSelect={(option) => {
                    console.log('[EditStudentForm] Gender selected:', option);
                    form.setValue('genderStatus', option?.id ?? 1);
                  }}
                  getLabel={(o) => o?.name || ""}
                  getValue={(o) => o?.id ?? ""}
                />

                <AppCombobox
                  value={selectedParentId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Parent Name"
                  name="parentId"
                  form={form}
                  required
                  options={allParents?.Items}
                  selected={
                    allParents?.Items?.find((g) => g.id === selectedParentId) ?? null
                  }
                  onSelect={(group) => {
                    console.log('[EditStudentForm] Parent selected:', group);
                    setSelectedParentId(group?.id ?? null);
                    form.setValue('parentId', group?.id ?? '');
                  }}
                  getLabel={(g) => g?.fullName ?? ""}
                  getValue={(g) => g?.id ?? ""}
                />
              </div>
            </section>

            {/* ===== Address Details ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                Address Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <InputElement label="Address" form={form} name="address" placeholder="Enter Address" />
                <AppCombobox
                  value={selectedProvinceId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Province"
                  name="provinceId"
                  form={form}
                  required
                  options={allProvince?.Items}
                  selected={allProvince?.Items?.find((g) => g.Id === selectedProvinceId) || null}
                  onSelect={(group) => {
                    console.log('[EditStudentForm] Province selected:', group);
                    setSelectedProvinceId(group?.Id ?? null);
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
                  selected={filteredDistrict?.find((g) => g.Id === selectedDistrictId) || null}
                  onSelect={(group) => {
                    console.log('[EditStudentForm] District selected:', group);
                    setSelectedDistrictId(group?.Id ?? null);
                  }}
                  getLabel={(g) => g?.districtNameInEnglish ?? ""}
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
                  selected={filteredMunicipality?.find((g) => g.Id === selectedMunicipalityId) || null}
                  onSelect={(group) => {
                    console.log('[EditStudentForm] Municipality selected:', group);
                    setSelectedMunicipalityId(group?.Id ?? null);
                  }}
                  getLabel={(g) => g?.MunicipalityNameinEnglish ?? ""}
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
                  selected={filteredVdc?.find((g) => g.Id === selectedVdcId) || null}
                  onSelect={(group) => {
                    console.log('[EditStudentForm] VDC selected:', group);
                    setSelectedVdcId(group?.Id ?? null);
                  }}
                  getLabel={(g) => g?.VdcNameInNepali ?? ""}
                  getValue={(g) => g?.Id ?? ""}
                />
                <InputElement label="Ward Number" form={form} name="wardNumber" inputType="number" placeholder="Enter Ward Number" />
              </div>
            </section>

            {/* ===== Educational Details ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                Educational Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <InputElement label="Registration Number" form={form} name="registrationNumber" placeholder="Enter Registration Number" />
                <InputElement label="Email" form={form} name="email" type="email" placeholder="Enter Email" />
                <InputElement label="Phone Number" form={form} name="phoneNumber" placeholder="Enter Phone Number" />
                <InputElement label="Enrollment Date" form={form} name="enrollmentDate" inputType="date" />
                <AppCombobox
                  value={selectedClassId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Class"
                  name="classId"
                  form={form}
                  required
                  options={allClass?.Items}
                  selected={allClass?.Items?.find((g) => g.id === selectedClassId) || null}
                  onSelect={(group) => {
                    console.log('[EditStudentForm] Class selected:', group);
                    setSelectedClassId(group?.id ?? null);
                    form.setValue('classId', group?.id ?? '');
                  }}
                  getLabel={(g) => g?.name ?? ""}
                  getValue={(g) => g?.id ?? ""}
                />
                <AppCombobox
                  value={selectedFeeCategoryId}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute"
                  label="Fee Category"
                  name="feeCategoryId"
                  form={form}
                  options={allFeeCategories?.Items}
                  selected={allFeeCategories?.Items?.find((g) => g.id === selectedFeeCategoryId) || null}
                  onSelect={(group) => {
                    console.log('[EditStudentForm] Fee Category selected:', group);
                    setSelectedFeeCategoryId(group?.id ?? null);
                    form.setValue('feeCategoryId', group?.id ?? '');
                  }}
                  getLabel={(g) => g?.name ?? ""}
                  getValue={(g) => g?.id ?? ""}
                />
              </div>
            </section>

            <div className="flex justify-center mt-6">
              <ButtonElement type="submit" text={"Update"} />
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default EditStudentForm;