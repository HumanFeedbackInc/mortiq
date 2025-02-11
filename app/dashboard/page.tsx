import UserManagementTables from "./components/userManagementTables";

export default function Dashboard() {

  return(
    <div className="flex flex-col gap-6">
      <UserManagementTables />
    </div>
  )
}