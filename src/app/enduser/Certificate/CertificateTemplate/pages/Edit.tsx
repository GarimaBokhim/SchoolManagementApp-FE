import { useForm } from "react-hook-form";
import { ITemplate } from "../types/ITemplate";
import EditTemplateForm from "../components/EditTemplateForm";
import { useGetTemplateById } from "../hooks";

interface Props {
  visible: boolean;
  onClose: () => void;
  TemplateId: string;
}

const EditTemplate = ({ visible, onClose, TemplateId }: Props) => {
  const { data: TemplateData } = useGetTemplateById(TemplateId);

  const form = useForm<ITemplate>({
    defaultValues: {
      templateName: TemplateData?.templateName ?? "",
      templateType: TemplateData?.templateType ?? "",
      htmlTemplate: TemplateData?.htmlTemplate ?? "",
      templateVersion: TemplateData?.templateVersion ?? "",
    },
  });

  if (!visible) return null;

  return (
    <EditTemplateForm form={form} onClose={onClose} TemplateId={TemplateId} />
  );
};

export default EditTemplate;
