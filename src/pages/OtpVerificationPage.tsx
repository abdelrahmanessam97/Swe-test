import { useAuthStore } from "@/stores/authStore";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import QRCodeSetup from "@/components/auth/QRCodeSetup";

const OtpVerification = () => {
  const { isTwoFactorSetup, qrSetupData, verifyLogin } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-white">
      {/* Left Background Image */}
      <img src="/metal-left.png" className="absolute left-0 bottom-0 sm:w-[275px] md:w-[420px] lg:w-[600px] max-w-full h-auto opacity-13 " alt="metal-left" />

      {/* Right Background Image */}
      <img src="/metal-right.png" className="absolute right-0 bottom-0 sm:w-[275px] md:w-[420px] lg:w-[600px] max-w-full h-auto opacity-13 " alt="metal-right" />

      {/* QR Setup + Form */}
      <div className="flex flex-col items-center gap-8">
        {isTwoFactorSetup ? (
          <OtpVerificationForm
            heading="OTP Verification"
            para="Enter the 6‑digit code from your authenticator app."
            logo={{ src: "/main_logo.gif", alt: "Logo" }}
            buttonText="Verify"
            verificationText="Didn't get a code?"
            onVerify={verifyLogin}
          />
        ) : qrSetupData ? (
          <QRCodeSetup
            Success={qrSetupData.Success}
            // SecretKey={qrSetupData.SecretKey}
            QrCodeBase64={qrSetupData.QrCodeBase64}
            // ManualKey={qrSetupData.ManualKey}
            Instructions={qrSetupData.Instructions}
            Message={qrSetupData.Message}
          />
        ) : null}
      </div>
    </div>
  );
};

export default OtpVerification;
