import { setPasswordAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const message = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="flex flex-col space-y-4 max-w-md w-full p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Set Your Password</h1>

        <div className="flex flex-col gap-1">
          <Label htmlFor="password">New Password</Label>
          <Input
            name="password"
            type="password"
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            required
          />
        </div>

        <SubmitButton formAction={setPasswordAction}>Set Password</SubmitButton>
        <FormMessage message={message} />
      </form>
    </div>
  );
}
