"use client";

import * as React from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Spacer,
} from "@heroui/react";
import { cn } from "@heroui/react";
import { type InferSelectModel } from "drizzle-orm";
import { account, pendingUser, roles, userRoles } from "@/drizzle/schema";
import { users } from "@/drizzle/schema";
import { Icon } from "@iconify/react";
import { DashboardUserData } from "../page";
import {
  createOrUpdatePendingUser,
  UpdateUser,
  uploadFileToPrivateBucket,
  uploadFileToPublicBucket,
} from "@/app/actions";
import { FileUpload } from "@/app/profile/components/privateFileUpload";
// Define types from schema
type Account = InferSelectModel<typeof account>;
type PendingUser = InferSelectModel<typeof pendingUser>;
type Role = InferSelectModel<typeof roles>;
type UserRole = InferSelectModel<typeof userRoles>;
type User = InferSelectModel<typeof users>;

export interface UserData extends Account {
  role: string | null;
  email: string;
  phoneNumber: string | null;
  secureFileBucketPath: string | null;
  imageBucketPath: string | null;
}
export interface PendingUserData extends PendingUser {
  role: string | null;
  email: string;
  phoneNumber: string | null;
  secureFileBucketPath: string | null;
  imageBucketPath: string | null;
}

interface AccountSettingCardProps {
  className?: string;
  dashboardUserData: DashboardUserData;
}

const timeZoneOptions = [
  {
    label: "Coordinated Universal Time (UTC-3)",
    value: "utc-3",
    description: "Coordinated Universal Time (UTC-3)",
  },
  {
    label: "Coordinated Universal Time (UTC-4)",
    value: "utc-4",
    description: "Coordinated Universal Time (UTC-4)",
  },
  {
    label: "Coordinated Universal Time (UTC-5)",
    value: "utc-5",
    description: "Coordinated Universal Time (UTC-5)",
  },
];

const roleOptions = [
  { label: "Broker", value: "BROKER" },
  { label: "Investor", value: "INVESTOR" },
];

