"use client";
import { useForm } from "react-hook-form";
import AddModuleForm from "../components/AddModuleForm";
import { useEffect } from "react";
import { ModuleFormValues } from "../types/ModuleForm";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const Add = ({ visible, onClose }: Props) => {
  const form = useForm<ModuleFormValues>({
    defaultValues: {
      name: "",
      description: "",
      targetUrl: "",
      iconUrl: "",
      rank: "",
      appId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (visible) {
      form.reset({
        name: "",
        description: "",
        targetUrl: "",
        iconUrl: "",
        rank: "",
        appId: "",
        isActive: true,
      });
    }
  }, [visible, form]);

  if (!visible) return null;

  return <AddModuleForm form={form} onClose={onClose} />;
};

export default Add;