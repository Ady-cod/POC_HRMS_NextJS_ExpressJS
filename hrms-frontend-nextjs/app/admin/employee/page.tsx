"use client"
import React,{useState} from 'react'
import AddNewDataButton from '../../components/addbutton/AddNewDataButton';
import ModalForm from '../../components/addbutton/ModalForm';
import EmployeeTable from '../../components/employeeTable/employeeTable'

const Page=()=>{
    const [isSideBarOpen,setIsSideBarOpen] = useState<boolean>(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submittedData,setsubmittedData] = useState(null)

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

    const handleFormData=(data:any)=>{
    setsubmittedData(data)
    }


    return (
        <div>
            {/* Header section with Add New Data button */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px'}}>
                <AddNewDataButton onClick={handleAddNewDataClick} />
                </div>

            {/* Modal Form for adding new data */}
            <ModalForm isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormData} />
            
            {/* Other content like your table goes here */}
            
                <EmployeeTable />
            
              
            
        

        </div>
    );
};

export default Page;