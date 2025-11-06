import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { useAuthStore } from "@/stores/authStore";

interface OtpVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heading?: string;
  description?: string;
  buttonText?: string;
  verificationText?: string;
}

const otpSchema = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits");

const OtpVerificationDialog = ({
  open,
  onOpenChange,
  heading = "OTP Verification",
  description = "Enter the 6‑digit code from your authenticator app.",
  buttonText = "Verify",
}: OtpVerificationDialogProps) => {
  const { verifySetup } = useAuthStore();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setOtp(Array(6).fill(""));
      setError("");
      setSuccess(false);
      setTimer(60);
      // Focus first input when dialog opens
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    }
  }, [open]);

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

    try {
      const result = await verifySetup(otpValue);
      if (result) {
        setSuccess(true);
        // Navigate to profile after a brief delay on success
        setTimeout(() => {
          navigate("/profile/personal-info");
          onOpenChange(false);
        }, 1000);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  //   const handleResend = () => {
  //     if (timer === 0) {
  //       setTimer(60); // restart countdown
  //     }
  //   };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : buttonText}
          </Button>

          {/* <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{verificationText}</p>
            <div className="text-primary font-medium">
              {timer > 0 ? (
                <span>Resend in 0:{timer.toString().padStart(2, "0")}</span>
              ) : (
                <button type="button" onClick={handleResend} className="hover:underline">
                  Resend Code
                </button>
              )}
            </div>
          </div> */}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationDialog;
