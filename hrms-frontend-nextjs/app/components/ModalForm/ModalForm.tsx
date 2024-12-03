// src/components/ModalForm.tsx
"use client";

import "./ModalForm.css";
import { useState, useEffect, useRef } from "react";
import { createEmployee } from "@/actions/employee";
import { createEmployeeSchema } from "@/schemas/employeeSchema";
import { formatZodErrors } from "@/utils/formatZodErrors";
import { ZodError } from "zod";
import axios from "axios"

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  refreshEmployees?: () => void;
  onSubmit?: (data : any) => void;
  data?: {};
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
  data
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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    birthDate: "",
    city: "",
    department: {id : 0 , name : ""},
    departmentName: "",
    country: "",
    dateOfJoining: "",
    gender: "",
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setFormData((prev)=>{
        return {...prev , ...data , password:""}
      }
      );
    } else {
      setFormData({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        streetAddress: "",
        birthDate: "",
        city: "",
        department: {id : 0 , name : ""},
        country: "",
        departmentName: "",
        dateOfJoining: "",
        gender: "",
      });
    }
    // setFormData(data);
  }, [data]);

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

  const handleHover = (key: InputRefKey, isOpen: boolean) => {
    setCalendarState((prevState) => ({
      ...prevState,
      [key]: { ...prevState[key], isOpen },
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    
  };

  const handleEdit = async(e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    // console.log("IN THE HANDLE EDIT!! :)");
    try{
      console.log(formData);
      const response = await axios.
                        post(`http://localhost:5000/api/v1/employee/update/${formData.id}` , {
                          ...formData
                        }).
                        then(function(response){
                          console.log(response);
                          //router.push("/admin/EmployeePage/")
                        }).catch(function(error){
                          console.log(error);
                        });
                        
    }catch(e){
      console.log(e);
    }
    //console.log(e.currentTarget)
  }

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
      alert("Passwords do not match!");
      return;
    }

    try {
      // Validate the form data
      const validatedData = createEmployeeSchema.parse(employeeData);

      // Send the data to the server action
      const response = await createEmployee(validatedData);

      if (!response.success) {
        // Check if the server returned validation errors
        if (response.errors) {
          // Format Zod error messages for inline display, each error message will be displayed next to the related field
          const formattedErrors = formatZodErrors(response.errors);
          setErrors(formattedErrors);

          // Display a combined general alert error message for all validation errors
          const errorValidationMessage = response.errors
            .map((err) => err.message)
            .join("\n\n");
          alert(`${response.message}:\n\n${errorValidationMessage}`);
        } else {
          setErrors({}); // Reset errors on non-validation errors
          // Display a general alert error message for non-validation errors
          alert(`Error in creating employee:\n\n${response.message}`);
        }
        return;
      }

      setErrors({}); // Reset errors on successful submission

      alert("Employee created successfully!");

      // // Re-fetch employees in EmployeeTable, to show the new employee
      if(refreshEmployees){
        refreshEmployees();
      }

      // Reset the form after successful submission
      form.reset();
    } catch (error) {
      // Check frontend validation errors
      if (error instanceof ZodError) {
        // Format Zod error messages to be displayed inline
        const formattedErrors = formatZodErrors(error.errors);
        setErrors(formattedErrors);

        // Display a combined general alert error message for all validation errors
        const errorValidationMessage = error.errors
          .map((err) => err.message)
          .join("\n\n");
        alert(`Validation Error(s):\n\n${errorValidationMessage}`);
      } else if (error instanceof Error) {
        setErrors({}); // Reset errors on unexpected error (which is not a validation error)

        // General JavaScript Error handling
        alert(`Error in creating employee:\n\n${error.message}`);
        // console.error("Error in creating employee:", error);
      } else {
        setErrors({}); // Reset errors on error of unknown type
        // Catch-all for unexpected errors that don't match known types
        alert(
          "An unknown error occurred. Please check your connection or try again later."
        );
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

  // Ensure all hooks run consistently before conditionally returning null.
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={handleClose}>
          ×
        </button>

        <h3 className="section-title">Account Details</h3>
        <form onSubmit={(e) => {if(data) { handleEdit(e) }else{ handleSubmit(e)}}} method="post" className="modal-form">
          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`input-field ${errors.email ? "error" : ""}`}
            />
            {!data && <>{errors.email && <p className="error-message">{errors.email}</p>}
            <input
              name="password"
              type="password"
              placeholder="Password*"
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
            )} </>}

            { data && <><input
              name="password"
              type="password"
              onChange={handleInputChange}
              value={formData.password}
              placeholder="New Password"
              className={`input-field `}
            />
            {/* <input

              type="password"
              placeholder="Confirm Password"

              className={`confirm-password-field `}
            /> </>} */}</>}
          </div>

          <h3 className="section-title">Personal Information</h3>
          <div className="input-group">
            <input
              name="fullName"
              type="text"
              placeholder="Employee Name*"
              value={formData.fullName}
              onChange={handleInputChange}
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
              value={formData.phoneNumber}
              onChange={handleInputChange}
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
              value={formData.streetAddress}
              onChange={handleInputChange}
              className={`input-field ${errors.streetAddress ? "error" : ""}`}
            />
            {errors.streetAddress && (
              <p className="error-message">{errors.streetAddress}</p>
            )}
            <input
              name="birthDate"
              ref={inputRefs.birthDate}
              type={calendarState.birthDate.isOpen ? "date" : "text"}
              value={formData.birthDate}
              onChange={handleInputChange}
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
              value={formData.city}
              onChange={handleInputChange}
              required
              className={`input-field ${errors.city ? "error" : ""}`}
            />
            {errors.city && <p className="error-message">{errors.city}</p>}

            <select
              name="departmentName"
              onChange={handleInputChange}
              required
              className={`input-field ${errors.departmentName ? "error" : ""}`}
            >
              <option value="">Select Department</option>
              <option value="HR" selected={formData.departmentName === "HR" ? true : false}>HR</option>
              <option selected={formData.departmentName === "Web Dev" || formData.departmentName === "Web Development" ? true : false} value="Web Development">Web Dev</option>
              <option selected={formData.departmentName === "UI/UX" ? true : false} value="UI/UX">UI/UX</option>
              <option selected={formData.departmentName === "QA" ? true : false} value="QA">QA</option>
              <option selected={formData.departmentName === "BA" ? true : false} value="BA">BA</option>
              <option selected={formData.departmentName === "SM" ? true : false} value="SM">SM</option>
            </select>
            {errors.departmentName && (
              <p className="error-message">{errors.departmentName}</p>
            )}
          </div>
          <div className="input-group">
            <input
              name="country"
              type="text"
              value={formData.country}
              onChange={handleInputChange}
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
              value={formData.dateOfJoining}
              onChange={handleInputChange}
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
              <input type="radio" name="gender" onChange={handleInputChange} value="MALE" defaultChecked={data?.gender === "MALE" }/> Male
            </label>
            <label>
              <input type="radio" name="gender" onChange={handleInputChange} value="FEMALE" defaultChecked={data?.gender === "FEMALE" } /> Female
            </label>
            <label>
              <input type="radio" name="gender" onChange={handleInputChange} value="OTHER" defaultChecked={data?.gender === "OTHER" } /> Other
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
