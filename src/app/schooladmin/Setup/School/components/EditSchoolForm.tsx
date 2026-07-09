"use client";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { ISchool } from "../types/ISchool";
import { useEditSchool, useGetAllSchool } from "../hooks";
import { InputElement } from "@/components/Input/InputElement";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Toast } from "@/components/Toast/toast";
import { AxiosError } from "axios";
import { useGetAllInstitution } from "@/app/SuperAdmin/institutionSetup/Institution/hooks";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useRef, useState } from "react";
import { X } from "lucide-react";

type Props = {
  form: UseFormReturn<ISchool>;
  SchoolId: string;
  onClose: () => void;
  currentPageIndex: number;
};
const EditSchoolForm = ({
  form,
  onClose,
  SchoolId,
  currentPageIndex,
}: Props) => {
  const editCompany = useEditSchool();
  const { data: institution } = useGetAllInstitution();
  const pageSize = 5;
  const query = `?pagesize=${pageSize}&pageIndex=${currentPageIndex}&IsPagination=true`;
  const { refetch } = useGetAllSchool(query);
  const [institutionId, setInstitutionId] = useState("");
  const [schoollogo, setschoollogo] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageClick = () => fileInputRef.current?.click();

  const handleSelectInstitution = (id: string) => {
    form.setValue("institutionId", id);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setschoollogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<ISchool> = async (formData) => {
    try {
      const data = new FormData();
      data.append("name", formData.name ?? "");
      data.append("address", formData.address ?? "");
      data.append("email", formData.email ?? "");
      data.append("shortName", formData.shortName ?? "");
      data.append("contactNumber", formData.contactNumber ?? "");
      data.append("contactPerson", formData.contactPerson ?? "");
      data.append("pan", formData.pan ?? "");
      data.append("institutionId", formData.institutionId ?? "");
      data.append("fiscalYearId", formData.fiscalYearId ?? "");
      data.append("academicYearId", formData.academicYearId ?? "");
      data.append("isEnable", String(formData.isEnable ?? false));
      data.append("isDeleted", String(formData.isDeleted ?? false));
      data.append(
        "billNumberGenerationTypeForPurchase",
        String(formData.billNumberGenerationTypeForPurchase ?? 0)
      );
      data.append(
        "billNumberGenerationTypeForSales",
        String(formData.billNumberGenerationTypeForSales ?? 0)
      );
      // Append logo file if a new one was selected
      if (fileInputRef.current?.files?.[0]) {
        data.append("logoUrl", fileInputRef.current.files[0]);
      }

      await editCompany.mutateAsync({
        id: SchoolId,
        data,
      });

      Toast.success("Successfully Updated School");
      refetch();
      onClose();
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        Toast.error(error.response?.data);
      } else {
        Toast.error("Failed to update School" + error);
      }
    } finally {
      onClose();
    }
  };

  return (
    <div
      id="container"
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-80 backdrop-blur-sm overflow-y-auto ml-56 md:ml-64 sm:ml-16 "
    >
      <div className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[50%] xl:max-w-[40%] bg-white rounded-xl shadow-2xl p-4 sm:p-6 m-4">
        <div className="w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg ml-4 font-semibold">Update School</h1>
              <button
                type="button"
                onClick={onClose}
                className="text-red-400 mr-2 text-2xl hover:text-red-500 "
              >
                <X strokeWidth={3} />
              </button>
            </div>
            <div className="flex justify-evenly mt-6">
              <div>
                <div className="mb-4">
                  <InputElement
                    label="Name"
                    layout="row"
                    form={form}
                    name="name"
                    placeholder="Enter School name"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Address"
                    layout="row"
                    form={form}
                    name="address"
                    placeholder="Enter address"
                    customStyle="placeholder:text-red-300"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Email"
                    layout="row"
                    form={form}
                    name="email"
                    placeholder="Enter email"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Short Name"
                    layout="row"
                    form={form}
                    name="shortName"
                    placeholder="Enter shortName"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Contact Number"
                    layout="row"
                    form={form}
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Contact Person"
                    layout="row"
                    form={form}
                    name="contactPerson"
                    placeholder="Enter Contact Person"
                  />
                </div>
                <div className="mb-4">
                  <InputElement
                    label="Pan"
                    layout="row"
                    form={form}
                    name="pan"
                    placeholder="Enter pan"
                  />
                </div>
              </div>
              <div className="my-4">
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                  <div
                    onClick={handleImageClick}
                    className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-teal-500 transition"
                  >
                    {schoollogo ? (
                      <img
                        src={schoollogo}
                        alt="School Logo"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Click to add</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="my-4 justify-between mt-[3%]">
                  <AppCombobox
                    required
                    name="institutionId"
                    form={form}
                    value={institutionId}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Institution"
                    options={institution?.Items}
                    selected={
                      institution?.Items.find((g) => g.id === institutionId) ||
                      null
                    }
                    onSelect={(group) => {
                      if (group) {
                        setInstitutionId(group.id || "");
                        handleSelectInstitution(group.id || "");
                      }
                    }}
                    getLabel={(g) => g?.name || ""}
                    getValue={(g) => g?.id ?? ""}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 mx-10">
              <ButtonElement
                type="submit"
                customStyle="hover:bg-teal-700 transition-all !text-xm !font-bold"
                text={"Submit"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSchoolForm;