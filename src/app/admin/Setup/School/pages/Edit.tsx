import { useForm } from "react-hook-form";
import { useGetSchoolById } from "../hooks";
import { ISchool } from "../types/ISchool";
import EditSchoolForm from "../components/EditSchoolForm";
import { useEffect } from "react";
type Props = {
  visible: boolean;
  onClose: () => void;
  SchoolId: string;
  currentPageIndex: number;
};
// enum Status {
//   Manual = 0,
//   Automatic = 1,
// }
const EditSchool = ({
  visible,
  onClose,
  SchoolId,
  currentPageIndex,
}: Props) => {
  const { data: SchoolData } = useGetSchoolById(SchoolId);
 const form = useForm<ISchool>();

useEffect(() => {
  if (SchoolData) {
    form.reset({
      id: SchoolData.id || "",
      name: SchoolData.name || "",
      address: SchoolData.address || "",
      email: SchoolData.email || "",
      shortName: SchoolData.shortName || "",
      contactNumber: SchoolData.contactNumber || "",
      contactPerson: SchoolData.contactPerson || "",
      pan: SchoolData.pan || "",
      imageUrl: SchoolData.imageUrl || "",
      isEnable: SchoolData.isEnable || false,
      isDeleted: SchoolData.isDeleted || false,
      institutionId: SchoolData.institutionId || "",
      billNumberGenerationTypeForPurchase:
        SchoolData.billNumberGenerationTypeForPurchase || 0,
      fiscalYearId: SchoolData.fiscalYearId || "",
      billNumberGenerationTypeForSales:
        SchoolData.billNumberGenerationTypeForSales || 0,
    });
  }
}, [SchoolData, form]);


  if (!visible) return null;
  return (
    <EditSchoolForm
      form={form}
      SchoolId={SchoolId}
      onClose={() => onClose()}
      currentPageIndex={currentPageIndex}
    />
  );
};
export default EditSchool;
