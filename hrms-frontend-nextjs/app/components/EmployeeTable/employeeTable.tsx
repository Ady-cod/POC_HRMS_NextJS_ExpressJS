import React,{useState,useEffect} from 'react'
import DataTable from 'react-data-table-component';
import ModalForm from '../AddButtons/ModalForm';
import { getAllEmployees , deleteEmployee} from '@/actions/employee';


const EmployeeTable = () => {
  const [employee,setEmployee]= useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);

  const handleEdit = (row : any) => {
    //console.log(row);
    setEmployee(row);
    setIsModalOpen(true);
  } 

  const handleDelete = async (id: string) => {
    console.log(id)
   try {
     const response = await deleteEmployee(id);
     console.log("Delete successful:", response.message);
     // Update the UI on successful deletion
   setEmployees(employees.filter(employee => employee.id !== id));
   } catch (err) {
     if (err instanceof Error) {
       console.error("Error deleting employee:", err.message);
     } else {
       console.error("Error deleting employee:", "An error occurred");
     }
   }
 }

  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getAllEmployees();
      console.log(employees);
      
      setEmployees(employees);
    }
    fetchEmployees();
  }, []);



    // const [employees,setEmployees]= useState([])

    // useEffect(() => {
    //     // Fetch data from the backend
    //     const fetchEmployees = async () => {
    //       try {           
    //         const response = await fetch('http://localhost:5000/api/v1/employee',{
    //           method:'GET'
    //         });
    //         const data = await response.json();
    //     console.log(data)
    //        setEmployees(data);
          
    //        // console.log(users)
    //       } catch (error) {
    //         console.error('Error fetching data:', error);
    //       }
    //     }
    
    //     fetchEmployees();
    //   },[]);

    const handleCloseModal = () => {
      setIsModalOpen(false);
  };
    
  const columns: TableColumn<EmployeeListItem>[] = [
    {
      name: 'SNo.',
      selector: row => row.id,
      cell: (id, row) => row + 1,
      sortable: true
    },
    {
      name: 'Full Name',
      selector: row => row.fullName || 'N/A',
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email || 'N/A',
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.status || 'N/A',
      sortable: true
    },
    {
      name: 'Role',
      selector: row => row.role || 'N/A',
      sortable: true
    },
    {
      name: 'Action',

      sortable: true,
      cell: row => (
        <>
          <button onClick={() => handleEdit(row)} className="bg-green-500 rounded-lg p-2">Edit</button>
          <button onClick={() => handleDelete(row.id)} className="bg-red-500  rounded-lg p-2 ms-2">Delete</button>
        </>
      ),
    }
  ];
    return (
      <>
        <div>
          <DataTable columns={columns} data={employees} />
        </div>
        {
          isModalOpen &&
          <ModalForm isOpen={isModalOpen} onClose={handleCloseModal} data={employee} />
        }
      </>
    );
}

export default EmployeeTable;
