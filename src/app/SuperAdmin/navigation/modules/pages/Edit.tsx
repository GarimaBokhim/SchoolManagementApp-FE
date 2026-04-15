"use client";
import { useForm } from "react-hook-form";
import EditModuleForm from "../components/EditModuleForm";
import { useGetModulesById } from "../hooks";
import { ModuleFormValues } from "../types/ModuleForm";

interface Props {
  visible: boolean;
  modulesId: string;
  onClose: () => void;
}

const EditModule = ({ visible, modulesId, onClose }: Props) => {
  const { data: module } = useGetModulesById(modulesId);

  const form = useForm<ModuleFormValues>({
    defaultValues: {
      name: "",
      description: "",
      targetUrl: "",
      iconUrl: "",
      rank: "",
      appId: "",
      isActive: false,
    },
  });

  if (!visible) return null;

  return (
    <EditModuleForm
      form={form}
      moduleId={modulesId}
      onClose={onClose}
    />
  );
};

export default EditModule;