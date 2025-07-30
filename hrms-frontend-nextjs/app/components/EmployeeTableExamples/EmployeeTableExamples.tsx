import React, { useState } from "react";
import EmployeeTable from "@/components/EmployeeTable/EmployeeTable";
import { EmployeeListItem, EmployeeRole, EmployeeStatus, EmployeeGender } from "@/types/types";
import { WEEK_WISE_COLUMN_CONFIG, DEPARTMENT_VIEW_COLUMN_CONFIG } from "@/types/columnConfig";
import { TableColumn } from "react-data-table-component";

const EmployeeTableExamples: React.FC = () => {
  const [activeView, setActiveView] = useState<'default' | 'week-wise' | 'department' | 'custom'>('default');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeListItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Mock employee data for examples
  const mockEmployees: EmployeeListItem[] = [
    {
      id: "1",
      fullName: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      phoneNumber: "123-456-7890",
      country: "United States",
      city: "San Francisco",
      birthDate: "1990-05-15",
      dateOfJoining: "2023-01-15",
      department: { id: 1, name: "Engineering" },
      role: EmployeeRole.EMPLOYEE,
      status: EmployeeStatus.ACTIVE,
      gender: EmployeeGender.MALE
    },
    {
      id: "2", 
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password456",
      phoneNumber: "098-765-4321",
      country: "United States",
      city: "New York",
      birthDate: "1988-08-22",
      dateOfJoining: "2023-03-20",
      department: { id: 2, name: "Marketing" },
      role: EmployeeRole.EMPLOYEE,
      status: EmployeeStatus.ACTIVE,
      gender: EmployeeGender.FEMALE
    }
  ];

  const handleEdit = (employeeData: EmployeeListItem) => {
    console.log('Edit employee:', employeeData.fullName);
    // Handle edit logic here
  };

  const handleDeleteClick = (employee: EmployeeListItem) => {
    setSelectedEmployee(employee);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    if (selectedEmployee) {
      console.log('Delete employee:', selectedEmployee.fullName);
      // Handle delete logic here
    }
    setShowDialog(false);
    setSelectedEmployee(null);
  };

  const closeDeleteDialog = () => {
    setShowDialog(false);
    setSelectedEmployee(null);
  };

  // Example: Custom column configuration for analytics view
  const analyticsColumns: TableColumn<EmployeeListItem>[] = [
    {
      name: "Employee",
      selector: (employee) => employee.fullName || "N/A",
      sortable: true,
    },
    {
      name: "Department",
      selector: (employee) => employee.department?.name || "N/A", 
      sortable: true,
    },
    {
      name: "Tenure (Days)",
      cell: (employee: EmployeeListItem) => {
        if (!employee.dateOfJoining) return "N/A";
        try {
          const joiningDate = new Date(employee.dateOfJoining);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - joiningDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays.toString();
        } catch {
          return "N/A";
        }
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (employee) => employee.status || "N/A",
      sortable: true,
    },
  ];

  const customAnalyticsConfig = {
    type: 'custom' as const,
    showSerialNumber: true,
    showMoreColumnsNavigation: false,
    showActions: true,
    sections: [],
    customColumns: analyticsColumns,
  };

  const renderTableView = () => {
    switch (activeView) {
      case 'week-wise':
        return (
          <EmployeeTable
            employees={mockEmployees}
            handleEdit={handleEdit}
            handleDeleteClick={handleDeleteClick}
            selectedEmployee={selectedEmployee}
            showDialog={showDialog}
            confirmDelete={confirmDelete}
            closeDeleteDialog={closeDeleteDialog}
            columnConfig={WEEK_WISE_COLUMN_CONFIG}
          />
        );
      case 'department':
        return (
          <EmployeeTable
            employees={mockEmployees}
            handleEdit={handleEdit}
            handleDeleteClick={handleDeleteClick}
            selectedEmployee={selectedEmployee}
            showDialog={showDialog}
            confirmDelete={confirmDelete}
            closeDeleteDialog={closeDeleteDialog}
            columnConfig={DEPARTMENT_VIEW_COLUMN_CONFIG}
          />
        );
      case 'custom':
        return (
          <EmployeeTable
            employees={mockEmployees}
            handleEdit={handleEdit}
            handleDeleteClick={handleDeleteClick}
            selectedEmployee={selectedEmployee}
            showDialog={showDialog}
            confirmDelete={confirmDelete}
            closeDeleteDialog={closeDeleteDialog}
            columnConfig={customAnalyticsConfig}
          />
        );
      default:
        return (
          <EmployeeTable
            employees={mockEmployees}
            handleEdit={handleEdit}
            handleDeleteClick={handleDeleteClick}
            selectedEmployee={selectedEmployee}
            showDialog={showDialog}
            confirmDelete={confirmDelete}
            closeDeleteDialog={closeDeleteDialog}
            // No columnConfig = uses default configuration
          />
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Employee Table Views</h1>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveView('default')}
            className={`px-4 py-2 rounded ${
              activeView === 'default' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Default View
          </button>
          <button
            onClick={() => setActiveView('week-wise')}
            className={`px-4 py-2 rounded ${
              activeView === 'week-wise' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Week-wise View
          </button>
          <button
            onClick={() => setActiveView('department')}
            className={`px-4 py-2 rounded ${
              activeView === 'department' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Department View
          </button>
          <button
            onClick={() => setActiveView('custom')}
            className={`px-4 py-2 rounded ${
              activeView === 'custom' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Analytics View
          </button>
          <button
            onClick={() => console.log('Refresh data functionality')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Refresh Data
          </button>
        </div>
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Current View: {activeView}</h3>
          <p className="text-sm text-gray-600">
            Total Employees: {mockEmployees.length}
          </p>
        </div>
      </div>

      {renderTableView()}
    </div>
  );
};

export default EmployeeTableExamples; 