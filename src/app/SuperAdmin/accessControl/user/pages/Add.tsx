"use client";
import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
import AddUserForm from "../components/AddUserForm";
import { IUserResponse } from "../types/IUserResponse";
import { useEffect } from "react";
// import { ModuleValidator } from "../validators";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const Add = ({ visible, onClose }: Props) => {
  const form = useForm<IUserResponse>({
    // resolver: yupResolver(ModuleValidator),
    defaultValues: {
      id: "",
      userName: "",
      email: "",
      password: "",
      rolesId: [""],
      institutionId: "",
      schoolIds: [""],
    },
  });

  useEffect(() => {
    if (visible) {
      form.reset({
        id: "",
        userName: "",
        email: "",
        password: "",
        rolesId: [""],
        institutionId: "",
        schoolIds: [""],
      });
    }
  }, [visible, form]);

  if (!visible) return null;

  return <AddUserForm form={form} onClose={onClose} />;
};

export default Add;
