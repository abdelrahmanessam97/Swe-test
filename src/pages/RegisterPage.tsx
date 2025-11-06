import RegisterFrom from "@/components/auth/RegisterFrom";

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-white main-p">
      {/* Left Background Image */}
      <img src="/metal-left.png" className="absolute left-0 bottom-0 sm:w-[275px] md:w-[420px] lg:w-[600px] max-w-full h-auto opacity-13" alt="metal-left" />

      {/* Right Background Image */}
      <img src="/metal-right.png" className="absolute right-0 bottom-0 sm:w-[275px] md:w-[420px] lg:w-[600px] max-w-full h-auto opacity-13" alt="metal-right" />

      {/* Form */}
      <RegisterFrom
        heading="Create Account"
        para="By signing up, you agree to the Terms & Conditions and Privacy Policy."
        logo={{
          alt: "logo",
          src: "/main_logo.gif",
          title: "elsewedy electronics",
        }}
        buttonText="Continue"
        googleText="continue with Google"
        appleText="continue with Google"
        signupText="Already have an account?"
        signupUrl="/auth/login"
      />
    </div>
  );
};

export default RegisterPage;
