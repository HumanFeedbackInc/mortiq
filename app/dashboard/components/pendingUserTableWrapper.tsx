"use client";
import UserTable from "./user-table";
import { users } from "./ui/pendingData";
import { SelectedAction } from "./user-table";
import { Check, X } from "lucide-react";
import { UserAccountTableType } from "./ui/data";
import { approvePendingUser } from "@/app/actions";
import { PendingUserData } from "@/app/profile/components/account-setting";
export default function PendingUserTableWrapper({
  pendingUsers,
}: {
  pendingUsers: UserAccountTableType[];
}) {
  const selectedActions: SelectedAction[] = [
    {
      key: "approve",
      label: "Approve",
      icon: <Check />,
      onClick: (selectedUsers) => {
        console.log(selectedUsers);
        for (const user of selectedUsers) {
          const pendingUserData: PendingUserData = {
            userId: user.user_id,
            roleId: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            middleName: "",
            // middleName: user.,
            phoneNumber: user.phone,
            email: user.email,
            // secureFileBucketPath: user.secure_file_bucket_path,
            // imageBucketPath: user.image_bucket_path,
            role: user.role,
            profilePicture: user.profile_picture,
            // pendingUserId:
            phone: user.phone,
            pendingUserId: "",
            imageBucketPath: "",
            secureFileBucketPath: "",
            // accountStatus: user.account_status,
            // createdAt: user.created_at,
          };
          approvePendingUser(pendingUserData);
        }
      },
    },
    {
      key: "reject",
      label: "Reject",
      icon: <X />,
      onClick: (selectedUsers) => {
        console.log(selectedUsers);
      },
    },
  ];

  return (
    <div className="h-full w-full">
      <UserTable
        users={pendingUsers}
        selectedActions={selectedActions}
        title="Pending Users"
      />
    </div>
  );
}
