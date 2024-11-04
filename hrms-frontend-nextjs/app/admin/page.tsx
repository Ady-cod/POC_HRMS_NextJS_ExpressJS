// src/pages/page.tsx
"use client";
import React from 'react';
import NavBar from '../components/navBar/navBar';
import AddNewDataButton from '../components/addbutton/AddNewDataButton';

const Page: React.FC = () => {
    const handleAddNewDataClick = () => {
        console.log("Add New Data button clicked");
        // Implement any functionality you need when this button is clicked,
        // like opening a modal or redirecting to a new page.
    };

    return (
        <div>
            <NavBar />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                <h2>Lists</h2>
                <AddNewDataButton onClick={handleAddNewDataClick} />
            </div>
            {/* Other content like your table goes here */}
        </div>
    );
};

export default Page;
