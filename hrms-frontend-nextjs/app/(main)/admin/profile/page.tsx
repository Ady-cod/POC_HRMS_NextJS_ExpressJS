"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/utils/toastHelper";
import { EmployeeListItem } from "@/types/types";
import { Eye, EyeOff } from "lucide-react";
import { updateEmployee } from "@/actions/employee";
import { AsYouType } from "libphonenumber-js";
import { ZodError } from "zod";
import { updateEmployeeSchema } from "@/schemas/employeeSchema";
import { formatZodErrors } from "@/utils/formatZodErrors";
// import AnimatedLoader from "@/components/LoaderScreen/AnimatedLoader";
import TimeZoneSelect from "@/components/TimeZoneSelect/TimeZoneSelect";
import moment from "moment-timezone";
import ImageCropperModal from "@/components/ImageCropperModal/ImageCropperModal";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import { Upload, Trash2, User, Briefcase, Shield } from "lucide-react";

// helper to format time zones
const formatTimeZone = (tz: string) =>
  tz ? `(UTC${moment.tz(tz).format("Z")}) ${tz}` : "Not set";

type FormData = {
  name: string;
  email: string;
  employeeId?: string;
  department: string;
  departmentName: string;
  role: string;
  timezone: string;
  phone: string;
  password: string;
};

// for header section of each field
const fieldGroups: {
  title: string;
  icon: React.ElementType;
  fields: (keyof FormData)[];
}[] = [
  {
    title: "Personal Info",
    icon: User,
    fields: ["name", "email", "phone", "timezone"],
  },
  {
    title: "Work Info",
    icon: Briefcase,
    fields: ["departmentName", "role"],
  },
  {
    title: "Security Info",
    icon: Shield,
    fields: ["password"],
  },
];

