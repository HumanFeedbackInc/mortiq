"use client";
import UserTable from "./user-table";
import { users } from "./ui/pendingData";
import { SelectedAction } from "./user-table";
import { Check, X } from "lucide-react";
import { UserAccountTableType } from "./ui/data";
export default function PendingUserTableWrapper({pendingUsers}: {pendingUsers: UserAccountTableType[]}) {
    const selectedActions: SelectedAction[] = [
        { 
            key: "approve",
            label: "Approve",
            icon: <Check />,
            onClick: (selectedUsers) => {
                console.log(selectedUsers);
            }
        },
        { 
            key: "reject", 
            label: "Reject", 
            icon: <X />,
            onClick: (selectedUsers) => {
                console.log(selectedUsers);
            }
        },
    ];

    return (
        <div className="h-full w-full overflow-x-scroll">
            <UserTable users={pendingUsers} selectedActions={selectedActions} title="Pending Users" />
        </div>
    )
}