// src/components/ModalForm.tsx
"use client";

import React from 'react';
import './ModalForm.css';

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                
                <h3 className="section-title">Account Details</h3>
                <form className="modal-form">
                    <div className="input-group">
                        <input type="email" placeholder="Email*" required className="input-field" />
                        <input type="password" placeholder="Password*" required className="input-field" />
                        <input type="password" placeholder="Confirm Password*" required className="confirm-password-field" />
                    </div>
                    
                    <h3 className="section-title">Personal Information</h3>
                    <div className="input-group">
                        <input type="text" placeholder="Employee Name*" required className="input-field" />
                        <input type="text" placeholder="Phone Number" className="input-field" />
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="Street" className="input-field" />
                        <input type="date" className="input-field date-field" />
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="City*" required className="input-field" />
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
                        <input type="text" placeholder="Country*" required className="input-field" />
                        <input type="date" placeholder="date of birth" className="input-field date-field" />
                    </div>
                    
                    <div className="input-group gender-selection">
                        <h4 className="section-subtitle bold">Please select your gender identity:</h4>
                        <label><input type="radio" name="gender" value="man" /> Man</label>
                        <label><input type="radio" name="gender" value="woman" /> Woman</label>
                        <label><input type="radio" name="gender" value="others" /> Others</label>
                    </div>

                    <h3 className="section-title">Terms and Mailing</h3>
                    <div className="input-group terms">
                        <label><input type="checkbox" required /> I accept the <a href="#">Privacy Policy</a> for Zummit Infolabs</label>
                        <label><input type="checkbox" required /> I will abide by the rules and regulations of the company</label>
                    </div>
                    
                    <div className="submit-button-container">
                        <button type="submit" className="submit-button">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalForm;
