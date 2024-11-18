import React,{useState,useEffect} from 'react'
import DataTable from 'react-data-table-component';


const EmployeeTable = () => {
    const [employee,setEmployee]= useState([])

    useEffect(() => {
        // Fetch data from the backend
        const fetchEmployees = async () => {
          try {           
            const response = await fetch('http://localhost:5000/api/v1/employee',{
              method:'GET'
            });
            const data = await response.json();
        console.log(data)
           setEmployee(data);
          
           // console.log(users)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
    
        fetchEmployees();
      },[]);
    
    const columns = [
        {
            name: 'SNo.',
            selector: row => row.id,
            cell: (id, row) => row + 1,
            sortable: true
        },
        {
            name: 'First Name',
            selector: row => row.firstName,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true
        },
        {
            name:'Action',
            
            sortable:true,
            cell: row => (
               <div>
                <button onClick={()=>handleEdit(row)} className="bg-green-700 rounded-lg p-2">Edit</button>
                <button onClick={()=>{handleDelete(row)}} className="bg-red-700  rounded-lg p-2 ms-2">Delete</button>
              </div>
            ),
          }
    ];
    return (
        <div>
         <DataTable columns={columns} data ={employee}/>
        </div>
    )
}

export default EmployeeTable;
