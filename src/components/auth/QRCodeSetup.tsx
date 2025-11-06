import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import OtpVerificationDialog from "./OtpVerificationDialog";

type QrSetupProps = {
  Success: boolean;
  SecretKey?: string;
  QrCodeBase64: string;
  ManualKey?: string;
  Instructions: string;
  Message: string;
};

const QRCodeSetup = ({ Success, QrCodeBase64, Instructions, Message }: QrSetupProps) => {
  // const [copied, setCopied] = useState<"manual" | "secret" | null>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  const qrSrc = useMemo(() => (QrCodeBase64 ? `data:image/png;base64,${QrCodeBase64}` : ""), [QrCodeBase64]);
  const instructionLines = useMemo(() => (Instructions ? Instructions.split("\n").filter(Boolean) : []), [Instructions]);

  // const handleCopy = async (value: string, which: "manual" | "secret") => {
  //   try {
  //     await navigator.clipboard.writeText(value);
  //     setCopied(which);
  //     setTimeout(() => setCopied(null), 1500);
  //   } catch {
  //     setCopied(null);
  //   }
  // };

  return (
    <div className="relative z-20 w-full max-w-xl mx-auto">
      <div className="border rounded-md shadow-md bg-background border-muted p-6 md:p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Two‑Factor Authentication</h1>
          <p className="text-sm text-[#7a7a7a]">{Message}</p>
          {!Success && <p className="text-red-500 text-sm">Unable to initialize 2FA. Please try again.</p>}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 items-start">
          <div className="flex flex-col items-center gap-3">
            {qrSrc ? (
              <img src={qrSrc} alt="QR code for authenticator app" className="w-56 h-56 object-contain border rounded-md" />
            ) : (
              <div className="w-56 h-56 border rounded-md flex items-center justify-center text-sm text-muted-foreground">QR code unavailable</div>
            )}
            <p className="text-xs text-[#7a7a7a]">Scan this QR in Google Authenticator</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* <div>
              <label className="block text-xs text-[#7a7a7a] mb-1">Manual key</label>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-muted text-sm break-all select-all">{ManualKey}</code>
                <Button type="button" variant="secondary" onClick={() => handleCopy(ManualKey, "manual")}>
                  Copy
                </Button>
              </div>
              {copied === "manual" && <span className="text-green-600 text-xs ml-1">Copied</span>}
            </div>

            <div>
              <label className="block text-xs text-[#7a7a7a] mb-1">Secret key</label>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-muted text-sm break-all select-all">{}</code>
                <Button type="button" variant="secondary" onClick={() => handleCopy(SecretKey, "secret")}>
                  Copy
                </Button>
              </div>
              {copied === "secret" && <span className="text-green-600 text-xs ml-1">Copied</span>}
            </div> */}

            <div>
              <p className="text-sm font-medium mb-2">Instructions</p>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-[#3A3A3A]">
                {instructionLines.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full flex justify-center">
          <Button onClick={() => setShowOtpDialog(true)} className="w-full ">
            Verify Setup
          </Button>
        </div>
      </div>

      <OtpVerificationDialog open={showOtpDialog} onOpenChange={setShowOtpDialog} />
    </div>
  );
};

export default QRCodeSetup;
