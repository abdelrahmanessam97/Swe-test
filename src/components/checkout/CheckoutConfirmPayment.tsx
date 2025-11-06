import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

const otpSchema = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits");

type Props = {
  confirmPayment: boolean;
  setConfirmPayment: React.Dispatch<React.SetStateAction<boolean>>;
  handleOrderPlace: () => void;
};

const CheckoutConfirmPayment = ({ confirmPayment, setConfirmPayment, handleOrderPlace }: Props) => {
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

  const verifyOtp = async (otpCode: string) => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: otpCode }),
    });
    if (!res.ok) throw new Error("Invalid OTP");
    return res.json();
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
      await verifyOtp(otpValue);
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60); // restart countdown
    }
  };

  return (
    <Dialog open={confirmPayment} onOpenChange={setConfirmPayment}>
      <DialogContent
        aria-describedby={undefined}
        className="w-full sm:max-w-[600px] transition-all duration-300
                   data-[state=open]:animate-in 
                   data-[state=open]:slide-in-from-top-10 
                   data-[state=open]:fade-in-0
                   data-[state=closed]:animate-out 
                   data-[state=closed]:fade-out-0"
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="">
          <div className="flex flex-col gap-2">
            <h1 className="text-left text-2xl text-[#3A3A3A] font-bold">OTP Verification</h1>
            <p className="text-sm text-[#7a7a7a]">Please enter the OTP sent to your device correctly to proceed.</p>
          </div>

          <div className="flex justify-center gap-2 my-4">
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
                className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:border-primary focus:outline-none"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">OTP verified successfully</p>}

          <Button type="submit" className="w-full my-3" disabled={loading} onClick={handleOrderPlace}>
            {loading ? "Verifying..." : "Verify"}
          </Button>

          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>Don't receive a code?</p>
            <div className="text-primary font-medium">
              {timer > 0 ? (
                <span>Resend in 0:{timer.toString().padStart(2, "0")}</span>
              ) : (
                <button type="button" onClick={handleResend}>
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPayment;
