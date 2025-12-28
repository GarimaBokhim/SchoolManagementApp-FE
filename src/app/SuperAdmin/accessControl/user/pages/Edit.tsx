"use client";
import { useGetUserById } from "../hooks";
import { IUserResponse } from "../types/IUserResponse";
import { useForm } from "react-hook-form";
import EditUserForm from "../components/EditUserForm";

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: string;
  currentPageIndex: number;
}

const EditUser = ({ visible, onClose, userId, currentPageIndex }: Props) => {
  const { data: userData } = useGetUserById(userId);

  const form = useForm<IUserResponse>({
    values: {
      id: userData?.id ?? "",
      userName: userData?.userName ?? "",
      email: userData?.email ?? "",
      password: userData?.password ?? "",
      rolesIds: userData?.rolesIds ?? [""],
      institutionId: userData?.institutionId ?? "",
      schoolIds: userData?.schoolIds ?? [""],
    },
  });

  if (!visible) return null;
  return (
    <EditUserForm
      form={form}
      currentPageIndex={currentPageIndex}
      userId={userId}
      onClose={() => onClose()}
    />
  );
};

export default EditUser;
