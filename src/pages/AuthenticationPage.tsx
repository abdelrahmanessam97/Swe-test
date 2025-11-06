import AuthenticationMainSec from "@/components/authentication/AuthenticationMainSec";
import AppDownload from "@/components/home/AppDownload";

const AuthenticationPage = () => {
  return (
    <main className="main-p !pb-0 ">
      <AuthenticationMainSec />
      <AppDownload firstImage="/auth1.png" secondImage="/auth2.png" thirdImage="/auth3.png" />
    </main>
  );
};

export default AuthenticationPage;
