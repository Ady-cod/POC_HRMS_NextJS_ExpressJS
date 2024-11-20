// src/components/ModalForm.tsx
"use client";

import "./ModalForm.css";
import { useState, useEffect, useRef } from "react";

interface ModalFormProps {
isOpen: boolean;
onClose: () => void;
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

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose }) => {

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

  const handleHover = (key: InputRefKey, isOpen: boolean) => {
    setCalendarState((prevState) => ({
      ...prevState,
      [key]: { ...prevState[key], isOpen },
    }));
  };
  
  // Ensure all hooks run consistently before conditionally returning null.
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h3 className="section-title">Account Details</h3>
        <form className="modal-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email*"
              required
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password*"
              required
              className="input-field"
            />
            <input
              type="password"
              placeholder="Confirm Password*"
              required
              className="confirm-password-field"
            />
          </div>

          <h3 className="section-title">Personal Information</h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="Employee Name*"
              required
              className="input-field"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="input-field"
            />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Street" className="input-field" />
            <input
              ref={inputRefs.birthDate}
              type={calendarState.birthDate.isOpen ? "date" : "text"}
              placeholder="Birth Date"
              className="input-field date-field"
              onFocus={() => handleFocus("birthDate")}
              onBlur={() => handleBlur("birthDate")}
              onMouseEnter={() => handleHover("birthDate", true)}
              onMouseLeave={() => handleHover("birthDate", false)}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="City*"
              required
              className="input-field"
            />
            <select className="input-field">
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="Web Development">Web Dev</option>
              <option value="UI/UX">UI/UX</option>
              <option value="QA">QA</option>
              <option value="BA">BA</option>
              <option value="SM">SM</option>
            </select>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Country*"
              required
              className="input-field"
            />
            <input
              ref={inputRefs.joinDate}
              type={calendarState.joinDate.isOpen ? "date" : "text"}
              placeholder="Date of Joining"
              className="input-field date-field"
              onFocus={() => handleFocus("joinDate")}
              onBlur={() => handleBlur("joinDate")}
              // onMouseEnter={() => handleHover("joinDate", true)}
              // onMouseLeave={() => handleHover("joinDate", false)}
            />
          </div>

          <div className="input-group gender-selection">
            <h4 className="section-subtitle bold">
              Please select your gender identity:
            </h4>
            <label>
              <input type="radio" name="gender" value="man" /> Man
            </label>
            <label>
              <input type="radio" name="gender" value="woman" /> Woman
            </label>
            <label>
              <input type="radio" name="gender" value="others" /> Others
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
