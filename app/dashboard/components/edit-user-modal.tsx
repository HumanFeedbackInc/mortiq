"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { UserAccountTableType } from "./ui/data";
import { UpdateExistingUserType } from "@/app/actions";
interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  user: UserAccountTableType;
  onSave: (updatedUser: UpdateExistingUserType) => void;
}

export default function EditUserModal({
  isOpen,
  onOpenChange,
  user,
  onSave,
}: EditUserModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get form data and create updated user object
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedUser = {
      ...user,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "ADMIN" | "BROKER" | "INVESTOR",
      phoneNumber: formData.get("phoneNumber") as string,
      userId: user.user_id,
      // Add other fields as needed
    };
    console.log("updatedUser from modal");
    console.log(updatedUser);

    onSave(updatedUser);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader>Edit User</ModalHeader>
            <ModalBody>
              <Input
                label="First Name"
                name="firstName"
                defaultValue={user?.first_name}
                variant="bordered"
              />
              <Input
                label="Last Name"
                name="lastName"
                defaultValue={user?.last_name}
                variant="bordered"
              />
              <Input
                label="Email"
                name="email"
                defaultValue={user?.email}
                variant="bordered"
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                defaultValue={user?.phone}
                variant="bordered"
              />
              <Select
                label="Role"
                name="role"
                // defaultValue={user?.role}
                variant="bordered"
              >
                <SelectItem key="ADMIN" value="ADMIN">
                  ADMIN
                </SelectItem>
                <SelectItem key="BROKER" value="BROKER">
                  BROKER
                </SelectItem>
                <SelectItem key="INVESTOR" value="INVESTOR">
                  INVESTOR
                </SelectItem>
              </Select>
              {/* Add other fields based on your user schema */}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
