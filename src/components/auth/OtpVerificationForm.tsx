import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";

interface OtpVerificationProps {
  heading?: string;
  para?: string;
  logo: {
    url?: string;
    src: string;
    alt: string;
    title?: string;
  };
  buttonText?: string;
  verificationText?: string;
  verificationUrl?: string;
  onVerify?: (code: string) => Promise<boolean>;
}

const otpSchema = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits");

const OtpVerificationForm = ({ heading, para, logo, buttonText, onVerify }: OtpVerificationProps) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    const validation = otpSchema.safeParse(otpValue);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }
    setError("");
    setLoading(true);
    setSuccess(false);

    if (onVerify) {
      try {
        const result = await onVerify(otpValue);
        if (result) {
          setSuccess(true);
          // Navigate to profile after a brief delay on success
          setTimeout(() => {
            navigate("/profile/personal-info");
          }, 1000);
        } else {
          setError("Invalid OTP. Please try again.");
        }
      } catch (err: unknown) {
        setError((err as Error).message || "OTP verification failed");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Verification not configured");
      setLoading(false);
    }
  };

  // const handleResend = () => {
  //   if (timer === 0) {
  //     setTimer(60); // restart countdown
  //   }
  // };

  return (
    <section className="z-20">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {logo?.src && (
            <a href={logo.url}>
              <img src={logo.src} alt={logo.alt} title={logo.title} className="h-15 dark:invert" />
            </a>
          )}
          <form onSubmit={handleSubmit} className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col gap-y-6 rounded-md border px-10 py-16 shadow-md">
            <div className="flex flex-col gap-2">
              {heading && <h1 className="text-left text-2xl text-[#3A3A3A] font-bold">{heading}</h1>}
              {para && <p className="text-sm text-[#7a7a7a]">{para}</p>}
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-8 h-8 text-center text-lg border border-gray-300 rounded focus:border-primary focus:outline-none"
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">OTP verified successfully</p>}

            {/* <Link to={`/auth/complete-profile`}> */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : buttonText}
            </Button>
            {/* </Link> */}

            {/* <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{verificationText}</p>
              <div className="text-primary font-medium ">
                {timer > 0 ? (
                  <span className="">Resend in 0:{timer.toString().padStart(2, "0")}</span>
                ) : (
                  <button type="button" onClick={handleResend} className="">
                    Resend Code
                  </button>
                )}
              </div>
            </div> */}
          </form>
        </div>
      </div>
    </section>
  );
};

export default OtpVerificationForm;

// {
//   "IsSetup": false,
//   "RequiresSetup": true,
//   "Message": "Two-factor authentication setup is required before login"
// }
