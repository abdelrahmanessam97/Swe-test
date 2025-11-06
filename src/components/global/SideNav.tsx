import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, Search } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";

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
//         href: "/products/103",
//       },
//       {
//         id: 104,
//         title: "Laptop",
//         description: "High performance laptop",
//         href: "/products/104",
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
//         href: "/products/203",
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
//         href: "/products/303",
//       },
//       {
//         id: 305,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/304",
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
//         href: "/products/303",
//       },
//       {
//         id: 304,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/304",
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
//         href: "/products/303",
//       },
//       {
//         id: 304,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/304",
//       },
//       {
//         id: 305,
//         title: "Smart Watch",
//         description: "Fitness tracking smart watch",
//         href: "/products/305",
//       },
//     ],
//   },
// ];

export default function SideNav() {
  const [search, setSearch] = useState("");
  return (
    <Sheet>
      {/* Trigger for Sidebar */}
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="outline" size="icon" className="!outline-none border-0 mb-2">
          <MenuIcon className="size-6 " />
        </Button>
      </SheetTrigger>

      {/* Sidebar Content */}
      <SheetContent side="left" className="max-h-screen overflow-auto w-72 p-0 lg:hidden">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>
            <Link to="/" className="flex items-center gap-2">
              <img src="/main_logo.gif" className="max-h-12" alt="elsewedy electronics" />
              <span className="sr-only">elsewedy electronics</span>
            </Link>
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>

        {/* Navigation */}
        <div className="flex flex-col p-4 gap-6">
          {/* Main Links */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ps-9 pe-4 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              placeholder="Search Products..."
            />
            <Search className="absolute w-4 h-4 start-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <nav className="flex flex-col gap-3 text-base font-medium">
            <NavLink to="/" onClick={() => window.scrollTo(0, 0)} className={({ isActive }) => (isActive ? "text-primary font-semibold" : "")}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={() => window.scrollTo(0, 0)} className={({ isActive }) => (isActive ? "text-primary font-semibold" : "")}>
              Products
            </NavLink>
            <NavLink to="/support" onClick={() => window.scrollTo(0, 0)} className={({ isActive }) => (isActive ? "text-primary font-semibold" : "")}>
              Support
            </NavLink>
            <NavLink to="/about_hub" onClick={() => window.scrollTo(0, 0)} className={({ isActive }) => (isActive ? "text-primary font-semibold" : "")}>
              About Hub
            </NavLink>
          </nav>

          {/* Categories Accordion */}
          {/* <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => (
              <AccordionItem key={category.id} value={String(category.id)} className="border-b">
                <AccordionTrigger className="hover:no-underline text-base">{category.name}</AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-2 ps-2">
                    {category.products.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={product.href}
                          onClick={() => window.scrollTo(0, 0)}
                          className="flex justify-between items-center text-sm hover:text-primary transition-colors"
                        >
                          {product.title}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion> */}

          {/* Auth Buttons */}
          {/* <div className="mt-6 flex flex-col gap-3">
            <Button variant="outline" asChild>
              <Link to="/auth/login" onClick={() => window.scrollTo(0, 0)}>
                Sign in
              </Link>
            </Button>
          </div> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
