const authEndpoints = {
  register: "/api-frontend/Customer/Register",
  login: "/api-frontend/Authenticate/GetToken",
  logout: "/api-frontend/Customer/Logout",
  factorStatus: "/api-frontend/TwoFactor/Status",
  factorSetup: "/api-frontend/TwoFactor/Setup",
  verifySetup: "/api-frontend/TwoFactor/VerifySetup",
  verifyLogin: "/api-frontend/TwoFactor/VerifyLogin",
};

export default authEndpoints;
