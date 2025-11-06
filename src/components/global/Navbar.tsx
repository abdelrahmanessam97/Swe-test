import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { getLanguageFromPath } from "@/utils/pathLanguage";
import { ChevronRight, Columns2, Search, ShoppingCart, Smartphone, User } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import SideNav from "./SideNav";

// const categories = [
//   {
//     id: 1,
//     name: "Electronics",
//     products: [
//       {
//         id: 101,
//         title: "Smartphone",
//         description: "Latest model smartphone",
//         href: "/products/101",
//       },
//       {
//         id: 102,
//         title: "Laptop",
//         description: "High performance laptop",
//         href: "/products/102",
//       },
//       {
//         id: 103,
//         title: "Laptop",
//         description: "High performance laptop",
//         href: "/products/102",
//       },
//       {
//         id: 104,
//         title: "Laptop",
//         description: "High performance laptop",
//         href: "/products/102",
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Appliances",
//     products: [
//       {
//         id: 201,
//         title: "Refrigerator",
//         description: "Energy efficient refrigerator",
//         href: "/products/201",
//       },
//       {
//         id: 202,
//         title: "Microwave Oven",
//         description: "Compact microwave oven",
//         href: "/products/202",
//       },
//       {
//         id: 203,
//         title: "Microwave Oven",
//         description: "Compact microwave oven",
//         href: "/products/202",
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Accessories",
//     products: [
//       {
//         id: 301,
//         title: "Headphones",
//         description: "Noise cancelling headphones",
//         href: "/products/301",
//       },
//       {
//         id: 302,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//       {
//         id: 304,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//       {
//         id: 305,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: "Accessories 2",
//     products: [
//       {
//         id: 301,
//         title: "Headphones",
//         description: "Noise cancelling headphones",
//         href: "/products/301",
//       },
//       {
//         id: 302,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//       {
//         id: 303,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//       {
//         id: 304,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//     ],
//   },
//   {
//     id: 5,
//     name: "Accessories 3",
//     products: [
//       {
//         id: 301,
//         title: "Headphones",
//         description: "Noise cancelling headphones",
//         href: "/products/301",
//       },
//       {
//         id: 302,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//       {
//         id: 303,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//       {
//         id: 304,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//       {
//         id: 305,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/302",
//       },
//     ],
//   },
// ];

