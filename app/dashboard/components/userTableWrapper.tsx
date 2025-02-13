"use client";
import UserTable from "./user-table";
import { users } from "./ui/data";
import { SelectedAction } from "./user-table";
import { Trash, Pencil, Mail, MessageCircle } from "lucide-react";
import { UserAccountTableType } from "./ui/data";
import { useDisclosure } from "@heroui/react";
import EditUserModal from "./edit-user-modal";
import { useState } from "react";
import {
  UpdateExistingUser,
  UpdateUser,
  UpdateExistingUserType,
} from "@/app/actions";
import { PendingUserData } from "@/app/profile/components/account-setting";
import { useRouter } from "next/navigation";
export default function UserTableWrapper({
  users,
}: {
  users: UserAccountTableType[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<UserAccountTableType | null>(
    null
  );
  const [tableUsers, setTableUsers] = useState<UserAccountTableType[]>(users);
  const router = useRouter();
  const selectedActions: SelectedAction[] = [
    {
      key: "delete",
      label: "Delete",
      icon: <Trash />,
      onClick: (selectedUsers) => {
        console.log(selectedUsers);
      },
    },
    {
      key: "edit",
      label: "Edit",
      icon: <Pencil />,
      onClick: (selectedUsers) => {
        setSelectedUser(selectedUsers[0]);
        onOpen();
      },
    },
    {
      key: "send-email",
      label: "Send email",
      icon: <Mail />,
      onClick: (selectedUsers) => {
        console.log(selectedUsers);
      },
    },
    {
      key: "send-sms",
      label: "Send SMS",
      icon: <MessageCircle />,
      onClick: (selectedUsers) => {
        console.log(selectedUsers);
      },
    },
  ];

  const handleSaveUser = async (updatedUser: UpdateExistingUserType) => {
    const pendingUserData: UpdateExistingUserType = {
      ...updatedUser,
      phoneNumber: updatedUser.phoneNumber || "",
      userId: updatedUser.userId,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
    };
    console.log("pendingUserData");
    console.log(pendingUserData);
    await UpdateExistingUser(pendingUserData);

    // Map the updated user data to match the table's UserAccountTableType format
    // setTableUsers((prevUsers) =>
    //   prevUsers.map((user) =>
    //     user.user_id === updatedUser.userId
    //       ? {
    //           ...user,
    //           first_name: updatedUser.firstName,
    //           last_name: updatedUser.lastName,
    //           role: updatedUser.role,
    //           phone: updatedUser.phoneNumber || user.phone,
    //           account_id: user.account_id,
    //           email: user.email,
    //           profile_picture: user.profile_picture,
    //           account_status: user.account_status,
    //           created_at: user.created_at,
    //         }
    //       : user
    //   )
    // );

    onOpenChange();
  };

  return (
    <div className="h-full w-full overflow-x-scroll">
      <UserTable
        users={tableUsers}
        selectedActions={selectedActions}
        title="Active Users"
      />
      {selectedUser && (
        <EditUserModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          user={selectedUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
