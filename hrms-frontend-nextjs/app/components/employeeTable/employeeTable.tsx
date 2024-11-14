// // // src/components/TargetComponent.tsx
// // import React from 'react';

// // interface TargetComponentProps {
// //     data: {
// //         email: string;
// //         password: string;
// //         confirmPassword: string;
// //         employeeName: string;
// //         phoneNumber: string;
// //         street: string;
// //         city: string;
// //         country: string;
// //         dateOfBirth: string;
// //         dateOfJoining: string;
// //         department: string;
// //         gender: string;
// //         privacyPolicy: boolean;
// //         rulesAgreement: boolean;
// //     };
// // }

// // const TargetComponent: React.FC<TargetComponentProps> = ({ data }) => {
// //     return (
// //         <div>

// //         </div>

// //     );
// // };

// // export default TargetComponent;
// import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
// import React from 'react'
// const rows = [];

// const columns = [];

// export default function EmployeeTable() {
//   return (
//       <>
//     <Table aria-label="Example table with dynamic content">
//       <TableHeader>
//         {columns.map((column) =>
//           <TableColumn key={column.key}>{column.label}</TableColumn>
//         )}
//       </TableHeader>
//       <TableBody>
//         {rows.map((row) =>
//           <TableRow key={row.key}>
//             {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//     <div>
//         ghujkofk
//     </div>
//     </>
//   );
// }

import React,{useState,useEffect} from 'react'
import DataTable from 'react-data-table-component';


const employeeTable = () => {
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

export default employeeTable
