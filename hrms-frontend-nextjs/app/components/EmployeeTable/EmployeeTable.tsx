import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { getAllEmployees, deleteEmployee } from "@/actions/employee";
import { EmployeeListItem } from "@/types/types";
import { toast } from "react-toastify";


interface EmployeeTableProps {
  refreshFlag: boolean;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ refreshFlag }) => {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const employees = await getAllEmployees();
      setEmployees(employees);
    }
    fetchEmployees();
   // console.log(employees)
  }, [refreshFlag]);

  const handleDelete = async (id: string) => {
    const employee = employees.find((emp) => emp.id === id); // Find employee by ID
    try {
      const response = await deleteEmployee(id);
      console.log("Delete successful:", response.message);

      // Update the UI on successful deletion
      toast.success(`You deleted ${employee?.fullName || "an employee"}`);

      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error deleting employee:", err.message);

        // display the regular error message
        toast.error(`Failed to delete employee: ${err.message}`);
      } else {
        console.error("Error deleting employee:", "An error occurred");

        // display a generic error message
        toast.error("Failed to delete employee: unknown error appeared");
      }
    }
  };
  const handleEdit = () => {};
  

  const columns: TableColumn<EmployeeListItem>[] = [
    {
      name: "SNo.",
      selector: (row) => row.id,
      cell: (id, row) => row + 1,
      sortable: false,
    },
    {
      name: "Full Name",
      selector: (row) => row.fullName || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      cell: (row) => (
        <div
          className="cursor-pointer flex items-center"
          onClick={async () => {
            if (row.email) {
              try {
                await navigator.clipboard.writeText(row.email);
                toast.success(`Email ${row.email} copied to clipboard!`);
              } catch (error) {
                console.error("Failed to copy email:", error);
                toast.error("Failed to copy email. Please try again.");
              }
            } else {
              toast.error("Email not available!");
            }
          }}
        >
          <AiOutlineMail size={20} className="text-black" />
          <span className="ml-2">Copy</span>
        </div>
      ),
    },
    {
      name: "Phone No",
      cell: (row) => (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => {
            if (row.phoneNumber) {
              navigator.clipboard.writeText(row.phoneNumber);
              toast.success("Phone number copied to clipboard!");
            } else {
              toast.error("Phone number not available!");
            }
          }}
        >
          <AiOutlinePhone size={20} className="text-black"/><span className="ml-2">Copy</span>
        </div>
      ),
    },
    {
      name: "Date Of Joining(DD/MM/YYYY)",
      selector: (row) => row.dateOfJoining ?  format(new Date(row.dateOfJoining), "dd/MM/yyyy") : "N/A",
    },
    {
      name: "Status",
      selector: (row) => row.status || "N/A",
    },
    {
      name: "Role",
      selector: (row) => row.role || "N/A",
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button onClick={handleEdit} className="bg-green-500 rounded-lg p-2">
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500  rounded-lg p-2 ms-2"
          >
            Delete
          </button>
        </>
      ),
    },
  ];
  return (
    <div>
<<<<<<< HEAD
      <DataTable columns={columns} data={employees}  pagination/>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ fontSize: "1.2rem", textAlign: "center", width: "500px" }}
      />
=======
      <DataTable columns={columns} data={employees} />
>>>>>>> 71f519602206438d37608c9352d4c14e369f07df
    </div>
  );
};

export default EmployeeTable;
