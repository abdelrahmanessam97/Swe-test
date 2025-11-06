import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAddressStore, type Address } from "@/stores/addressStore";
import { useAuthStore } from "@/stores/authStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useProfileStore } from "@/stores/profileStore";
import { isAuthenticated } from "@/utils/auth/token";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";

// Zod validation schema
const checkoutPersonalInfoSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters").max(100, "Full name is too long"),
    phoneNumber: z.string().min(10, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    street: z.string().optional(),
    building: z.string().optional(),
    apartment: z.string().optional(),
    floor: z.string().optional(),
    notes: z.string().optional(),
    saveAddress: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If adding new address, require address fields
      if (data.street || data.building || data.apartment || data.floor) {
        return data.street && data.building && data.apartment && data.floor;
      }
      return true;
    },
    {
      message: "All address fields are required when adding a new address",
      path: ["street"],
    }
  );

type CheckoutPersonalInfoFormData = z.infer<typeof checkoutPersonalInfoSchema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function CheckoutPersonalInfo({ onNext, onBack }: Props) {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [addNewAddress, setAddNewAddress] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Checkout store
  const { submitBillingAddress, isLoading } = useCheckoutStore();

  // Address store
  const { addresses, isLoading: addressesLoading, editAddress, fetchAddresses } = useAddressStore();

  // Auth store
  const { isUserLoggedIn, login } = useAuthStore();

  // Profile store
  const { info: profileInfo, fetchInfo } = useProfileStore();

  // Check if user is authenticated
  const userIsAuthenticated = isAuthenticated() && isUserLoggedIn;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<CheckoutPersonalInfoFormData>({
    resolver: zodResolver(checkoutPersonalInfoSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      street: "",
      building: "",
      apartment: "",
      floor: "",
      notes: "",
      saveAddress: false,
    },
  });

  const phoneNumber = watch("phoneNumber");
  const saveAddress = watch("saveAddress");

  // Fetch addresses and profile info when user is authenticated
  useEffect(() => {
    if (userIsAuthenticated) {
      fetchAddresses();
      fetchInfo();
    }
  }, [userIsAuthenticated, fetchAddresses, fetchInfo]);

  // Populate form with profile info when authenticated
  useEffect(() => {
    if (userIsAuthenticated && profileInfo) {
      const data = profileInfo as {
        first_name?: string;
        last_name?: string;
        phone?: string;
        phone_number?: string;
        email?: string;
      };
      const firstName = data.first_name || "";
      const lastName = data.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const phone = data.phone || data.phone_number || "";
      const email = data.email || "";

      if (fullName) setValue("fullName", fullName, { shouldDirty: true });
      if (phone) setValue("phoneNumber", phone, { shouldDirty: true });
      if (email) setValue("email", email, { shouldDirty: true });
    }
  }, [userIsAuthenticated, profileInfo, setValue]);

  // Clear password field when checkbox is unchecked
  useEffect(() => {
    if (!showPassword) {
      setValue("password", "");
    }
  }, [showPassword, setValue]);

  // Check if all required fields are dirty
  const requiredFieldsAreDirty = addNewAddress
    ? dirtyFields.fullName && dirtyFields.phoneNumber && dirtyFields.email && dirtyFields.street && dirtyFields.building && dirtyFields.apartment && dirtyFields.floor
    : userIsAuthenticated
    ? dirtyFields.fullName && dirtyFields.phoneNumber && dirtyFields.email && selectedAddress !== null
    : dirtyFields.fullName && dirtyFields.phoneNumber && dirtyFields.email;

  const onSubmit = async (data: CheckoutPersonalInfoFormData) => {
    // Check if all required fields are dirty
    if (!requiredFieldsAreDirty) {
      toast.error("Please fill in all required fields");
      return;
    }

    // If password is provided, attempt to login first
    if (showPassword && data.password) {
      setIsLoggingIn(true);
      try {
        const loginSuccess = await login({
          email: data.email,
          password: data.password,
        });

        if (!loginSuccess) {
          toast.error("Login failed. Please check your credentials.");
          return;
        }

        // Login successful - no toast needed

        // Refresh addresses after successful login
        await fetchAddresses();

        // Reset password field and checkbox after successful login
        setShowPassword(false);
        setValue("password", "");
      } catch {
        toast.error("Login failed. Please try again.");
        return;
      } finally {
        setIsLoggingIn(false);
      }
    }

    if (editingAddress) {
      const formData = {
        label: data.notes || "",
        phone: data.phoneNumber,
        street: data.street || "",
        buildingNo: data.building || "",
        apartmentNo: data.apartment || "",
        floorNo: data.floor || "",
        details: data.street || "",
      };

      const success = await editAddress(editingAddress.id, formData);
      if (success) {
        setEditingAddress(null);
        setAddNewAddress(false);
        toast.success("Address updated");
      }
      return;
    }

    // If user is authenticated and has selected an address, use that address
    let addressData: {
      address1: string;
      address2: string;
      city: string;
      phone_number: string;
      building_no: string;
      floor_no: string;
      apartment_no: string;
    } = {
      address1: "",
      address2: "",
      city: "",
      phone_number: "",
      building_no: "",
      floor_no: "",
      apartment_no: "",
    };

    if (userIsAuthenticated && selectedAddress && !addNewAddress) {
      const selectedAddr = addresses.find((addr) => addr.id === selectedAddress);
      if (selectedAddr) {
        addressData = {
          address1: selectedAddr.address1,
          address2: selectedAddr.address2 || "",
          city: selectedAddr.city,
          phone_number: selectedAddr.phone_number,
          building_no: selectedAddr.building_no || "",
          floor_no: selectedAddr.floor_no || "",
          apartment_no: selectedAddr.apartment_no || "",
        };
      }
    } else if (addNewAddress) {
      // Use form data for new address
      addressData = {
        address1: data.street || "",
        address2: `Building: ${data.building}, Floor: ${data.floor}, Apartment: ${data.apartment}${data.notes ? `, Notes: ${data.notes}` : ""}`,
        city: "", // You might want to add city field to the form
        phone_number: data.phoneNumber,
        building_no: data.building || "",
        floor_no: data.floor || "",
        apartment_no: data.apartment || "",
      };
    }

    // Split full name into first and last name
    const nameParts = data.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Map form data to API payload structure
    const payload = {
      model: {
        billing_new_address: {
          first_name: firstName,
          last_name: lastName,
          email: data.email,
          company_enabled: true,
          company_required: false,
          company: "",
          country_enabled: true,
          country_id: 0,
          country_name: "",
          state_province_enabled: true,
          state_province_id: 0,
          state_province_name: "",
          county_enabled: true,
          county_required: false,
          county: "",
          city_enabled: true,
          city_required: true,
          city: addressData.city || "",
          street_address_enabled: true,
          street_address_required: true,
          address1: addressData.address1 || "",
          street_address2_enabled: true,
          street_address2_required: true,
          address2: addressData.address2 || "",
          phone_enabled: true,
          phone_required: true,
          phone_number: addressData.phone_number || data.phoneNumber,
        },
        ship_to_same_address: true,
      },
      form: {},
    };

    await submitBillingAddress(payload);
    // Navigate to next step
    onNext();
  };

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Progress Steps */}
      <div className="flex items-center justify-center text-xs sm:text-sm md:text-base font-medium w-full">
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-gray-400">
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs sm:text-sm">1</div>
            <span className="text-center sm:text-left">Cart</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-primary">
          <div className="flex-1 hidden sm:block border-t-2 border-primary mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border bg-primary text-white border-primary text-xs sm:text-sm">2</div>
            <span className="text-center sm:text-left">Personal info</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-primary mx-2" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-fit text-gray-400">
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs sm:text-sm">3</div>
            <span className="text-center sm:text-left">Payment method</span>
          </div>
          <div className="flex-1 hidden sm:block border-t-2 border-gray-300 mx-2" />
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded">
        <h2 className="font-semibold text-lg">Personal info</h2>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Name example" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <PhoneInput
              country="eg"
              enableSearch
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(value) => {
                const fullNumber = `+${value}`;
                setValue("phoneNumber", fullNumber, { shouldValidate: true, shouldDirty: true });
              }}
              inputClass="!w-full !text-sm !border !border-input !rounded-md"
              buttonClass="!border !border-input !rounded-l-md"
            />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="email@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {!userIsAuthenticated && (
            <>
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-2">
                <Checkbox id="showPassword" checked={showPassword} onCheckedChange={(checked) => setShowPassword(checked as boolean)} />
                <Label htmlFor="showPassword">If you have a password, please enter it here to login</Label>
              </div>

              {showPassword && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type="password" placeholder="Enter your password" {...register("password")} disabled={isLoggingIn} />
                    {isLoggingIn && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Address details</h2>
            {addNewAddress ? (
              <button
                type="button"
                className="flex items-center gap-1 text-gray-400 hover:text-primary underline"
                onClick={() => {
                  setAddNewAddress(false);
                  setEditingAddress(null);
                }}
              >
                Cancel
              </button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex items-center gap-1 text-primary border-primary hover:bg-primary hover:text-white"
                onClick={() => setAddNewAddress(true)}
              >
                <Plus size={16} /> {editingAddress ? "Edit Address" : "Add New Address"}
              </Button>
            )}
          </div>

          <Separator />
          {addNewAddress && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-3">
                <Label htmlFor="street">Street</Label>
                <Input id="street" placeholder="Street" {...register("street")} />
                {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="building">Building no.</Label>
                <Input type="text" id="building" placeholder="example" {...register("building")} />
                {errors.building && <p className="text-sm text-red-500">{errors.building.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apartment">Apartment no.</Label>
                <Input id="apartment" type="text" placeholder="2" {...register("apartment")} />
                {errors.apartment && <p className="text-sm text-red-500">{errors.apartment.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Floor no.</Label>
                <Input id="floor" type="text" placeholder="2" {...register("floor")} />
                {errors.floor && <p className="text-sm text-red-500">{errors.floor.message}</p>}
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="example" {...register("notes")} />
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-2">
                <Checkbox id="preference" checked={saveAddress} onCheckedChange={(checked) => setValue("saveAddress", checked as boolean, { shouldDirty: true })} />
                <Label htmlFor="preference" className="text-xs">
                  Save this address for the next order
                </Label>
              </div>
            </div>
          )}

          {/* Show addresses only if user is authenticated */}
          {userIsAuthenticated && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Select Address</h3>
              </div>

              {addressesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <Card
                      key={addr.id}
                      className={cn("cursor-pointer border-2 relative", selectedAddress === addr.id ? "border-primary" : "border-gray-200")}
                      onClick={() => {
                        setSelectedAddress(addr.id);
                        setAddNewAddress(false);
                        setEditingAddress(null);
                      }}
                    >
                      <CardHeader className="flex flex-row justify-between items-center p-3">
                        <span className={cn("font-medium", selectedAddress === addr.id ? "text-primary" : "")}>{addr.address2 || "Address"}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(addr);
                            setAddNewAddress(true);
                            setValue("street", addr.address1);
                            setValue("building", addr.building_no || "");
                            setValue("apartment", addr.apartment_no || "");
                            setValue("floor", addr.floor_no || "");
                            setValue("notes", addr.address2 || "");
                            setValue("phoneNumber", addr.phone_number);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-600 space-y-1">
                        <p>
                          {addr.address1}, {addr.city}
                        </p>
                        <p>Phone: {addr.phone_number}</p>
                        {addr.building_no && <p>Building: {addr.building_no}</p>}
                        {addr.floor_no && <p>Floor: {addr.floor_no}</p>}
                        {addr.apartment_no && <p>Apartment: {addr.apartment_no}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No saved addresses found.</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => setAddNewAddress(true)} className="mt-2">
                    Add Your First Address
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          disabled={isLoading}
          className="text-gray-500 hover:text-primary font-bold flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <Button
          onClick={handleSubmit(onSubmit)}
          type="button"
          disabled={!requiredFieldsAreDirty || isLoading || isLoggingIn}
          className="text-gray-500 hover:text-primary font-bold flex gap-2 items-center bg-transparent shadow-none hover:bg-transparent disabled:opacity-50"
        >
          {isLoggingIn ? "Logging in..." : isLoading ? "Submitting..." : "Next"} <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
