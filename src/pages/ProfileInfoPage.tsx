import { useProfileStore } from "@/stores/profileStore";
import { Edit, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type ProfileInfoPayload = {
  fullName?: string;
  name?: string;
  FullName?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  Phone?: string | null;
  phone_number?: string | null;
  email?: string | null;
  Email?: string | null;
  username?: string | null;
} | null;

const ProfileInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { info, isLoading, error, fetchInfo, updateInfo } = useProfileStore();

  // Normalize incoming info shape to common fields
  const normalized = useMemo(() => {
    const data = (info as ProfileInfoPayload) || {};
    const firstName = (data.first_name ?? "").toString().trim();
    const lastName = (data.last_name ?? "").toString().trim();
    const combined = `${firstName} ${lastName}`.trim();
    const fullName = combined || data.fullName || data.name || (data.FullName as string) || "";

    const phoneRaw = data.phone ?? data.Phone ?? data.phone_number ?? "";
    const phone = (phoneRaw ?? "").toString();

    const emailRaw = data.email ?? data.Email ?? data.username ?? "";
    const email = (emailRaw ?? "").toString();

    return { fullName, phone, email };
  }, [info]);

  const schema = z.object({
    fullName: z.string().trim().min(2, { message: "Full name must be at least 2 characters" }).max(100, { message: "Full name is too long" }),
    phone: z.string().trim().min(7, { message: "Phone number is too short" }).max(20, { message: "Phone number is too long" }),
    email: z.string().trim().email({ message: "Invalid email address" }).max(100, { message: "Email is too long" }),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reset({
      fullName: normalized.fullName,
      phone: normalized.phone,
      email: normalized.email,
    });
  }, [normalized.fullName, normalized.phone, normalized.email, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const nameParts = values.fullName.trim().split(" ");
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ") || "";

      await updateInfo({
        email: values.email,
        first_name,
        last_name,
        phone: values.phone,
      });
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the store
      console.error("Failed to update profile:", error);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      void handleSubmit(onSubmit)();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[#3D3D3D] text-2xl font-bold mb-4">My Personal Info</h3>
            {isEditing ? (
              <Save size={20} className="text-primary cursor-pointer" onClick={toggleEdit} />
            ) : (
              <Edit size={20} className="text-primary cursor-pointer" onClick={toggleEdit} />
            )}
          </div>
          <div className="w-full px-4 text-[#3A3A3A] space-y-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gid-cols-1 md:grid-cols-2 items-center gap-3">
                <div className="w-full">
                  <Label htmlFor="full-name" className="mb-2 font-[400]">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="full-name"
                    disabled={!isEditing || isLoading || isSubmitting}
                    placeholder="name example"
                    {...register("fullName")}
                    className="h-12 rounded-sm border-0 bg-[#f9f9f9] focus:!outline-none focus:!ring-0 focus:!border-0 focus:!shadow-none"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div className="w-full">
                  <Label htmlFor="phone-number" className="mb-2 font-[400]">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    id="phone-number"
                    disabled={!isEditing || isLoading || isSubmitting}
                    placeholder="(+20) 0000000000"
                    {...register("phone")}
                    className="h-12 rounded-sm border-0 bg-[#f9f9f9] focus:!outline-none focus:!ring-0 focus:!border-0 focus:!shadow-none"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="w-full">
                <Label htmlFor="email-address" className="mb-2 font-[400]">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email-address"
                  disabled={!isEditing || isLoading || isSubmitting}
                  placeholder="email@example.com"
                  {...register("email")}
                  className="h-12 rounded-sm border-0 bg-[#f9f9f9] focus:!outline-none focus:!ring-0 focus:!border-0 focus:!shadow-none"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              {/* Hidden submit so Enter works; Save icon triggers submit via toggleEdit */}
              <button type="submit" className="hidden" aria-hidden="true" />
            </form>
          </div>
        </>
      )}
    </section>
  );
};

export default ProfileInfoPage;
