import { useGetUserById } from "@/app/SuperAdmin/accessControl/user/hooks";
type Props = {
  userId: string;
};

export const UserName = ({ userId }: Props) => {
  const { data: user } = useGetUserById(userId);
  if (!user) return <div>Loading...</div>;
  return <div>{user.userName ?? "No User Found"}</div>;
};
