"use client";

import "./ModalForm.css";
import { useState, useEffect, useRef } from "react";
import { createEmployee } from "@/actions/employee";
import { createEmployeeSchema } from "@/schemas/employeeSchema";
import { formatZodErrors } from "@/utils/formatZodErrors";
import { ZodError } from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calendarState, setCalendarState] = useState<CalendarState>({
    birthDate: { isOpen: false, isInteracting: false },
    joinDate: { isOpen: false, isInteracting: false },
  });
  const inputRefs: InputRefs = {
    birthDate: useRef(null),
    joinDate: useRef(null),
  };

  useEffect(() => {
    const handleCalendarInteraction = (event: MouseEvent) => {
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
          }, 300);
        }
      });
    };

    document.addEventListener("mousedown", handleCalendarInteraction);

    return () => {
      document.removeEventListener("mousedown", handleCalendarInteraction);
    };
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
  const handleHover = (key: InputRefKey, isOpen: boolean) => {
    setCalendarState((prevState) => ({
      ...prevState,
      [key]: { ...prevState[key], isOpen },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const employeeData = Object.fromEntries(formData.entries());
    const confirmPassword = confirmPasswordRef.current?.value;

    if (employeeData.password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match!" });
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setErrors({});
      const validatedData = createEmployeeSchema.parse(employeeData);
      await createEmployee(validatedData);
      toast.success("Employee created successfully!");
      //refreshEmployees();
      form.reset();
      
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodErrors(error);
        setErrors(formattedErrors);
        error.errors.forEach((err) => toast.error(err.message));
      } else if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred. Please try again later.");
      }
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
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
              required
              onFocus={() => handleFocus("birthDate")}
              onBlur={() => handleBlur("birthDate")}
              onMouseEnter={() => handleHover("birthDate", true)}
              onMouseLeave={() => handleHover("birthDate", false)}
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
        <ToastContainer />
      </div>
    </div>
  );
};

export default ModalForm;