import React,{useState,useEffect} from 'react'
import DataTable from 'react-data-table-component';
import { getAllEmployees } from '@/actions/employee';


const EmployeeTable = () => {
  
  // const employees = await getAllEmployees();

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getAllEmployees();
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
    
    const columns = [
        {
            name: 'SNo.',
            selector: row => row.id,
            cell: (id, row) => row + 1,
            sortable: true
        },
        {
            name: 'First Name',
            selector: row => row.firstName || 'N/A',
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
            name:'Action',
            
            sortable:true,
            cell: row => (
               <div>
                <button onClick={()=>handleEdit(row)} className="bg-green-500 rounded-lg p-2">Edit</button>
                <button onClick={()=>{handleDelete(row)}} className="bg-red-500  rounded-lg p-2 ms-2">Delete</button>
              </div>
            ),
          }
    ];
    return (
      <div>
        <DataTable columns={columns} data={employees} />
      </div>
    );
}

export default EmployeeTable;
