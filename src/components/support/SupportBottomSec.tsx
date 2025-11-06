import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSupportStore } from "@/stores/supportStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^\+\d{8,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type FormData = z.infer<typeof schema>;

const SupportBottomSec = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  const { sendEnquiry, isLoading, error, success, reset: resetStore } = useSupportStore();

  const onSubmit = async (data: FormData) => {
    await sendEnquiry({
      full_name: data.name,
      phone_number: data.phone,
      email: data.email,
      enquiry: data.message,
    });
    if (success) {
      reset();
      resetStore();
      setPhone("");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full transition-all duration-700 ease-out
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className=" flex items-center justify-center mx-auto md:ms-auto">
        <img src="/support.jpg" alt="Support illustration" width={560} height={560} className="rounded-lg object-cover" />
      </div>

      <div className="w-full px-4 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} placeholder="Enter Your Name" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <PhoneInput
                    country="eg"
                    enableSearch
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(value) => {
                      const fullNumber = `+${value}`;
                      setPhone(fullNumber);
                      setValue("phone", fullNumber, { shouldValidate: true });
                    }}
                    inputClass="!w-full !h-11 !text-sm !border !border-input !rounded-md"
                    buttonClass="!border !border-input !rounded-l-md"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="example@youremail.com" {...register("email")} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here..." {...register("message")} />
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardHeader>

            <CardContent />

            <CardFooter>
              <Button type="submit" className="bg-primary w-fit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send message →"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default SupportBottomSec;