// Update validation function
const validatePhoneNumber = (phone: string) => {
  // Allow formats: (416)-839-1386 or +1 (416)-839-1386
  const phoneRegex = /^\+?\d{0,2}\s*\(\d{3}\)-\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

// Add a format helper function
const formatPhoneNumber = (value: string) => {
  // Keep the + if it exists at the start
  const hasPlus = value.startsWith("+");
  // Remove all non-numeric characters
  let numbers = value.replace(/[^\d]/g, "");

  // Early return for empty or very short inputs
  if (numbers.length === 0) return hasPlus ? "+" : "";

  let formatted = hasPlus ? "+" : "";

  // Handle country code (only if it starts with +)
  if (hasPlus && numbers.length >= 1) {
    formatted += numbers.slice(0, 1);
    if (numbers.length > 1) {
      formatted += " ";
    }
    numbers = numbers.slice(1);
  }

  // Format the rest of the number
  if (numbers.length > 0) {
    formatted += "(";
    formatted += numbers.slice(0, 3);
  }

  if (numbers.length > 3) {
    formatted += ")-";
    formatted += numbers.slice(3, 6);
  }

  if (numbers.length > 6) {
    formatted += "-";
    formatted += numbers.slice(6, 10);
  }

  return formatted;
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const AccountSetting = React.forwardRef<
  HTMLDivElement,
  AccountSettingCardProps
>(({ className, dashboardUserData, ...props }, ref) => {
  // Form state
  const [formData, setFormData] = React.useState({
    firstName:
      dashboardUserData.userData?.firstName ||
      dashboardUserData.pendingUserData?.firstName ||
      "",
    middleName:
      dashboardUserData.userData?.middleName ||
      dashboardUserData.pendingUserData?.middleName ||
      "",
    lastName:
      dashboardUserData.userData?.lastName ||
      dashboardUserData.pendingUserData?.lastName ||
      "",
    profilePicture:
      dashboardUserData.userData?.profilePicture ||
      dashboardUserData.pendingUserData?.profilePicture ||
      "",
    timezone: "utc-3",
    role:
      dashboardUserData.userData?.role ||
      dashboardUserData.pendingUserData?.role ||
      "user",
    phoneNumber:
      dashboardUserData.userData?.phone ||
      dashboardUserData.pendingUserData?.phoneNumber
        ? formatPhoneNumber(
            dashboardUserData.userData?.phone ||
              dashboardUserData.pendingUserData?.phoneNumber ||
              ""
          )
        : "",
  });

  // File handling state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>(
    formData.profilePicture
  );

  // Add state for secure files
  const [secureFiles, setSecureFiles] = React.useState<File[]>([]);

  // Add validation state
  const [errors, setErrors] = React.useState({
    phoneNumber: "",
    email: "",
  });

  // Check if user has an existing role
  const hasExistingRole = Boolean(
    dashboardUserData.userData?.role || dashboardUserData.pendingUserData?.role
  );

  // Update handleInputChange for better input handling
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber" || name === "phone") {
      const formattedValue = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      // Only validate if we have a complete phone number
      if (value.length >= 10) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: validatePhoneNumber(formattedValue)
            ? ""
            : "Please enter a valid phone number (e.g., (416)-839-1386 or +1 (416)-839-1386)",
        }));
      } else {
        // Clear error while typing
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke the previous blob URL if it exists
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  // Clean up not needed anymore since we're using DataURLs instead of Blob URLs
  React.useEffect(() => {
    if (
      dashboardUserData.userData?.profilePicture ||
      dashboardUserData.pendingUserData?.profilePicture
    ) {
      setPreviewUrl(
        dashboardUserData.userData?.profilePicture ||
          dashboardUserData.pendingUserData?.profilePicture ||
          ""
      );
    }
  }, [dashboardUserData]);

  // Add effect to log state changes
  React.useEffect(() => {
    if (previewUrl) {
      console.log("Preview URL updated:", previewUrl);
    }
  }, [previewUrl]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    const phoneError = validatePhoneNumber(formData.phoneNumber)
      ? ""
      : "Please enter a valid phone number";

    // Validate email (using the email from dashboardUserData since it's read-only)
    const email =
      dashboardUserData.userData?.email ||
      dashboardUserData.pendingUserData?.email ||
      dashboardUserData.user.data.user?.email ||
      "";
    const emailError = validateEmail(email) ? "" : "Please enter a valid email";

    setErrors({
      phoneNumber: phoneError,
      email: emailError,
    });

    if (phoneError || emailError) {
      return; // Don't submit if there are validation errors
    }

    try {
      // Create form data for submission
      const submitData: PendingUserData = {
        userId:
          dashboardUserData.userData?.userId ||
          dashboardUserData.pendingUserData?.userId ||
          dashboardUserData.user.data.user?.id ||
          "",
        // role:
        //   dashboardUserData.userData?.role ||
        //   dashboardUserData.pendingUserData?.role ||
        //   null,
        email:
          dashboardUserData.userData?.email ||
          dashboardUserData.pendingUserData?.email ||
          "",
        secureFileBucketPath:
          dashboardUserData.userData?.secureFileBucketPath ||
          dashboardUserData.pendingUserData?.secureFileBucketPath ||
          "",
        imageBucketPath:
          dashboardUserData.userData?.imageBucketPath ||
          dashboardUserData.pendingUserData?.imageBucketPath ||
          "",
        pendingUserId: dashboardUserData.pendingUserData?.pendingUserId || "",
        roleId: dashboardUserData.pendingUserData?.roleId || "",
        createdAt: dashboardUserData.pendingUserData?.createdAt || "",
        // Spread formData last to ensure it takes precedence
        ...formData,
      };

      if (selectedFile) {
        const userId =
          dashboardUserData.userData?.userId ||
          dashboardUserData.pendingUserData?.userId ||
          dashboardUserData.user.data.user?.id ||
          "";
        //TODO: This retains old profile picture if it exists. change this
        const result = await uploadFileToPublicBucket(
          selectedFile,
          "userPublicImages",
          `users/${userId}/images`
        );
        console.log("result", result);
        if (result.success) {
          const url = result.data?.url;
          if (url) {
            submitData.profilePicture = url;
          } else {
            console.error(result.error);
          }
        } else {
          console.error(result.error);
        }
      }

      // Handle secure file upload if files exist
      if (secureFiles.length > 0) {
        const promises = [];
        for (const file of secureFiles) {
          const userId =
            dashboardUserData.userData?.userId ||
            dashboardUserData.pendingUserData?.userId ||
            dashboardUserData.user.data.user?.id ||
            "";
          promises.push(
            uploadFileToPrivateBucket(
              file,
              "secureFiles",
              `users/${userId}/private`
            )
          );
        }
        const results = await Promise.all(promises);
        for (const result of results) {
          if (result && result.success) {
            console.log(result);
          }
        }
      }

      let result;
      if (dashboardUserData.userData) {
        result = await UpdateUser(submitData);
      } else {
        result = await createOrUpdatePendingUser(submitData);
      }

      if (result.success) {
        console.log(result.data);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div ref={ref} className={cn("p-2", className)} {...props}>
        <div>
          <p className="text-base font-medium text-default-700">Profile</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            This displays your public profile on the site.
          </p>
          <Card className="mt-4 bg-default-100" shadow="none">
            <CardBody>
              <div className="flex items-center gap-4">
                <Badge
                  showOutline
                  classNames={{
                    badge: "w-5 h-5",
                  }}
                  content={
                    <label
                      className="cursor-pointer flex items-center justify-center w-full h-full"
                      htmlFor="profile-picture-upload"
                    >
                      <Icon
                        className="h-[9px] w-[9px] text-default-500"
                        icon="solar:pen-linear"
                      />
                      <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  }
                  placement="bottom-right"
                  shape="circle"
                >
                  <Avatar
                    className="h-16 w-16"
                    src={previewUrl}
                    fallback={
                      <Icon
                        className="h-8 w-8 text-default-500"
                        icon="solar:user-circle-linear"
                      />
                    }
                    showFallback={!previewUrl}
                  />
                </Badge>
                <div>
                  <p className="text-sm font-medium text-default-600">
                    {dashboardUserData.userData?.firstName ||
                      dashboardUserData.pendingUserData?.firstName}{" "}
                    {dashboardUserData.userData?.lastName ||
                      dashboardUserData.pendingUserData?.lastName}
                  </p>
                  <p className="text-xs text-default-400">
                    {dashboardUserData.userData?.role ||
                      dashboardUserData.pendingUserData?.role}
                  </p>
                  <p className="mt-1 text-xs text-default-400">
                    {dashboardUserData.userData?.email ||
                      dashboardUserData.pendingUserData?.email ||
                      dashboardUserData.user.data.user?.email}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <Spacer y={4} />
        {/* Full name */}
        <div>
          <p className="text-base font-medium text-default-700">Full name</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Please enter your full name.
          </p>
          <div className="flex gap-2 mt-2">
            <Input
              name="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              startContent={
                <Icon icon="solar:user-linear" className="text-default-400" />
              }
            />
            <Input
              name="middleName"
              type="text"
              placeholder="Middle name (optional)"
              value={formData.middleName}
              onChange={handleInputChange}
              startContent={
                <Icon icon="solar:user-linear" className="text-default-400" />
              }
            />
            <Input
              name="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              startContent={
                <Icon icon="solar:user-linear" className="text-default-400" />
              }
            />
          </div>
        </div>
        <Spacer y={2} />
        {/* Phone Number and Role - Side by side */}
        <div className="flex gap-4">
          {/* Phone Number */}
          <div className="flex-1">
            <p className="text-base font-medium text-default-700">
              Phone Number
            </p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Enter your contact phone number.
            </p>
            <Input
              name="phoneNumber"
              type="tel"
              className="mt-2"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              startContent={
                <Icon icon="solar:phone-linear" className="text-default-400" />
              }
              errorMessage={errors.phoneNumber}
              isInvalid={!!errors.phoneNumber}
            />
          </div>
          {/* Role */}
          <div className="flex-1">
            <p className="text-base font-medium text-default-700">Role</p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Select user role.
            </p>
            {hasExistingRole ? (
              <Input
                isReadOnly
                className="mt-2"
                value={formData.role}
                startContent={
                  <Icon
                    icon="solar:user-id-linear"
                    className="text-default-400"
                  />
                }
              />
            ) : (
              <Select
                name="role"
                className="mt-2"
                value={formData.role || ""}
                onChange={handleInputChange}
                startContent={
                  <Icon
                    icon="solar:user-id-linear"
                    className="text-default-400"
                  />
                }
              >
                {roleOptions.map((roleOption) => (
                  <SelectItem key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>
        </div>
        <Spacer y={2} />
        {/* Profile Picture */}
        <div>
          <p className="text-base font-medium text-default-700">
            Profile Picture
          </p>
          <p className="mt-1 text-sm font-normal text-default-400">
            URL of your profile picture.
          </p>
          <Input
            name="profilePicture"
            type="text"
            className="mt-2"
            placeholder="Profile picture URL"
            value={formData.profilePicture}
            onChange={handleInputChange}
            startContent={
              <Icon icon="solar:link-linear" className="text-default-400" />
            }
          />
        </div>
        <Spacer y={2} />
        {/* Timezone */}
        <section>
          <div>
            <p className="text-base font-medium text-default-700">Timezone</p>
            <p className="mt-1 text-sm font-normal text-default-400">
              Set your current timezone.
            </p>
          </div>
          <Select
            name="timezone"
            className="mt-2"
            value={formData.timezone}
            onChange={handleInputChange}
            startContent={
              <Icon
                icon="solar:clock-circle-linear"
                className="text-default-400"
              />
            }
          >
            {timeZoneOptions.map((timeZoneOption) => (
              <SelectItem
                key={timeZoneOption.value}
                value={timeZoneOption.value}
              >
                {timeZoneOption.label}
              </SelectItem>
            ))}
          </Select>
        </section>
        <Spacer y={2} />
        {/* Secure File Upload */}
        <div>
          <p className="text-base font-medium text-default-700">
            Secure Documents
          </p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Upload your secure documents here. These will be stored in a private
            bucket.
          </p>
          <div className="mt-2">
            <FileUpload
              id="secure-docs"
              label="Upload Secure Documents"
              files={secureFiles}
              setFiles={setSecureFiles}
              onChange={(files) => console.log("Files changed:", files)}
            />
          </div>
        </div>
        <Spacer y={2} />
        <button
          type="submit"
          className="mt-4 bg-default-foreground text-background px-4 py-2 rounded-md text-sm"
        >
          Update Account
        </button>
      </div>
    </form>
  );
});

AccountSetting.displayName = "AccountSetting";

export default AccountSetting;
