import { useGetAllUsers } from "@/app/SuperAdmin/accessControl/user/hooks";
type Props = {
  userId: string;
};

export const UserName = ({ userId }: Props) => {
  const { data: allUser } = useGetAllUsers();
  if (!userId) return <div>Loading...</div>;
  return (
    <p>
      {allUser?.Items.find((i) => i.Id === userId)?.UserName ?? "No User Found"}
    </p>
  );
};
