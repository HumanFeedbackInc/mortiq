"use client";
import UserTable from "./user-table";
import { users } from "./ui/data";
import { SelectedAction } from "./user-table";
import { Trash, Pencil, Mail, MessageCircle } from "lucide-react";
import { UserAccountTableType } from "./ui/data";
export default function UserTableWrapper({users}: {users: UserAccountTableType[]}) {
    const selectedActions: SelectedAction[] = [
        { 
            key: "delete",
            label: "Delete",
            icon: <Trash />,
            onClick: (selectedUsers) => {
                console.log(selectedUsers);
            }
        },
        { 
            key: "edit", 
            label: "Edit", 
            icon: <Pencil />,
            onClick: (selectedUsers) => {
                console.log(selectedUsers);
            }
        },
        {
            key: "send-email",
            label: "Send email",
            icon: <Mail />,
            onClick: (selectedUsers) => {
                console.log(selectedUsers);
            }
        },
        {
            key: "send-sms",
            label: "Send SMS",
            icon: <MessageCircle />,
            onClick: (selectedUsers) => {
                console.log(selectedUsers);
            }
        },
            
    ];
    return (
        <div className="h-full w-full overflow-x-scroll">
            <UserTable users={users} selectedActions={selectedActions} title="Active Users" />
        </div>
    )
}