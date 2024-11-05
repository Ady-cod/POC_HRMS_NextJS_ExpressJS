"use client"
import React,{useState} from 'react'
import NavBar from '../components/navBar/navBar'
import SideBar from '../components/sidebar/sidebar'
import Footer from '../components/footer/footer'
import AddNewDataButton from '../components/addbutton/AddNewDataButton';
import ModalForm from '../components/addbutton/ModalForm';

const Page=()=>{
    const [isSideBarOpen,setIsSideBarOpen] = useState<boolean>(true)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleSideBar=()=>{
setIsSideBarOpen(!isSideBarOpen)
    }
     // Open and close handlers for the modal
     const handleAddNewDataClick = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    return (
        <div>
            <NavBar isSideBarOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
            <SideBar isOpen={isSideBarOpen} />
            {/* Header section with Add New Data button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                <h2>Lists</h2>
                <AddNewDataButton onClick={handleAddNewDataClick} />
            </div>

            {/* Modal Form for adding new data */}
            <ModalForm isOpen={isModalOpen} onClose={handleCloseModal} />
            
            {/* Other content like your table goes here */}
        

            <Footer/>
        </div>
    );
};

export default Page;