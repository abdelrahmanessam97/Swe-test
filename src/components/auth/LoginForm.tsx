import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface LoginFormProps {
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
  loginText?: string;
  loginUrl?: string;
}

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = ({ heading, para, logo, buttonText, googleText, appleText, loginText, loginUrl }: LoginFormProps) => {
  const { isLoading, error, clearError, login } = useAuthStore();
  const navigate = useNavigate();
  const { lang } = useParams();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    const ok = await login({ email: data.email, password: data.password });
    if (ok) {
      navigate(`/${lang}/auth/verify`);
    }
  };

  return (
    <section className="z-20">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          <a href={logo.url}>
            <img src={logo.src} alt={logo.alt} title={logo.title} className="h-15 dark:invert" />
          </a>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col gap-y-4 rounded-md border px-10 py-16 shadow-md"
          >
            <div className="flex flex-col gap-2">
              {heading && <h1 className="text-left text-2xl text-[#3A3A3A] font-bold">{heading}</h1>}
              {para && <p className="text-sm text-[#7a7a7a]">{para}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-lg text-[#3A3A3A] font-[500]">Email</h4>
              <Input {...register("email")} type="email" placeholder="Enter your Email" className="!w-full !h-11 !text-sm !border !border-[#D9D9D9] !rounded-sm" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-md text-[#3A3A3A] font-[500]">Password</h4>
              <Input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="!w-full !h-11 !text-sm !border !border-[#D9D9D9] !rounded-sm px-3"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {"Logging in..."}
                </div>
              ) : (
                buttonText || "Login"
              )}
            </Button>

            <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{loginText}</p>
              <Link to={`${loginUrl}`} className="text-primary font-medium underline">
                Register
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
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