export default function Profile() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  // const [loading, setLoading] = useState(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showCoverChooser, setShowCoverChooser] = useState(false);

  // TODO: Implement cover image preview & chooser modal
  void coverImage;
  void showCoverChooser;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    department: "",
    departmentName: "",
    role: "",
    timezone: "",
    // employeeId: "",  <= just incase employeeId is required to display
    phone: "",
    password: "**********",
  });
  const [originalData, setOriginalData] = useState(formData);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [emailConfirmPassword, setEmailConfirmPassword] = useState("");
  const emailPasswordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showEmailConfirm) {
      // autofocus the password input when modal opens
      setTimeout(() => emailPasswordRef.current?.focus(), 50);
    }
  }, [showEmailConfirm]);

  const fieldLabels: Record<string, string> = {
    departmentName: "Department",
    role: "Role",
    employeeId: "Employee ID",
    phone: "Phone",
    name: "Name",
    email: "Email",
    timezone: "Time Zone",
    password: "Password",
  };

  // map local form keys to server schema keys
  const serverKeyMap: Record<string, string> = {
    name: "fullName",
    email: "email",
    phone: "phoneNumber",
    timezone: "timezone",
    departmentName: "departmentName",
    role: "role",
  };

  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Failed to fetch profile");

        const current: EmployeeListItem = await res.json();
        const employeeDetails = {
          name: current.fullName || "",
          email: current.email || "",
          department: String(current.department?.id || ""),
          departmentName: current.department?.name || "",
          role: current.role || "",
          timezone: current.timezone || "",
          phone: current.phoneNumber || "",
          password: "**********",
        };

        setFormData(employeeDetails);
        setOriginalData(employeeDetails);
        setEmployeeId(current.id || "");
      } catch (err) {
        showToast("error", "Failed to load profile", [
          "Unable to fetch employee information.",
        ]);
        console.error(err);
      }
      // finally {
      //   setLoading(false);
      // }
    };

    fetchProfile();
  }, []);

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid =
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type) &&
      file.size <= 2 * 1024 * 1024;

    if (!isValid) {
      return showToast("error", "Invalid File", [
        "Upload JPG/JPEG/PNG image under 2MB",
      ]);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result as string);
      setShowCropper(true); // open cropper modal
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleFieldChange = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  // Format phone as user types, similar to ModalForm
  const handlePhoneInputChange = (value: string) => {
    let newValue = value;

    // Ensure leading + if user types digits without it
    if (!newValue.startsWith("+") && newValue.length > 0) {
      if (/^\d+$/.test(newValue)) {
        newValue = "+" + newValue;
      }
    }

    const formatted = new AsYouType().input(newValue);

    // Limit to 15 digits (E.164)
    const digitCount = formatted.replace(/\D/g, "").length;
    if (digitCount > 15) return;

    // clear phone related error when user starts editing
    handleFieldChange("phone", formatted);
    setErrors((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      delete copy[serverKeyMap.phone];
      return Object.keys(copy).length ? copy : null;
    });
  };

  const handleFieldSave = async (key: string, currentPassword?: string) => {
    try {
      const serverKey = serverKeyMap[key] || key;

      // Basic client-side quick validations preserved
      if (key === "name") {
        if (!formData.name || formData.name.trim().length === 0) {
          showToast("error", "Validation Error", ["Name cannot be empty"]);
          return;
        }
      }

      if (key === "email") {
        const email = String(formData.email || "");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showToast("error", "Validation Error", ["Invalid email address"]);
          return;
        }
      }

      if (key === "phone") {
        const phone = String(formData.phone || "");
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 6 || digits.length > 15) {
          showToast("error", "Validation Error", [
            "Phone number must have between 6 and 15 digits (E.164).",
          ]);
          return;
        }
        // Ensure phone has leading +
        if (!phone.startsWith("+")) {
          formData.phone = "+" + digits;
        }
      }

      // Build payload and validate against zod partial schema (single-field validation)
      const payload: Record<string, unknown> = {
        [serverKey]: formData[key as keyof typeof formData],
      };
      // if caller provided current password (for sensitive updates), include it
      if (currentPassword) {
        payload.currentPassword = currentPassword;
      }

      try {
        // updateEmployeeSchema already marks update fields as optional,
        // so validating the single-field payload directly is sufficient.
        updateEmployeeSchema.parse(payload);
      } catch (e) {
        if (e instanceof ZodError) {
          const formatted = formatZodErrors(e);
          setErrors(formatted);
          const errorMessages = e.issues.map((i) => i.message);
          showToast("error", "Validation Error(s):", errorMessages);
          return;
        }
        throw e;
      }

      const result = await updateEmployee(employeeId, payload);

      // updateEmployee returns an object with success/message (and optional zodError)
      if (!result || !result.success) {
        // Server-side validation errors (zod) might be returned as zodError
        type ServerErrorLike = {
          zodError?: unknown;
          message?: string;
          [key: string]: unknown;
        };

        if (result && typeof result === "object") {
          const resObj = result as ServerErrorLike;
          if (resObj.zodError) {
            try {
              // If backend returned a zod-like error payload, show its message.
              setErrors(
                (prev) => prev || { [serverKey]: String(resObj.message) }
              );
            } catch {
              // ignore formatting errors
            }
          }
        }

        const message =
          result && typeof result === "object"
            ? (result as ServerErrorLike).message
            : undefined;

        showToast("error", "Update failed", [message || "Unknown error"]);
        return;
      }

      showToast("success", "Updated", [
        `${fieldLabels[key] || key} updated successfully`,
      ]);

      setEditingField(null);
      setOriginalData(formData);
      // clear errors on success
      setErrors((prev) => {
        if (!prev) return null;
        const copy = { ...prev };
        delete copy[serverKey];
        return Object.keys(copy).length ? copy : null;
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const formatted = formatZodErrors(err);
        setErrors(formatted);
        const errorMessages = err.issues.map((i) => i.message);
        showToast("error", "Validation Error(s):", errorMessages);
      } else if (err instanceof Error) {
        showToast("error", "Update failed", [err.message]);
        console.error(err);
      } else {
        showToast("error", "Update failed", [String(err)]);
        console.error(err);
      }
    }
  };

  const handleCancel = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: originalData[key as keyof typeof originalData],
    }));
    setEditingField(null);
  };

  const toggleVisibility = (field: string) =>
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const handlePasswordUpdate = async () => {
    const { current, new: newPass, confirm } = passwordData;

    if (newPass !== confirm)
      return showToast("error", "Mismatch", ["New passwords do not match"]);
    if (current === newPass)
      return showToast("error", "Invalid Password", [
        "New password must differ from current password",
      ]);

    try {
      // Validate password against shared Zod schema before sending to server
      try {
        updateEmployeeSchema.parse({ password: newPass });
      } catch (e) {
        if (e instanceof ZodError) {
          const formatted = formatZodErrors(e);
          setErrors(formatted);
          const errorMessages = e.issues.map((i) => i.message);
          showToast("error", "Validation Error(s):", errorMessages);
          return;
        }
        throw e;
      }

      await updateEmployee(employeeId, { password: newPass });
      showToast("success", "Password Updated", [
        "Your password has been updated",
      ]);
      // clear password errors on success
      setErrors((prev) => {
        if (!prev) return null;
        const copy = { ...prev };
        delete copy["password"];
        return Object.keys(copy).length ? copy : null;
      });

      setPasswordData({ current: "", new: "", confirm: "" });
      setShowPasswordChange(false);
    } catch (err) {
      showToast("error", "Password update failed", [String(err)]);
      console.error(err);
    }
  };

  // UI
  return (
    <div className="flex flex-col my-8 px-4 gap-2 sm:gap-4">
      {/* {loading && <AnimatedLoader isVisible={loading} />} */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        My Profile
      </h1>

      {/* Profile Header */}
      <div className="bg-orange-500 rounded-lg p-6 mx-4 sm:mx-6 relative h-40 md:h-60 mb-40 md:mb-36 flex justify-center items-center">
        <h1 className="font-bold text-orange-300 text-2xl sm:text-6xl text-center">
          Cover Image
        </h1>

        {/* Action Buttons (top-right on small screens, bottom-right on md+) */}
        <div className="absolute top-0 right-0 md:top-auto md:bottom-0 flex flex-wrap md:flex-nowrap gap-1 md:gap-2 bg-black/30 p-1 md:p-2 rounded-md">
          {coverImage ? (
            <button
              onClick={() => setCoverImage(null)}
              aria-label="Remove cover image"
              className="flex items-center justify-center px-2 md:px-3 py-1 text-xs md:text-sm font-medium text-orange-200 transition hover:text-orange-100"
            >
              {/* Trash icon visible only on mobile, text visible on md+ */}
              <Trash2 className="w-4 h-4 md:hidden" />
              <span className="hidden md:inline">Remove</span>
            </button>
          ) : null}

          <button
            onClick={() => setShowCoverChooser(true)}
            className="flex items-center justify-center gap-1 px-2 md:px-3 py-1 text-xs md:text-sm font-medium text-white bg-lightblue-600 rounded-md hover:bg-lightblue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 md:w-4 md:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5h2M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden md:inline">Edit Image</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-6 absolute -bottom-40 md:-bottom-28 left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 bg-transparent w-full md:w-auto">
          {/* Profile Image with Hover Actions */}
          <div className="relative w-48 h-48 md:w-60 md:h-60 bg-white rounded-full border overflow-hidden flex items-center justify-center group">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-gray-400 flex items-center justify-center w-full h-full">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}

            {/* Cropper Modal */}
            {tempImage && (
              <ImageCropperModal
                image={tempImage}
                open={showCropper}
                onClose={() => setShowCropper(false)}
                onSave={(croppedImg) => {
                  setProfileImage(croppedImg);
                  setShowCropper(false);
                  showToast("success", "Image saved", [
                    "Profile image updated.",
                  ]);
                }}
              />
            )}

            {/* Hover Overlay with Buttons */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-300">
              <Button
                size="sm"
                variant="link"
                className="flex items-center gap-2 no-underline font-bold text-sm sm:text-xl text-lightblue-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 text-lightblue-200" />
                Upload
              </Button>
              {profileImage && (
                <Button
                  size="sm"
                  variant="link"
                  className="text-orange-200 flex items-center gap-2 no-underline font-bold text-sm sm:text-xl"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>

          {/* Confirmation modal for deleting profile image */}
          <ConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => {
              setProfileImage(null);
              setShowDeleteConfirm(false);
              showToast("success", "Image deleted", [
                "Profile image has been removed.",
              ]);
            }}
            title="Delete profile image"
            description="Are you sure you want to delete your profile image? This action cannot be undone."
          />

          {/* Confirmation modal for updating email address */}
          <ConfirmationModal
            isOpen={showEmailConfirm}
            onClose={() => {
              setShowEmailConfirm(false);
              setEmailConfirmPassword("");
            }}
            onConfirm={() => {
              setShowEmailConfirm(false);
              // proceed with saving the email field and send current password for verification/audit
              void handleFieldSave("email", emailConfirmPassword);
              setEmailConfirmPassword("");
            }}
            title="Confirm email change"
            description={
              <span>
                Are you sure you want to change your email to{" "}
                {<strong className="font-semibold">{formData.email}</strong>}?
                Changing your email may affect sign-in and you may need to
                verify the new address.
              </span>
            }
            confirmDisabled={!emailConfirmPassword}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter current password to confirm
              </label>
              <input
                ref={emailPasswordRef}
                type="password"
                value={emailConfirmPassword}
                onChange={(e) => setEmailConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Current password"
                autoFocus
              />
            </div>
          </ConfirmationModal>

          {/* Profile Info */}
          <div className="flex flex-col md:mb-8 mb-0 items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl sm:text-4xl font-semibold text-darkblue-900">
              {formData.name}
            </h2>
            <p className="text-sm text-lightblue-400">{formData.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="space-y-8 px-4 sm:px-8">
        {fieldGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xl font-bold text-lightblue-400 mb-4 flex items-center gap-2">
              <group.icon className="w-5 h-5 text-orange-500" />
              {group.title}
            </h2>
            <div className="space-y-4 bg-[#E7ECF0] p-4 sm:p-6 rounded-lg">
              {group.fields.map((key) => {
                const value = formData[key];
                const serverKey = serverKeyMap[key] || key;
                return (
                  <div
                    key={key}
                    className="border-b border-b-black-600 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <label className="text-lg sm:text-2xl font-bold text-darkblue-900 capitalize">
                      {fieldLabels[key] || key}
                    </label>

                    {editingField === key ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-2/3">
                        <div className="w-full">
                          {key === "timezone" ? (
                            <>
                              <TimeZoneSelect
                                value={formData.timezone}
                                onChange={(val) =>
                                  handleFieldChange("timezone", val)
                                }
                              />
                              {errors?.[serverKey] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[serverKey]}
                                </p>
                              )}
                            </>
                          ) : key === "departmentName" ? (
                            <>
                              <Select
                                value={formData.departmentName}
                                onValueChange={(val) =>
                                  handleFieldChange("departmentName", val)
                                }
                              >
                                <SelectTrigger className="w-full border rounded-md p-2 text-base sm:text-xl text-lightblue-700">
                                  <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    "HR",
                                    "Web Development",
                                    "UI/UX",
                                    "QA",
                                    "BA",
                                    "SM",
                                  ].map((dept) => (
                                    <SelectItem
                                      key={dept}
                                      value={dept}
                                      className="data-[highlighted]:bg-lightblue-100 data-[highlighted]:text-lightblue-700 data-[state=checked]:bg-lightblue-800 data-[state=checked]:text-white cursor-pointer text-lightblue-800"
                                    >
                                      {dept}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <input
                                type="hidden"
                                name="departmentName"
                                value={formData.departmentName}
                                required={false}
                              />
                              {errors?.[serverKey] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[serverKey]}
                                </p>
                              )}
                            </>
                          ) : key === "role" ? (
                            <>
                              <Select
                                value={formData.role}
                                onValueChange={(val) =>
                                  handleFieldChange("role", val)
                                }
                              >
                                <SelectTrigger className="w-full border rounded-md p-2 text-base sm:text-xl text-lightblue-700">
                                  <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    "EMPLOYEE",
                                    "INTERN",
                                    "HR_INTERN",
                                    "HR_EMPLOYEE",
                                    "HR_MANAGER",
                                    "MANAGER",
                                    "ADMIN",
                                  ].map((r) => (
                                    <SelectItem
                                      key={r}
                                      value={r}
                                      className="data-[highlighted]:bg-lightblue-100 data-[highlighted]:text-lightblue-700 data-[state=checked]:bg-lightblue-800 data-[state=checked]:text-white cursor-pointer text-lightblue-800"
                                    >
                                      {r}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <input
                                type="hidden"
                                name="role"
                                value={formData.role}
                              />
                              {errors?.[serverKey] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[serverKey]}
                                </p>
                              )}
                            </>
                          ) : key === "phone" ? (
                            <>
                              <Input
                                className="w-full text-base sm:text-xl text-lightblue-700 border border-lightblue-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue-700"
                                value={formData.phone}
                                onChange={(e) =>
                                  handlePhoneInputChange(e.target.value)
                                }
                                placeholder={"e.g., +40715632783"}
                              />
                              {errors?.[serverKey] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[serverKey]}
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <Input
                                className="w-full text-base sm:text-xl text-lightblue-700 border border-lightblue-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue-700"
                                value={value}
                                onChange={(e) =>
                                  handleFieldChange(key, e.target.value)
                                }
                              />
                              {errors?.[serverKey] && (
                                <p className="text-sm text-red-600 mt-1">
                                  {errors[serverKey]}
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleCancel(key)}
                            className="text-orange-500 border-orange-500 hover:bg-orange-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-lightblue-800 hover:bg-lightblue-600"
                            onClick={() => {
                              if (key === "email") {
                                // show confirmation before changing email
                                setShowEmailConfirm(true);
                              } else {
                                void handleFieldSave(key);
                              }
                            }}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full sm:w-2/3">
                        <span className="text-lightblue-700 text-sm sm:text-xl">
                          {key === "timezone"
                            ? formatTimeZone(formData.timezone)
                            : value || "Not set"}
                        </span>
                        {key !== "employeeId" &&
                          (key === "password" ? (
                            !showPasswordChange && (
                              <Button
                                variant="link"
                                className="text-lightblue-700 p-0 font-bold text-sm sm:text-lg"
                                onClick={() => setShowPasswordChange(true)}
                              >
                                Change Password
                              </Button>
                            )
                          ) : (
                            <Button
                              variant="link"
                              className="text-lightblue-700 p-0 font-bold text-sm sm:text-lg"
                              onClick={() => {
                                setEditingField(key);
                                setErrors(null);
                              }}
                            >
                              Edit
                            </Button>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Password Update */}
      <div className="flex justify-end px-4 sm:px-8">
        {showPasswordChange && (
          <div className="space-y-4 md:w-3/4 w-full rounded-lg">
            {["current", "new", "confirm"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={visible[field] ? "text" : "password"}
                  placeholder={`${
                    field === "confirm"
                      ? "Confirm New"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  } Password`}
                  value={passwordData[field as keyof typeof passwordData]}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full border border-lightblue-600 rounded-md px-4 py-2 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-lightblue-600 text-lightblue-600"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => toggleVisibility(field)}
                >
                  {visible[field] ? (
                    <EyeOff className="w-5 h-5 text-lightblue-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-lightblue-600" />
                  )}
                </button>
              </div>
            ))}

            {errors?.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                className="border-lightblue-800 text-lightblue-800 hover:bg-lightblue-50 hover:text-lightblue-900 w-full sm:w-auto"
                onClick={() => setShowPasswordChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordUpdate}
                className="bg-lightblue-800 hover:bg-lightblue-600 w-full sm:w-auto"
              >
                Update Password
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
