// src/components/ModalForm.tsx
"use client";

import React, { useState } from 'react';
import './ModalForm.css';

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [department, setDepartment] = useState('');
    const [gender, setGender] = useState('');
    const [privacyPolicy, setPrivacyPolicy] = useState(false);
    const [rulesAgreement, setRulesAgreement] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    if (!isOpen) return null;

    const validateForm = () => {
        let formIsValid = true;
        const newErrors: { [key: string]: string } = {};

        // Email validation
        if (!email) {
            formIsValid = false;
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formIsValid = false;
            newErrors.email = "Email is invalid.";
        }

        // Password validation
        if (!password) {
            formIsValid = false;
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            formIsValid = false;
            newErrors.password = "Password must be at least 6 characters.";
        }

        // Confirm Password validation
        if (confirmPassword !== password) {
            formIsValid = false;
            newErrors.confirmPassword = "Passwords do not match.";
        }

        // Required fields validation
        if (!employeeName) newErrors.employeeName = "Employee name is required.";
        if (!city) newErrors.city = "City is required.";
        if (!country) newErrors.country = "Country is required.";
        if (!privacyPolicy) newErrors.privacyPolicy = "You must accept the Privacy Policy.";
        if (!rulesAgreement) newErrors.rulesAgreement = "You must agree to the company rules.";

        setErrors(newErrors);
        return formIsValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const formData = {
                email,
                password,
                employeeName,
                phoneNumber,
                street,
                city,
                country,
                dateOfBirth,
                department,
                gender,
                privacyPolicy,
                rulesAgreement,
            };
            console.log("Form Data:", formData);
            // Add API call or additional form submission logic here

            // Reset form if needed
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setEmployeeName('');
            setPhoneNumber('');
            setStreet('');
            setCity('');
            setCountry('');
            setDateOfBirth('');
            setDepartment('');
            setGender('');
            setPrivacyPolicy(false);
            setRulesAgreement(false);
            setErrors({});
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                
                <h3 className="section-title">Account Details</h3>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" placeholder="Email*" required className="input-field" 
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && <span className="error">{errors.email}</span>}
                        
                        <input type="password" placeholder="Password*" required className="input-field" 
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                        {errors.password && <span className="error">{errors.password}</span>}
                        
                        <input type="password" placeholder="Confirm Password*" required className="confirm-password-field" 
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>
                    
                    <h3 className="section-title">Personal Information</h3>
                    <div className="input-group">
                        <input type="text" placeholder="Employee Name*" required className="input-field" 
                            value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                        {errors.employeeName && <span className="error">{errors.employeeName}</span>}

                        <input type="text" placeholder="Phone Number" className="input-field" 
                            value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="Street" className="input-field" 
                            value={street} onChange={(e) => setStreet(e.target.value)} />
                        
                        <input type="date" className="input-field date-field" placeholder="Date of Birth"
                            value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="City*" required className="input-field" 
                            value={city} onChange={(e) => setCity(e.target.value)} />
                        {errors.city && <span className="error">{errors.city}</span>}

                        <select className="input-field" value={department} onChange={(e) => setDepartment(e.target.value)}>
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
                        <input type="text" placeholder="Country*" required className="input-field" 
                            value={country} onChange={(e) => setCountry(e.target.value)} />
                        {errors.country && <span className="error">{errors.country}</span>}
                        <input type="date" className="input-field date-field" placeholder="Date of joining"
                            value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    </div>
                    
            
                    <div className="input-group gender-selection">
                        <h4 className="section-subtitle bold">Please select your gender identity:</h4>
                        <label><input type="radio" name="gender" value="man" checked={gender === 'man'}
                            onChange={(e) => setGender(e.target.value)} /> Man</label>
                        <label><input type="radio" name="gender" value="woman" checked={gender === 'woman'}
                            onChange={(e) => setGender(e.target.value)} /> Woman</label>
                        <label><input type="radio" name="gender" value="others" checked={gender === 'others'}
                            onChange={(e) => setGender(e.target.value)} /> Others</label>
                    </div>

                    <h3 className="section-title">Terms and Mailing</h3>
                    <div className="input-group terms">
                        <label>
                            <input type="checkbox" required checked={privacyPolicy} 
                                onChange={(e) => setPrivacyPolicy(e.target.checked)} /> I accept the <a href="#">Privacy Policy</a>
                        </label>
                        {errors.privacyPolicy && <span className="error">{errors.privacyPolicy}</span>}

                        <label>
                            <input type="checkbox" required checked={rulesAgreement} 
                                onChange={(e) => setRulesAgreement(e.target.checked)} /> I agree to the company rules
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
