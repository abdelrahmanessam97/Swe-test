import MainSection from "@/components/products/MainSection";
import { useAuthStore } from "@/stores/authStore";
import { History, LayoutDashboard, LogOut, MapPinned } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const tabItems = [
  {
    path: "personal-info",
    label: "Personal Info",
    icon: <LayoutDashboard />,
  },
  {
    path: "order-history",
    label: "Order History",
    icon: <History />,
  },
  {
    path: "my-address",
    label: "My Address",
    icon: <MapPinned />,
  },
];

const ProfileLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main>
      <MainSection
        title="Profile"
        para="Manage your account with ease. View your details, track orders, and keep your preferences up to date."
        imgUrl="/profile-page.jpg"
      />

      <div className="mt-24 mb-16 grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className=" h-[300px] col-span-1 px-6 lg:px-3 ms-0  lg:ms-13 border-r border-[#E6E6E6]">
          <div className="flex flex-col w-full h-full space-y-2 items-start">
            {tabItems.map((tab, indx) => (
              <NavLink
                to={tab.path}
                key={indx}
                className={({ isActive }) =>
                  `w-full py-3 flex items-center gap-3 font-medium !rounded-none transition-all
              ${isActive ? "border-l-4 border-l-primary text-[#1A1A1A] font-bold bg-[#F2F2F2]" : "text-[#666666]"}`
                }
              >
                <span className="ms-2">{tab.icon}</span>
                <span>{tab.label}</span>
              </NavLink>
            ))}
            <button onClick={handleLogout} className="w-full py-3 flex items-center gap-3 text-[#666666] font-medium !rounded-none transition-all">
              <span className="ms-2">
                <LogOut />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="w-full col-span-1 lg:col-span-3 mx-auto py-2 px-4 rounded-none">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default ProfileLayout;
