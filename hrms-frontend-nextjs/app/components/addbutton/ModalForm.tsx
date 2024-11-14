// src/components/ModalForm.tsx
"use client";

import React, { useState } from 'react';
import './ModalForm.css';

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void; // Pass formData to the parent
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose,onSubmit }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        employeeName: '',
        phoneNumber: '',
        street: '',
        city: '',
        country: '',
        dateOfBirth: '',
        dateOfJoining: '',
        department: '',
        gender: '',
        privacyPolicy: false,
        rulesAgreement: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        console.log(formData)
    };

    const validateForm = () => {
        let formIsValid = true;
        const newErrors: { [key: string]: string } = {};

        if (!formData.email) {
            formIsValid = false;
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formIsValid = false;
            newErrors.email = "Email is invalid.";
        }

        if (!formData.password) {
            formIsValid = false;
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            formIsValid = false;
            newErrors.password = "Password must be at least 6 characters.";
        }

        if (formData.confirmPassword !== formData.password) {
            formIsValid = false;
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (!formData.employeeName) newErrors.employeeName = "Employee name is required.";
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.country) newErrors.country = "Country is required.";
        if (!formData.privacyPolicy) newErrors.privacyPolicy = "You must accept the Privacy Policy.";
        if (!formData.rulesAgreement) newErrors.rulesAgreement = "You must agree to the company rules.";

        setErrors(newErrors);
        return formIsValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData)
             onClose();
              setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                employeeName: '',
                phoneNumber: '',
                street: '',
                city: '',
                country: '',
                dateOfBirth: '',
                dateOfJoining: '',
                department: '',
                gender: '',
                privacyPolicy: false,
                rulesAgreement: false,
            });
            console.log(formData)
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                
                <h3 className="section-title">Account Details</h3>
                <form className="modal-form" onClick={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email*" 
                            required 
                            className="input-field"
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                        {errors.email && <span className="error">{errors.email}</span>}

                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password*" 
                            required 
                            className="input-field" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                        {errors.password && <span className="error">{errors.password}</span>}

                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password*" 
                            required 
                            className="input-field" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>
                    
                    <h3 className="section-title">Personal Information</h3>
                    <div className="input-group">
                        <input 
                            type="text" 
                            name="employeeName" 
                            placeholder="Employee Name*" 
                            required 
                            className="input-field" 
                            value={formData.employeeName} 
                            onChange={handleChange} 
                        />
                        {errors.employeeName && <span className="error">{errors.employeeName}</span>}

                        <input 
                            type="text" 
                            name="phoneNumber" 
                            placeholder="Phone Number" 
                            className="input-field" 
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="input-group">
                        <input 
                            type="text" 
                            name="street" 
                            placeholder="Street" 
                            className="input-field" 
                            value={formData.street} 
                            onChange={handleChange} 
                        />

                        <input 
                            type="date" 
                            name="dateOfBirth" 
                            className="input-field date-field" 
                            placeholder="Date of Birth" 
                            value={formData.dateOfBirth} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="input-group">
                        <input 
                            type="text" 
                            name="city" 
                            placeholder="City*" 
                            required 
                            className="input-field" 
                            value={formData.city} 
                            onChange={handleChange} 
                        />
                        {errors.city && <span className="error">{errors.city}</span>}

                        <select 
                            name="department" 
                            className="input-field" 
                            value={formData.department} 
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            <option value="HR">HR</option>
                            <option value="Web Development">Web Development</option>
                            <option value="UI/UX">UI/UX</option>
                            <option value="QA">QA</option>
                            <option value="BA">BA</option>
                            <option value="SM">SM</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <input 
                            type="text" 
                            name="country" 
                            placeholder="Country*" 
                            required 
                            className="input-field" 
                            value={formData.country} 
                            onChange={handleChange} 
                        />
                        {errors.country && <span className="error">{errors.country}</span>}

                        <input 
                            type="date" 
                            name="dateOfJoining" 
                            className="input-field date-field" 
                            placeholder="Date of Joining" 
                            value={formData.dateOfJoining} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="input-group gender-selection">
                        <h4 className="section-subtitle bold">Please select your gender identity:</h4>
                        <label>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="man" 
                                checked={formData.gender === 'man'} 
                                onChange={handleChange} 
                            /> Man
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="woman" 
                                checked={formData.gender === 'woman'} 
                                onChange={handleChange} 
                            /> Woman
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="others" 
                                checked={formData.gender === 'others'} 
                                onChange={handleChange} 
                            /> Others
                        </label>
                    </div>

                    <h3 className="section-title">Terms and Mailing</h3>
                    <div className="input-group terms">
                        <label>
                            <input 
                                type="checkbox" 
                                name="privacyPolicy" 
                                required 
                                checked={formData.privacyPolicy} 
                                onChange={handleChange} 
                            /> I accept the <a href="#">Privacy Policy</a>
                        </label>
                        {errors.privacyPolicy && <span className="error">{errors.privacyPolicy}</span>}

                        <label>
                            <input 
                                type="checkbox" 
                                name="rulesAgreement" 
                                required 
                                checked={formData.rulesAgreement} 
                                onChange={handleChange} 
                            /> I agree to the company rules
                        </label>
                        {errors.rulesAgreement && <span className="error">{errors.rulesAgreement}</span>}
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
