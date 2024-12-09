// src/components/ModalForm.tsx
"use client";

import "./ModalForm.css";
import { useState, useEffect, useRef } from "react";
import { createEmployee } from "@/actions/employee";
import { createEmployeeSchema } from "@/schemas/employeeSchema";
import { formatZodErrors } from "@/utils/formatZodErrors";
import { ZodError } from "zod";
import { showToast } from "@/utils/toastHelper";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  refreshEmployees: () => void;
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
}) => {
  // Refs for password check input field
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({}); // State to store form validation errors

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
    const employeeData = Object.fromEntries(formData.entries());

    // Access the Confirm Password value using the ref
    const confirmPassword = confirmPasswordRef.current?.value;

    // Validate the password and confirm password match
    if (employeeData.password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match!" });

      // Display a toast message with the error
      showToast("error", "Password check fail:", ["Passwords do not match!"]);

      return;
    }

    try {
      // Validate the form data
      const validatedData = createEmployeeSchema.parse(employeeData);

      // Send the data to the server action
      const response = await createEmployee(validatedData);

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

      setErrors({}); // Reset errors on successful submission

      // Display a success toast message
      showToast("success", "Success!", ["Employee created successfully!"]);

      // // Re-fetch employees in EmployeeTable, to show the new employee
      refreshEmployees();

      // Reset the form after successful submission
      form.reset();
    } catch (error) {
      // Check frontend validation errors
      if (error instanceof ZodError) {
        // Format Zod error messages to be displayed inline
        const formattedErrors = formatZodErrors(error);
        setErrors(formattedErrors);

        // Display a toast message with the Zod error details
        const errorMessages = error.issues.map((issue) => issue.message);
        showToast("error", "Validation Error(s):", errorMessages);
      } else if (error instanceof Error) {
        setErrors({}); // Reset errors on unexpected error (which is not a validation error)

        // General JavaScript Error display in a toast
        const errorMessages = error.message.split("\n");
        showToast("error", "Error in creating employee:", errorMessages);

        // console.error("Error in creating employee:", error);
      } else {
        setErrors({}); // Reset errors on error of unknown type

        // Display unexpected errors that don't match known types
        showToast("error", "Error in creating employee:", [
          "An unknown error occurred. Please check your connection or try again later.",
        ]);

        // console.error(
        //   "Unexpected non-standard error in creating employee:",
        //   error
        // );
      }
    }
  };

  const handleClose = () => {
    setErrors({}); // Reset errors when the modal is closed
    onClose();
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

        <h3 className="section-title">Account Details</h3>
        <form onSubmit={handleSubmit} method="post" className="modal-form">
          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder="Email*"
              required
              className={`input-field ${errors.email ? "error" : ""}`}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
            <input
              name="password"
              type="password"
              placeholder="Password (min 6 characters)*"
              required
              className={`input-field ${errors.password ? "error" : ""}`}
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
            <input
              ref={confirmPasswordRef}
              type="password"
              placeholder="Confirm Password*"
              required
              className={`confirm-password-field ${
                errors.confirmPassword ? "error" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          <h3 className="section-title">Personal Information</h3>
          <div className="input-group">
            <input
              name="fullName"
              type="text"
              placeholder="Employee Name*"
              required
              className={`input-field ${errors.fullName ? "error" : ""}`}
            />
            {errors.fullName && (
              <p className="error-message">{errors.fullName}</p>
            )}
            <input
              name="phoneNumber"
              type="text"
              placeholder="Phone number* (e.g., +40715632783)"
              required
              className={`input-field ${errors.phoneNumber ? "error" : ""}`}
            />
            {errors.phoneNumber && (
              <p className="error-message">{errors.phoneNumber}</p>
            )}
          </div>
          <div className="input-group">
            <input
              name="streetAddress"
              type="text"
              placeholder="Street"
              className={`input-field ${errors.streetAddress ? "error" : ""}`}
            />
            {errors.streetAddress && (
              <p className="error-message">{errors.streetAddress}</p>
            )}
            <input
              name="birthDate"
              ref={inputRefs.birthDate}
              type={calendarState.birthDate.isOpen ? "date" : "text"}
              placeholder="Birth Date*"
              min={minBirthDate}
              max={maxBirthDate}
              required
              onFocus={() => handleFocus("birthDate")}
              onBlur={() => handleBlur("birthDate")}
              // onMouseEnter={() => handleHover("birthDate", true)}
              // onMouseLeave={() => handleHover("birthDate", false)}
              className={`input-field date-field ${
                errors.birthDate ? "error" : ""
              }`}
            />
            {errors.birthDate && (
              <p className="error-message">{errors.birthDate}</p>
            )}
          </div>
          <div className="input-group">
            <input
              name="city"
              type="text"
              placeholder="City*"
              required
              className={`input-field ${errors.city ? "error" : ""}`}
            />
            {errors.city && <p className="error-message">{errors.city}</p>}

            <select
              name="departmentName"
              required
              className={`input-field ${errors.departmentName ? "error" : ""}`}
            >
              <option value="">Select Department*</option>
              <option value="HR">HR</option>
              <option value="Web Development">Web Dev</option>
              <option value="UI/UX">UI/UX</option>
              <option value="QA">QA</option>
              <option value="BA">BA</option>
              <option value="SM">SM</option>
            </select>
            {errors.departmentName && (
              <p className="error-message">{errors.departmentName}</p>
            )}
          </div>
          <div className="input-group">
            <input
              name="country"
              type="text"
              placeholder="Country*"
              required
              className={`input-field ${errors.country ? "error" : ""}`}
            />
            {errors.country && (
              <p className="error-message">{errors.country}</p>
            )}
            <input
              name="dateOfJoining"
              ref={inputRefs.joinDate}
              type={calendarState.joinDate.isOpen ? "date" : "text"}
              placeholder="Date of Joining*"
              min={minJoinDate}
              max={maxJoinDate}
              required
              onFocus={() => handleFocus("joinDate")}
              onBlur={() => handleBlur("joinDate")}
              // onMouseEnter={() => handleHover("joinDate", true)}
              // onMouseLeave={() => handleHover("joinDate", false)}
              className={`input-field date-field ${
                errors.dateOfJoining ? "error" : ""
              }`}
            />
            {errors.dateOfJoining && (
              <p className="error-message">{errors.dateOfJoining}</p>
            )}
          </div>

          <div className="input-group gender-selection">
            <h4 className="section-subtitle bold">
              Please select your gender identity:
            </h4>
            <label>
              <input type="radio" name="gender" value="MALE" /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="FEMALE" /> Female
            </label>
            <label>
              <input type="radio" name="gender" value="OTHER" /> Other
            </label>
          </div>

          <h3 className="section-title">Terms and Mailing</h3>
          <div className="input-group terms">
            <label>
              <input type="checkbox" required /> I accept the{" "}
              <a href="#">Privacy Policy</a> for Zummit Infolabs
            </label>
            <label>
              <input type="checkbox" required /> I will abide by the rules and
              regulations of the company
            </label>
          </div>

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
