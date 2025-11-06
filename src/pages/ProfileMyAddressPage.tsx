import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, PlusCircle, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAddressStore } from "@/stores/addressStore";
import Swal from "sweetalert2";

// Zod schema for address validation
const addressSchema = z.object({
  label: z.string().min(1, "Address label is required").max(50, "Label must be less than 50 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format"),
  street: z.string().min(1, "Street is required").max(100, "Street must be less than 100 characters"),
  buildingNo: z.string().optional(),
  apartmentNo: z.string().optional(),
  floorNo: z.string().optional(),
  details: z.string().max(300, "Details must be less than 200 characters"),
});

type AddressFormData = z.infer<typeof addressSchema>;

const ProfileMyAddressPage = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { addresses, isLoading, fetchAddresses, addAddress, editAddress, deleteAddress } = useAddressStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      phone: "",
      street: "",
      buildingNo: "",
      apartmentNo: "",
      floorNo: "",
      details: "",
    },
  });

  // Load addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const onSubmit = async (data: AddressFormData) => {
    let success = false;

    try {
      if (editingId) {
        success = await editAddress(editingId, data);
      } else {
        success = await addAddress(data);
      }

      if (success) {
        setEditingId(null);
        setShowForm(false);
        reset();
      }
    } catch {
      // Address operation failed
    }
  };

  function openNew() {
    reset();
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(id: number) {
    const addr = addresses.find((a) => a.id === id);
    if (!addr) return;

    // Transform API data to form format
    const formData = {
      label: addr.address2 || "",
      phone: addr.phone_number,
      street: addr.address1,
      buildingNo: addr.building_no || "",
      apartmentNo: addr.apartment_no || "",
      floorNo: addr.floor_no || "",
      details: addr.city,
    };

    setValue("label", formData.label);
    setValue("phone", formData.phone);
    setValue("street", formData.street);
    setValue("buildingNo", formData.buildingNo);
    setValue("apartmentNo", formData.apartmentNo);
    setValue("floorNo", formData.floorNo);
    setValue("details", formData.details);

    setEditingId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: number) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        const success = await deleteAddress(id);
        if (success) {
          Swal.fire({
            title: "Deleted!",
            text: "Your address has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the address.",
          icon: "error",
        });
      } finally {
        setDeletingId(null);
      }
    }
  }

  function cancel() {
    setEditingId(null);
    setShowForm(false);
    reset();
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#3D3D3D] text-2xl font-bold mb-4">My Addresses</h3>
        <Button variant="ghost" onClick={openNew} className="flex items-center gap-2">
          <PlusCircle className="text-primary size-6" />
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6  border border-[#E6E6E6] rounded-md p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4 text-[#1A1A1A]">{editingId ? "Edit Address" : "New Address"}</h3>
          <hr className="w-full mb-6 bg-[#E6E6E6] h-[1px]" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#3a3a3a]">
              <div>
                <Label htmlFor="label" className="mb-2">
                  Address Label *
                </Label>
                <Input id="label" {...register("label")} placeholder="example" className="h-10 text-[#7A7A7A] focus:!outline-none focus:!ring-0 focus:!shadow-none " />
                {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2">
                  Mobile number *
                </Label>
                <PhoneInput
                  country="eg"
                  enableSearch
                  placeholder="Enter phone number"
                  value={watch("phone")?.replace("+", "") || ""}
                  onChange={(value) => setValue("phone", `+${value}`)}
                  inputClass="!w-full !h-10 !text-sm !border !border-[#D9D9D9] !rounded-sm text-[#7A7A7A] focus:!outline-none focus:!ring-0 focus:!shadow-none "
                  buttonClass="!border !border-[#D9D9D9] !rounded-sm"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="street" className="mb-2">
                  Street *
                </Label>
                <Input id="street" {...register("street")} placeholder="street" className="h-10 text-[#7A7A7A] focus:!outline-none focus:!ring-0 focus:!shadow-none " />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-3 w-full">
                <div>
                  <Label htmlFor="buildingNo" className="mb-2">
                    Building no.
                  </Label>
                  <Input
                    id="buildingNo"
                    {...register("buildingNo")}
                    placeholder="example"
                    className="h-10 text-[#7A7A7A] focus:!outline-none focus:!ring-0 focus:!shadow-none "
                  />
                </div>

                <div>
                  <Label htmlFor="apartmentNo" className="mb-2">
                    Apartment no.
                  </Label>
                  <Input
                    id="apartmentNo"
                    {...register("apartmentNo")}
                    placeholder="2"
                    className="h-10 text-[#7A7A7A] focus:!outline-none focus:!ring-0 focus:!shadow-none "
                  />
                </div>

                <div>
                  <Label htmlFor="floorNo" className="mb-2">
                    Floor no.
                  </Label>
                  <Input id="floorNo" {...register("floorNo")} placeholder="2" className="h-10 text-[#7A7A7A] focus:!outline-none focus:!ring-0 focus:!shadow-none " />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="details" className="mb-2">
                  Location In Details *
                </Label>
                <Textarea
                  id="details"
                  {...register("details")}
                  placeholder="example"
                  className="min-h-[80px] resize-none text-[#7A7A7A] r focus:!outline-none focus:!ring-0 focus:!shadow-none "
                />
                {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-4">
              <Button type="submit" disabled={isSubmitting} className="px-6 rounded-sm">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <button type="button" onClick={cancel} className="text-sm underline text-[#9D9D9D]">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-500">No addresses found. Add your first address above.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border border-[#E6E6E6] rounded-md shadow-sm p-4 relative">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{addr.address2 || "Address"}</h4>
                  <p className="text-sm text-[#252525]">
                    {addr.address1} , {addr.city}
                  </p>
                  <p className="text-sm text-[#7A7A7A]">{addr.phone_number}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(addr.id)}
                    disabled={isSubmitting}
                    className="p-2 hover:bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="edit"
                  >
                    <Pencil className="w-4 h-4 text-primary" />
                  </button>

                  <button
                    onClick={() => remove(addr.id)}
                    disabled={deletingId === addr.id}
                    className="p-2 hover:bg-gray-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="delete"
                  >
                    {deletingId === addr.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Trash className="w-4 h-4 text-primary" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default ProfileMyAddressPage;
