import { UUID } from "crypto";
import {DangerCircleSvg} from "./danger-circle";
import {DefaultCircleSvg} from "./default-circle";
import {SuccessCircleSvg} from "./success-circle";
import {WarningCircleSvg} from "./warning-circle";


export type UserAccountTableType = {
  user_id: UUID,
  account_id: UUID,//should this be the same as user_id?
  role: string, //grabbed from user_roles -> roles table CAN BE ADMIN, INVESTOR, BROKER
  first_name: string,
  last_name: string,
  email: string, //grabbed from auth.users table
  phone: string, //grabbed from auth.users table
  profile_picture: string, //uploaded on (pending) account creation
  account_status: string, //grabbed from account table 
  created_at: Date,
}


export const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Pending", uid: "pending"},
  {name: "Inactive", uid: "inactive"},
  {name: "Paused", uid: "paused"},
] as const;

export type StatusOptions = (typeof statusOptions)[number]["name"];

export const statusColorMap: Record<StatusOptions, JSX.Element> = {
  Active: SuccessCircleSvg,
  Inactive: DefaultCircleSvg,
  Paused: DangerCircleSvg,
  Pending: WarningCircleSvg,
};


export type MemberInfo = {
  avatar: string;
  email: string;
  name: string;
};


export type ColumnsKey = keyof UserAccountTableType | "actions";

export const INITIAL_VISIBLE_COLUMNS: ColumnsKey[] = [
  "profile_picture",
  "first_name",
  "last_name",
  "email",
  "role",
  "phone",
  "account_status",
  "created_at",
  "actions",
];

export const columns = [
  {name: "Profile Picture", uid: "profile_picture"},
  {name: "First Name", uid: "first_name"},
  {name: "Last Name", uid: "last_name"},
  {name: "Email", uid: "email"},
  {name: "Phone", uid: "phone"},
  {name: "User ID", uid: "user_id"},
  {name: "Account ID", uid: "account_id"},
  {name: "Role", uid: "role"},
  {name: "Account Status", uid: "account_status"},
  {name: "Created At", uid: "created_at"},
];

const names = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "David Wilson",
  "Eve Martinez",
  "Frank Thompson",
  "Grace Garcia",
  "Hannah Lee",
  "Isaac Anderson",
  "Julia Roberts",
  "Liam Williams",
  "Mia White",
  "Noah Harris",
  "Olivia Martin",
  "Peyton Jones",
  "Quinn Taylor",
  "Ryan Moore",
  "Sophia Davis",
  "Marcus Lopez",
  "Uma Thomas",
  "Victoria Jackson",
  "William Green",
  "Xavier Hill",
  "Yara Scott",
  "Zoe Baker",
  "Aaron Carter",
  "Bella Brown",
  "Carter Black",
  "Daisy Clark",
  "Ethan Hunt",
  "Fiona Apple",
  "George King",
  "Harper Knight",
  "Ivy Lane",
  "Jack Frost",
  "Kylie Reed",
  "Lucas Grant",
  "Molly Shaw",
  "Nathan Ford",
  "Oliver Stone",
  "Penelope Cruz",
  "Quentin Cook",
  "Ruby Fox",
  "Sarah Miles",
  "Travis Shaw",
  "Ursula Major",
  "Vera Mindy",
  "Wesley Snipes",
  "Xena Warrior",
  "Yvette Fielding",
];

const generateMockUserData = (count: number): UserAccountTableType[] => {
  const mockData: UserAccountTableType[] = [];

  for (let i = 0; i < count; i++) {
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const user: UserAccountTableType = {
      user_id: crypto.randomUUID() as UUID,
      account_id: crypto.randomUUID() as UUID,
      role: Math.random() > 0.6 ? "ADMIN" : Math.random() > 0.3 ? "INVESTOR" : "BROKER",
      first_name: selectedName.split(" ")[0],
      last_name: selectedName.split(" ")[1],
      email: `${selectedName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: `+1${Math.floor(Math.random() * 1000000000)}`,
      profile_picture: `https://i.pravatar.cc/150?img=${i}`,
      account_status: Math.random() > 0.6 ? "Active" : Math.random() > 0.3 ? "Pending" : "Paused",
      created_at: new Date(new Date().getTime() - Math.random() * (24 * 60 * 60 * 1000 * 365)),
    };

    mockData.push(user);
  }

  return mockData;
};

export const users: UserAccountTableType[] = generateMockUserData(100);
