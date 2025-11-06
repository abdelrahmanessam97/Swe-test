import CompleteProfileForm from "@/components/auth/CompleteProfileForm";

const CompleteProfile = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-white">
      {/* Left Background Image */}
      <img src="/metal-left.png" className="absolute left-0 bottom-0 sm:w-[275px] md:w-[420px] lg:w-[600px] max-w-full h-auto opacity-13 " alt="metal-left" />

      {/* Right Background Image */}
      <img src="/metal-right.png" className="absolute right-0 bottom-0 sm:w-[275px] md:w-[420px] lg:w-[600px] max-w-full h-auto opacity-13 " alt="metal-right" />

      {/* Form */}
      <CompleteProfileForm
        heading="Complete Profile"
        logo={{
          alt: "logo",
          src: "/elswedy.png",
          title: "elsewedy electronics",
        }}
        buttonText="Register"
      />
    </div>
  );
};

export default CompleteProfile;
