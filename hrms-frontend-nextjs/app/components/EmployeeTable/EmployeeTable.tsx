import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { getAllEmployees, deleteEmployee } from '@/actions/employee';
import { EmployeeListItem } from '@/types/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const employee = employees.find(emp => emp.id === id); // Find employee by ID
    try {
      const response = await deleteEmployee(id);
      console.log('Delete successful:', response.message);
      toast.success(`You deleted ${employee?.fullName || 'an employee'}`, {
        style: { fontSize: '1.2rem' }, // Customize toast style
      });
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error deleting employee:', err.message);
        toast.error('Failed to delete employee', {
          style: { fontSize: '1.2rem' },
        });
      } else {
        console.error('Error deleting employee:', 'An error occurred');
      }
    }
  };

  const handleEdit = () => {
    // Edit logic
  };

  const columns: TableColumn<EmployeeListItem>[] = [
    {
      name: 'SNo.',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Full Name',
      selector: row => row.fullName || 'N/A',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email || 'N/A',
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status || 'N/A',
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => row.role || 'N/A',
      sortable: true,
    },
    {
      name: 'Action',
      sortable: true,
      cell: row => (
        <>
          <button onClick={handleEdit} className="bg-green-500 rounded-lg p-2">
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500 rounded-lg p-2 ms-2"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={employees} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ fontSize: '1.5rem', textAlign: 'center' }}
      />
    </div>
  );
};

export default EmployeeTable;
