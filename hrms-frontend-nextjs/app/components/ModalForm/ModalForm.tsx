// src/components/ModalForm.tsx
"use client";

import "./ModalForm.css";
import { useState, useEffect, useRef } from "react";
import { createEmployee, updateEmployee } from "@/actions/employee";
import { ZodError } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AsYouType } from "libphonenumber-js";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "@/schemas/employeeSchema";
import { formatZodErrors } from "@/utils/formatZodErrors";
import { showToast } from "@/utils/toastHelper";
import { EmployeeListItem } from "@/types/types";
import CountryStateCitySelect from "@/components/CountryStateCitySelect/CountryStateCitySelect";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  refreshEmployees: () => void;
  employeeData: EmployeeListItem | null;
}

interface CalendarInputState {
  isOpen: boolean;
  isInteracting: boolean;
}

interface InputRefs {
  birthDate: React.RefObject<HTMLInputElement>;
  joinDate: React.RefObject<HTMLInputElement>;
}

type InputRefKey = keyof InputRefs;

type CalendarState = {
  [key in InputRefKey]: CalendarInputState;
};

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  refreshEmployees,
  employeeData,
}) => {
  // State to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Refs for password check input field
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string> | null>(null); // State to store form validation errors

  const [phoneNumber, setPhoneNumber] = useState(""); // State to store phone number input in order to format it while typing

  // State object to track open/interaction status for each date input
  const [calendarState, setCalendarState] = useState<CalendarState>({
    birthDate: { isOpen: false, isInteracting: false },
    joinDate: { isOpen: false, isInteracting: false },
  });

  // Refs for each date input field
  const inputRefs: InputRefs = {
    birthDate: useRef(null),
    joinDate: useRef(null),
  };

  const [country, setCountry] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  useEffect(() => {
    if (employeeData) {
      setPhoneNumber(employeeData.phoneNumber ?? "");
      setCountry(employeeData.country);
      setCountryCode(employeeData.countryCode ?? "");
      setState(employeeData.state ?? "");
      setStateCode(employeeData.stateCode ?? "");
      setCity(employeeData.city);
    } else {
      setPhoneNumber("");
      setCountry("");
      setCountryCode("");
      setState("");
      setStateCode("");
      setCity("");
    }
  }, [employeeData]);

  useEffect(() => {
    const handleCalendarInteraction = (event: MouseEvent) => {
      // Loop through each input to detect if interaction is within one of the calendar popups
      Object.keys(inputRefs).forEach((key: string) => {
        const inputRefKey = key as InputRefKey;
        if (
          inputRefs[inputRefKey].current &&
          inputRefs[inputRefKey].current!.contains(event.target as Node)
        ) {
          setCalendarState((prevState) => ({
            ...prevState,
            [inputRefKey]: {
              ...prevState[inputRefKey],
              isInteracting: true,
            },
          }));
          setTimeout(() => {
            setCalendarState((prevState) => ({
              ...prevState,
              [inputRefKey]: {
                ...prevState[inputRefKey],
                isInteracting: false,
              },
            }));
          }, 300); // Reset after interaction
        }
      });
    };

    document.addEventListener("mousedown", handleCalendarInteraction);

    return () => {
      document.removeEventListener("mousedown", handleCalendarInteraction);
    };
    // Safe to omit inputRefs from dependencies because it's stable
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFocus = (key: InputRefKey) => {
    setCalendarState((prevState) => ({
      ...prevState,
      [key]: { ...prevState[key], isOpen: true },
    }));
  };

  const handleBlur = (key: InputRefKey) => {
    if (!calendarState[key].isInteracting) {
      setCalendarState((prevState) => ({
        ...prevState,
        [key]: { ...prevState[key], isOpen: false },
      }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleHover = (key: InputRefKey, isOpen: boolean) => {
    setCalendarState((prevState) => ({
      ...prevState,
      [key]: { ...prevState[key], isOpen },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // Get the form element
    const formData = new FormData(form);
    const employeeInputData = Object.fromEntries(formData.entries());

    employeeInputData.country = country;
    employeeInputData.countryCode = countryCode;
    employeeInputData.state = state;
    employeeInputData.stateCode = stateCode;
    employeeInputData.city = city;

    // Access the Confirm Password value using the ref
    const confirmPassword = confirmPasswordRef.current?.value;

    // Validate the password and confirm password match
    if (employeeInputData.password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match!" });

      // Display a toast message with the error and return early
      showToast("error", "Password check fail:", ["Passwords do not match!"]);

      return;
    }

    // Additional validation for age difference between birth date and joining date
    const birthDate = new Date(employeeInputData.birthDate as string);
    const joinDate = new Date(employeeInputData.dateOfJoining as string);
    const ageAtJoining =
      (joinDate.getTime() - birthDate.getTime()) /
      (365.25 * 24 * 60 * 60 * 1000);

    if (ageAtJoining < 18) {
      setErrors({
        birthDate:
          "Birth date must be at least 18 years before the joining date.",
        dateOfJoining:
          "Joining date must be at least 18 years after the birth date.",
      });
      showToast("error", "Date validation error:", [
        "Joining age must be at least 18 years.",
      ]);

      return;
    }

    try {
      let response;
      // Check if the employeeData is present, to determine if the form is for creating or updating an employee
      if (employeeData) {
        // Filter the data that has not been updated or empty values
        const filteredData = Object.fromEntries(
          Object.entries(employeeInputData).filter(([key, value]) => {
            if (key === "birthDate" || key === "dateOfJoining") {
              // Handle date fields
              return value !== "" && value !== employeeData[key]?.split("T")[0];
            }
            if (key === "departmentName") {
              // Handle department name
              return value !== "" && value !== employeeData.department?.name;
            }
            // Handle other fields
            return (
              value !== "" &&
              value !== employeeData[key as keyof EmployeeListItem]
            );
          })
        );
        // If no data has been updated, return early
        if (Object.entries(filteredData).length === 0) {
          // Reset previous errors if any
          if (errors) setErrors(null);

          // Display a toast message with the error for no changes made
          showToast("error", "No changes made:", [
            "No changes made to the employee data.",
            "Please provide new values for at least one field.",
            "Clearing or keeping existing values is not considered an update.",
          ]);
          return;
        }
        // Validate the form data for updating an employee
        const validatedData = updateEmployeeSchema.parse(filteredData);

        // Send the data to the server action and get the response
        response = await updateEmployee(employeeData.id, validatedData);
      } else {
        // Validate the form data for creating an employee
        const schema = createEmployeeSchema(hasFetched);
        const validatedData = schema.parse(employeeInputData);
        // Send the data to the server action and get the response
        response = await createEmployee(validatedData);
      }

      if (!response.success) {
        // Check if the server returned validation errors
        if (response.zodError) {
          // throw the ZodError to be caught and displayed by the error handling block
          throw new ZodError(response.zodError.issues);
        } else {
          // Throw a general error containing the server message
          throw new Error(response.message);
        }
      }

      setErrors(null); // Reset errors on successful submission

      // Reset visibility of the password field
      setShowPassword(false);

      // Display a success toast message for fullfilling the action
      const action = employeeData ? "updated" : "created";
      showToast("success", "Success!", [
        `Employee "${employeeInputData.fullName}" ${action} successfully!`,
      ]);

      // Re-fetch employees in EmployeeTable, to show the new/updated employee
      refreshEmployees();

      // Reset the form after successful submission
      form.reset();
      setPhoneNumber("");
      setCountry("");
      setCountryCode("");
      setState("");
      setStateCode("");
      setCity("");
      setHasFetched(false);
    } catch (error) {
      // Check all validation errors
      if (error instanceof ZodError) {
        // Format Zod error messages to be displayed inline
        const formattedErrors = formatZodErrors(error);
        setErrors(formattedErrors);

        // Display a toast message with the Zod error details
        const errorMessages = error.issues.map((issue) => issue.message);
        showToast("error", "Validation Error(s):", errorMessages);
      } else if (error instanceof Error) {
        if (errors) setErrors(null); // Reset errors on unexpected error (which is not a validation error)

        // General JavaScript Error display in a toast
        const errorMessages = error.message.split("\n");
        const errorAction = employeeData ? "updating" : "creating";
        showToast("error", `Error in ${errorAction} employee:`, errorMessages);

        // console.error(`Error in ${errorAction} employee:`, error);
      } else {
        if (errors) setErrors(null); // Reset errors on error of unknown type

        // Display unexpected errors that don't match known types
        const errorAction = employeeData ? "updating" : "creating";
        showToast("error", `Error in ${errorAction} employee`, [
          "An unknown error occurred. Please check your connection or try again later.",
        ]);

        console.error(
          `Unexpected non-standard error in ${errorAction} employee:`,
          error
        );
      }
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({}); // Reset errors when the modal is closed
    setShowPassword(false); // Reset password visibility
    setPhoneNumber(""); // Reset phone number state
    // Reset CountryStateCity Component states
    setCountry("");
    setCountryCode("");
    setState("");
    setStateCode("");
    setCity("");
    setHasFetched(false);
  };

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const hundredYearsAgo = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );
  const foundingYear = 2021; //This is the founding year of the company

  const maxBirthDate = eighteenYearsAgo.toISOString().split("T")[0];
  const minBirthDate = hundredYearsAgo.toISOString().split("T")[0];

  // Calendar setting requires UTC to display min date consistently, becase it interprets the date as UTC
  const minJoinDate = new Date(Date.UTC(foundingYear, 0, 1))
    .toISOString()
    .split("T")[0];
  const maxJoinDate = today.toISOString().split("T")[0];

  // Ensure all hooks run consistently before conditionally returning null.
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={handleClose}>
          ×
        </button>

        <h3 className="section-title">
          {employeeData && "Edit"} Account Details
        </h3>
        <form onSubmit={handleSubmit} method="post" className="modal-form">
          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder={`Email${!employeeData ? "*" : ""}`}
              required={!employeeData}
              defaultValue={employeeData?.email}
              className={`input-field sm:w-[49.173%] ${
                errors?.email ? "error" : ""
              }`}
            />
            {errors?.email && <p className="error-message">{errors.email}</p>}
            <div className="relative w-[100%] sm:max-w-[49.173%]">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={`Password (6-16 characters)${
                  !employeeData ? "*" : ""
                }`}
                required={!employeeData}
                className={`input-field w-full password ${
                  errors?.password ? "error" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  size="lg"
                  className="text-gray-600 hover:text-gray-800 hover:text-2xl"
                />
              </button>
            </div>
            {errors?.password && (
              <p className="error-message">{errors.password}</p>
            )}
            <input
              ref={confirmPasswordRef}
              type="password"
              placeholder={`Confirm Password${!employeeData ? "*" : ""}`}
              required={!employeeData}
              className={`confirm-password-field ${
                errors?.confirmPassword ? "error" : ""
              }`}
            />
            {errors?.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          <h3 className="section-title">Personal Information</h3>
          <div className="input-group">
            <input
              name="fullName"
              type="text"
              placeholder={`Employee Name${!employeeData ? "*" : ""}`}
              required={!employeeData}
              defaultValue={employeeData?.fullName}
              className={`input-field ${errors?.fullName ? "error" : ""}`}
            />
            {errors?.fullName && (
              <p className="error-message">{errors.fullName}</p>
            )}
            {/* Real-time formatting for phone number input */}
            <input
              name="phoneNumber"
              type="text"
              placeholder={`Phone number${
                !employeeData ? "*" : ""
              } (e.g., +40715632783)`}
              required={!employeeData}
              value={phoneNumber}
              onChange={(e) => {
                const formattedNumber = new AsYouType().input(e.target.value);
                setPhoneNumber(formattedNumber);
              }}
              className={`input-field ${errors?.phoneNumber ? "error" : ""}`}
            />
            {errors?.phoneNumber && (
              <p className="error-message">{errors.phoneNumber}</p>
            )}
          </div>
          <div className="input-group">
            <input
              name="streetAddress"
              type="text"
              placeholder="Street"
              defaultValue={employeeData?.streetAddress ?? ""}
              className={`input-field ${errors?.streetAddress ? "error" : ""}`}
            />
            {errors?.streetAddress && (
              <p className="error-message">{errors.streetAddress}</p>
            )}
            <input
              name="birthDate"
              ref={inputRefs.birthDate}
              type={calendarState.birthDate.isOpen ? "date" : "text"}
              placeholder={`Birth Date${!employeeData ? "*" : ""}`}
              min={minBirthDate}
              max={maxBirthDate}
              required={!employeeData}
              defaultValue={employeeData?.birthDate.split("T")[0]}
              onFocus={() => handleFocus("birthDate")}
              onBlur={() => handleBlur("birthDate")}
              // onMouseEnter={() => handleHover("birthDate", true)}
              // onMouseLeave={() => handleHover("birthDate", false)}
              className={`input-field date-field ${
                errors?.birthDate ? "error" : ""
              }`}
            />
            {errors?.birthDate && (
              <p className="error-message">{errors.birthDate}</p>
            )}
          </div>
          <div className="input-group">
            <select
              name="departmentName"
              required={!employeeData}
              defaultValue={employeeData?.department?.name}
              className={`input-field ${errors?.departmentName ? "error" : ""}`}
            >
              <option value="">Select Department{!employeeData && "*"}</option>
              <option value="HR">HR</option>
              <option value="Web Development">Web Dev</option>
              <option value="UI/UX">UI/UX</option>
              <option value="QA">QA</option>
              <option value="BA">BA</option>
              <option value="SM">SM</option>
            </select>
            {errors?.departmentName && (
              <p className="error-message">{errors.departmentName}</p>
            )}

            <input
              name="dateOfJoining"
              ref={inputRefs.joinDate}
              type={calendarState.joinDate.isOpen ? "date" : "text"}
              placeholder={`Date of Joining${!employeeData ? "*" : ""}`}
              min={minJoinDate}
              max={maxJoinDate}
              required={!employeeData}
              defaultValue={employeeData?.dateOfJoining.split("T")[0]}
              onFocus={() => handleFocus("joinDate")}
              onBlur={() => handleBlur("joinDate")}
              // onMouseEnter={() => handleHover("joinDate", true)}
              // onMouseLeave={() => handleHover("joinDate", false)}
              className={`input-field date-field ${
                errors?.dateOfJoining ? "error" : ""
              }`}
            />
            {errors?.dateOfJoining && (
              <p className="error-message">{errors.dateOfJoining}</p>
            )}
          </div>
          {/* CountryStateCity Component  */}
          <div className=" w-full">
            <CountryStateCitySelect
              country={country}
              setCountry={setCountry}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              state={state}
              setState={setState}
              stateCode={stateCode}
              setStateCode={setStateCode}
              city={city}
              setCity={setCity}
              hasFetched={hasFetched}
              sethasFetched={setHasFetched}
              employeeData={employeeData}
            />
          </div>

          <div className="input-group gender-selection">
            <h4 className="section-subtitle bold">
              Please select your gender identity:
            </h4>
            <label>
              <input
                type="radio"
                name="gender"
                value="MALE"
                defaultChecked={employeeData?.gender === "MALE"}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                defaultChecked={employeeData?.gender === "FEMALE"}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="OTHER"
                defaultChecked={employeeData?.gender === "OTHER"}
              />{" "}
              Other
            </label>
          </div>

          {!employeeData && (
            <section>
              <h3 className="section-title">Terms and Mailing</h3>
              <div className="input-group terms">
                <label>
                  <input type="checkbox" required /> I accept the{" "}
                  <a href="#">Privacy Policy</a> for Zummit Infolabs
                </label>
                <label>
                  <input type="checkbox" required /> I will abide by the rules
                  and regulations of the company
                </label>
              </div>
            </section>
          )}

          <div className="submit-button-container">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
