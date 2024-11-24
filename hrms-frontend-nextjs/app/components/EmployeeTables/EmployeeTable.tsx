import React, { useState, useEffect } from 'react'
import DataTable, {TableColumn} from 'react-data-table-component';
import { getAllEmployees, deleteEmployee } from '@/actions/employee';
import { EmployeeListItem } from '@/types/types';


const EmployeeTable = () => {
  
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getAllEmployees();
      setEmployees(employees);
    }
    fetchEmployees();
  }, []);

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
  const handleEdit = () => {

  }

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
          <button onClick={handleEdit} className="bg-green-500 rounded-lg p-2">Edit</button>
          <button onClick={() => handleDelete(row.id)} className="bg-red-500  rounded-lg p-2 ms-2">Delete</button>
        </>
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
