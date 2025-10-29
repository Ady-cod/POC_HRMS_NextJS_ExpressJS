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
// import AnimatedLoader from "@/components/LoaderScreen/AnimatedLoader";
import TimeZoneSelect from "@/components/TimeZoneSelect/TimeZoneSelect";
import moment from "moment-timezone";
import ImageCropperModal from "@/components/ImageCropperModal/ImageCropperModal";
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

  const handleFieldSave = async (key: string) => {
    try {
      const map: Record<string, string> = {
        name: "fullName",
        email: "email",
        phone: "phoneNumber",
        timezone: "timezone",
        departmentName: "departmentName",
        role: "role",
      };

      await updateEmployee(employeeId, {
        [map[key]]: formData[key as keyof typeof formData],
      });
      showToast("success", "Updated", [
        `${fieldLabels[key] || key} updated successfully`,
      ]);

      setEditingField(null);
      setOriginalData(formData);
    } catch (err) {
      showToast("error", "Update failed", [String(err)]);
      console.error(err);
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
      await updateEmployee(employeeId, { password: newPass });
      showToast("success", "Password Updated", [
        "Your password has been updated",
      ]);
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
      <div className="bg-orange-500 rounded-lg p-6 m-6 relative h-60 mb-36 flex justify-center items-center">
        <h1 className="font-bold text-orange-300 text-6xl text-center">
          Cover Image
        </h1>

        {/* Action Buttons (Top-Right of Cover Block) */}
        <div className="absolute bottom-0 right-0 flex gap-2 bg-black/30 p-2 rounded-br-lg rounded-tl-lg">
          <button
            onClick={() => setCoverImage(null)}
            className="px-3 py-1 text-sm font-medium text-orange-200 transition"
          >
            Remove
          </button>
          <button
            onClick={() => setShowCoverChooser(true)}
            className="px-3 py-1 text-sm font-medium text-white bg-lightblue-600 rounded-md hover:bg-lightblue-700 transition flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            Edit Image
          </button>
        </div>

        <div className="flex items-end gap-6 absolute -bottom-32 left-8">
          {/* Profile Image with Hover Actions */}
          <div className="relative w-60 h-60 bg-white rounded-full border overflow-hidden flex items-center justify-center group">
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
                  className="w-16 h-16"
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
                }}
              />
            )}

            {/* Hover Overlay with Buttons */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-300">
              <Button
                size="sm"
                variant="link"
                className="text-white flex items-center gap-2 no-underline font-bold text-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 font-bold text-xl" />
                Upload
              </Button>
              <Button
                size="sm"
                variant="link"
                className="text-red-200 flex items-center gap-2 no-underline font-bold text-xl"
                onClick={() => setProfileImage(null)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>

            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col mb-8">
            <h2 className="text-4xl font-semibold text-darkblue-900">
              {formData.name}
            </h2>
            <p className="text-sm text-lightblue-400">{formData.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="space-y-8 px-8">
        {fieldGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xl font-bold text-lightblue-400 mb-4 flex items-center gap-2">
              <group.icon className="w-5 h-5 text-orange-500" />
              {group.title}
            </h2>
            <div className="space-y-4 bg-[#E7ECF0] p-6 rounded-lg">
              {group.fields.map((key) => {
                const value = formData[key];
                return (
                  <div
                    key={key}
                    className="border-b border-b-black-600 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <label className="text-2xl font-bold text-darkblue-900 capitalize">
                      {fieldLabels[key] || key}
                    </label>

                    {editingField === key ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-2/3">
                        {key === "timezone" ? (
                          <TimeZoneSelect
                            value={formData.timezone}
                            onChange={(val) =>
                              handleFieldChange("timezone", val)
                            }
                          />
                        ) : key === "departmentName" ? (
                          <Select
                            value={formData.departmentName}
                            onValueChange={(val) =>
                              handleFieldChange("departmentName", val)
                            }
                          >
                            <SelectTrigger className="w-full border rounded-md p-2 text-xl text-lightblue-700">
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
                        ) : key === "role" ? (
                          <Select
                            value={formData.role}
                            onValueChange={(val) =>
                              handleFieldChange("role", val)
                            }
                          >
                            <SelectTrigger className="w-full border rounded-md p-2 text-xl text-lightblue-700">
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
                              ].map((role) => (
                                <SelectItem
                                  key={role}
                                  value={role}
                                  className="data-[highlighted]:bg-lightblue-100 data-[highlighted]:text-lightblue-700 data-[state=checked]:bg-lightblue-800 data-[state=checked]:text-white cursor-pointer text-lightblue-800"
                                >
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            className="w-full text-xl text-lightblue-700 border border-lightblue-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lightblue-700 focus:text-xl"
                            value={value}
                            onChange={(e) =>
                              handleFieldChange(key, e.target.value)
                            }
                          />
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleCancel(key)}
                            className="border-lightblue-800 text-lightblue-800 hover:bg-lightblue-50 hover:text-lightblue-900"
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-lightblue-800 hover:bg-lightblue-600"
                            onClick={() => handleFieldSave(key)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full sm:w-2/3">
                        <span className="text-lightblue-700 text-xl">
                          {key === "timezone"
                            ? formatTimeZone(formData.timezone)
                            : value || "Not set"}
                        </span>
                        {key !== "employeeId" &&
                          (key === "password" ? (
                            !showPasswordChange && (
                              <Button
                                variant="link"
                                className="text-lightblue-700 p-0 font-bold text-lg"
                                onClick={() => setShowPasswordChange(true)}
                              >
                                Change Password
                              </Button>
                            )
                          ) : (
                            <Button
                              variant="link"
                              className="text-lightblue-700 p-0 font-bold text-lg"
                              onClick={() => setEditingField(key)}
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
      <div className="flex justify-end px-8">
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
                    <Eye className="w-5 h-5 text-lightblue-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-lightblue-600" />
                  )}
                </button>
              </div>
            ))}

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