export default function Navbar() {
  const location = useLocation();
  const currentLang = getLanguageFromPath() || "en";
  const isProfileActive = location.pathname.includes("/profile");
  const { cartItems, fetchCartItems } = useCartStore();
  const { isUserLoggedIn } = useAuthStore();

  // Helper function to build language-aware URLs
  const getLangUrl = (path: string) => {
    return `/${currentLang}${path}`;
  };

  // Helper function to check if a path is active (considering language prefix)
  const isPathActive = (path: string) => {
    const normalizedPath = location.pathname.replace(`/${currentLang}`, "") || "/";
    return normalizedPath === path || normalizedPath.startsWith(path + "/");
  };

  // Fetch cart items when component mounts
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Calculate total cart count (sum of all quantities)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <section className="pt-4 sticky top-0 z-50 bg-background">
      <div>
        <nav className="shadow-sm lg:shadow-none">
          <div className="container flex items-center justify-between gap-5 pb-1.5">
            <div className="flex items-center justify-center gap-3 ps-3">
              <SideNav />
              <Link to={getLangUrl("/")} onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 ">
                <img src="/main_logo.gif" className="max-h-20 max-w-20 lg:max-w-40 lg:max-h-40" alt="elsewedy electronics" />
                <span className="sr-only">elsewedy electronics</span>
              </Link>
            </div>

            <div className="hidden  lg:flex items-center flex-1 justify-center relative">
              <input
                type="text"
                placeholder="Search products, categories..."
                className="w-full ps-9 pe-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
                aria-label="Search"
              />
              <Search className="absolute start-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <div>
                {/* Wishlist */}
                {/* <Link to={getLangUrl("/saved-products")} onClick={() => window.scrollTo(0, 0)}>
                  <Button variant="ghost" size="icon" aria-label="Wishlist">
                    <Bookmark className={`w-6 h-6 ${isPathActive("/saved-products") ? "fill-current text-primary" : "text-foreground"}`} />
                  </Button>
                </Link> */}

                {/* Cart */}
                <Link to={getLangUrl("/cart")} onClick={() => window.scrollTo(0, 0)}>
                  <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
                    <ShoppingCart className={`w-6 h-6 ${isPathActive("/cart") ? "fill-current text-primary" : "text-foreground"}`} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <Link to={getLangUrl("/products/compare")} onClick={() => window.scrollTo(0, 0)}>
                  <Button variant="ghost" size="icon" aria-label="compare products" className="relative mx-2">
                    <Columns2 className={`w-6 h-6 ${isPathActive("/cart") ? "fill-current text-primary" : "text-foreground"}`} />
                    {/* {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {cartCount}
                      </span>
                    )} */}
                  </Button>
                </Link>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Profile">
                      <User className={`w-6 h-6 ${isProfileActive ? "fill-current text-primary" : "text-foreground"}`} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="mt-2">
                    {!isUserLoggedIn ? (
                      <Link to={getLangUrl("/auth/login")} onClick={() => window.scrollTo(0, 0)}>
                        <DropdownMenuItem className="cursor-pointer transition-colors duration-300 focus:shadow-none hover:text-primary hover:bg-white">
                          Login
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </DropdownMenuItem>
                      </Link>
                    ) : (
                      <>
                        {/* Profile */}
                        <Link to={getLangUrl("/profile/personal-info")} onClick={() => window.scrollTo(0, 0)}>
                          <DropdownMenuItem
                            className={`cursor-pointer transition-colors duration-300 focus:shadow-none ${
                              isPathActive("/profile/personal-info") ? "text-primary bg-white font-medium" : "hover:text-primary hover:bg-white"
                            }`}
                          >
                            Profile
                            <ChevronRight className={`w-4 h-4 ml-auto ${isPathActive("/profile/personal-info") ? "text-primary" : ""}`} />
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />

                        {/* Orders */}
                        <Link to={getLangUrl("/profile/order-history")} onClick={() => window.scrollTo(0, 0)}>
                          <DropdownMenuItem
                            className={`cursor-pointer transition-colors duration-300 ${
                              isPathActive("/profile/order-history") ? "text-primary bg-white font-medium" : "hover:text-primary hover:bg-white"
                            }`}
                          >
                            My Orders
                            <ChevronRight className={`w-4 h-4 ml-auto ${isPathActive("/profile/order-history") ? "text-primary" : ""}`} />
                          </DropdownMenuItem>
                        </Link>
                        {/* <DropdownMenuSeparator /> */}

                        {/* Notification */}
                        {/* <DropdownMenuItem asChild>
                          <NotificationsSheet />
                        </DropdownMenuItem> */}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Language Switcher */}
                {/* <LangSwitcher /> */}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex w-full py-3 bg-[#F8F8F8] justify-center items-center mt-1 border-none shadow-sm ">
            <NavigationMenu className="">
              <NavigationMenuList className="space-x-5">
                <NavigationMenuItem>
                  <Link to={getLangUrl("/")} onClick={() => window.scrollTo(0, 0)} className={isPathActive("/") ? "text-primary font-semibold" : ""}>
                    Home
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:no-underline hover:bg-transparent ">
                    <Link to={getLangUrl("/products")} onClick={() => window.scrollTo(0, 0)} className={isPathActive("/products") ? "text-primary font-semibold" : ""}>
                      Products
                    </Link>
                  </NavigationMenuTrigger>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to={getLangUrl("/support")} onClick={() => window.scrollTo(0, 0)} className={isPathActive("/support") ? "text-primary font-semibold" : ""}>
                    Support
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to={getLangUrl("/about_hub")}
                    onClick={() => window.scrollTo(0, 0)}
                    className={`flex items-center ${isPathActive("/about_hub") ? "text-primary font-semibold" : ""}`}
                  >
                    <Smartphone className="w-5 h-5 " />
                    About Hub
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
      </div>
    </section>
  );
}
