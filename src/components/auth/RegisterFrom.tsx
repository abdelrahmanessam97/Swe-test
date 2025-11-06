import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Signup1Props {
  heading?: string;
  para?: string;
  logo: {
    url?: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  googleText?: string;
  appleText?: string;
  signupText?: string;
  signupUrl?: string;
}

const schema = z
  .object({
    fullName: z.string().min(1, "Full name is required").min(3, "Full name must be at least 3 characters").max(50, "Full name must be less than 50 characters"),
    username: z.string().min(1, "Username is required").min(2, "Username must be at least 2 characters").max(30, "Username must be less than 30 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z
      .string()
      .min(1, "Phone is required")
      .regex(/^\+\d{10,15}$/i, "Enter a valid phone number"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const RegisterFrom = ({ heading, para, logo, buttonText, googleText, appleText, signupText, signupUrl }: Signup1Props) => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const registerUser = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const [firstName, ...rest] = data.fullName.trim().split(/\s+/);
    const lastName = rest.join(" ");
    const normalizedPhone = data.phone.replace(/^\+/, "");

    const ok = await registerUser({
      model: {
        first_name: firstName || "",
        last_name: lastName || "",
        Username: data.username,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        phone_enabled: true,
        phone_required: true,
        phone: normalizedPhone,
      },
      form: {},
    });

    if (ok) {
      navigate(signupUrl || "/auth/login");
    }
  };

  return (
    <section className="z-20">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} title={logo.title} className="h-15 dark:invert" />
          </a>

          <form onSubmit={handleSubmit(onSubmit)} className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col gap-y-3 rounded-md border p-10 shadow-md">
            <div className="flex flex-col gap-2">
              {heading && <h1 className="text-left text-2xl text-[#3A3A3A] font-bold">{heading}</h1>}
              {para && <p className="text-sm text-[#7a7a7a]">{para}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-lg text-[#3A3A3A] font-[500]">Full Name</h4>
              <Input {...register("fullName")} type="text" placeholder="Full Name" className="!w-full !h-11 !text-sm !border !border-[#D9D9D9] !rounded-sm" />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-lg text-[#3A3A3A] font-[500]">Username</h4>
              <Input {...register("username")} type="text" placeholder="Username" className="!w-full !h-11 !text-sm !border !border-[#D9D9D9] !rounded-sm" />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-lg text-[#3A3A3A] font-[500]">Email</h4>
              <Input {...register("email")} type="email" placeholder="Email" className="!w-full !h-11 !text-sm !border !border-[#D9D9D9] !rounded-sm" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-lg text-[#3A3A3A] font-[500]">Phone Number</h4>
              <PhoneInput
                country="eg"
                enableSearch
                placeholder="Enter phone number"
                value={phone}
                onChange={(value) => {
                  const fullNumber = `+${value}`;
                  setPhone(fullNumber);
                  setValue("phone", fullNumber, {
                    shouldValidate: false,
                  });
                }}
                inputClass="!w-full !h-11 !text-sm !border !border-[#D9D9D9] !rounded-sm"
                buttonClass="!border !border-[#D9D9D9] !rounded-sm"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-lg text-[#3A3A3A] font-[500]">Password</h4>
              <Input {...register("password")} type="password" placeholder="password" className="!w-full !h-11 !text-sm !border !border-[#D9D9D9] !rounded-sm" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-lg text-[#3A3A3A] font-[500]">Confirm Password</h4>
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="confirm password"
                className="!w-full !h-11 !text-sm !border !border-[#D9D9D9] !rounded-sm"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : buttonText}
            </Button>

            <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{signupText}</p>
              <Link to={`${signupUrl}`} className="text-primary font-medium underline">
                Log in
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#7a7a7a]">
              <span className="flex-1 h-px bg-muted"></span>
              Or continue with
              <span className="flex-1 h-px bg-muted"></span>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <img src="/google.svg" alt="google" className="h-5 w-5 flex items-center justify-center" />
                {googleText || "Continue with Google"}
              </Button>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <img src="/apple.svg" alt="apple" className="h-5 w-5 mb-1 flex items-center justify-center" />
                {appleText || "Continue with Apple"}
              </Button>

              {/* <Link to={`/auth/login`} className=" text-center text-[16px] underline mt-6 font-[500] text-[#050522] ">
                Log in with password
              </Link> */}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterFrom;
