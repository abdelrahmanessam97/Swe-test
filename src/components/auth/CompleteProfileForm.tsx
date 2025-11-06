import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

interface CompleteProfileProps {
  heading?: string;
  para?: string;
  logo: {
    url?: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
}

// Zod schema for validation
const schema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const CompleteProfileForm = ({ heading, para, logo, buttonText }: CompleteProfileProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = () => {
    // TODO: Implement form submission logic
  };

  return (
    <section className="z-20">
      <div className="flex  items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start ">
          {/* Logo */}
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} title={logo.title} className="h-15 dark:invert" />
          </a>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col gap-y-4 rounded-md border px-10 py-16 shadow-md"
          >
            {/* Heading */}
            <div className="flex flex-col gap-2">
              {heading && <h1 className="text-left text-2xl text-[#3A3A3A] font-bold">{heading}</h1>}
              {para && <p className="text-sm text-[#7a7a7a]">{para}</p>}
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <h4 className="text-md text-[#3A3A3A] font-[500]">Full Name</h4>
              <input type="text" placeholder="name ex: John Doe" {...register("fullName")} className="w-full h-11 text-sm border border-[#D9D9D9] rounded-sm px-3" />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <h4 className="text-md text-[#3A3A3A] font-[500]">Email</h4>
              <input type="email" placeholder="email@example.com" {...register("email")} className="w-full h-11 text-sm border border-[#D9D9D9] rounded-sm px-3" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <h4 className="text-md text-[#3A3A3A] font-[500]">Email</h4>
              <input type="password" placeholder="000000" {...register("email")} className="w-full h-11 text-sm border border-[#D9D9D9] rounded-sm px-3" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <h4 className="text-md text-[#3A3A3A] font-[500]">Email</h4>
              <input type="password" placeholder="000000" {...register("email")} className="w-full h-11 text-sm border border-[#D9D9D9] rounded-sm px-3" />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CompleteProfileForm;
