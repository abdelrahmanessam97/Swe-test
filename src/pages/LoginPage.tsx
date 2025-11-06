import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden bg-white main-p">
      {/* Left Background Image */}
      <img src="/metal-left.png" className="absolute left-0 bottom-0 sm:w-[275px] md:w-[420px] lg:w-[600px] max-w-full h-auto opacity-13 " alt="metal-left" />

      {/* Right Background Image */}
      <img src="/metal-right.png" className="absolute right-0 bottom-0 sm:w-[275px] md:w-[420px] lg:w-[600px] max-w-full h-auto opacity-13 " alt="metal-right" />

      {/* Form */}
      <LoginForm
        heading="Log in"
        para="Please enter your information correctly to access your account."
        logo={{
          alt: "logo",
          src: "/main_logo.gif",
          title: "elsewedy electronics",
        }}
        buttonText="Log in"
        googleText="Log in with Google"
        loginText="Don't have an account?"
        loginUrl="/auth/register"
      />
    </div>
  );
};

export default LoginPage;
